---
layout: post
title: "Jetpack Compose Runtime新增API--retain"
date: 2025-10-04 21:45:48 +0800
tag: "Compose|Kotlin"
---

## Android的几种状态
### SavedState（onSaveInstanceState）
当 app 进入后台、甚至系统内存紧张需要回收进程时，Activity 在即将被系统销毁之前，会回调 onSaveInstanceState()。
 在这个回调中，我们可以把需要临时保留的 UI 状态（如滚动位置、输入内容的一部分等）写入传入的 Bundle。

### ViewModel 中保存的状态
Activity 在发生配置变化（如旋转屏幕、暗色模式切换等）时会被销毁并重建，此时 Activity 持有的普通字段状态会全部丢失。
 为了在配置变化过程中保持界面状态，AndroidX 提供了 ViewModel。


### UI持有的状态
Activity、Fragment或View等UI控件直接持有的, 与界面显示密切相关的数据。
这些状态通常依赖于UI的生命周期,当界面销毁或重建时, 这些状态也会随之消失。

## Compose的定位

Jetpack Compose使用Composable函数来声明UI。
表面上看，Composable函数是普通函数调用的嵌套结构，但Compose 的UI并不是直接由这些函数堆叠生成的对象树。
相反，每个Composable函数的调用，实质上是通过Composer对象进行操作，来描述UI的「声明式状态树」。
在编译期，Kotlin编译器会把每个Composable函数转换成如下形式：

```kotlin
@Composable
fun Greeting(name: String) {
    Text("Hello, $name!")
}
```

会被编译成：
```kotlin
fun Greeting(name: String, composer: Composer, changed: Int) {
    composer.startRestartGroup(123456789)
    if (changed != 0 && composer.skipping) {
        composer.skipToGroupEnd()
    } else {
        Text("Hello, $name!", composer, 0)
    }
    composer.endRestartGroup()
}
```
可以看到，Composable函数本质上就是一系列对Composer的调用。

在Android上，Jetpack Compose 实际上仍然依托于传统的 View 层级结构。
当你在 Activity或Fragment中调用：

```kotlin
setContent {
    MyApp()
}
```
时，Compose创建AndroidComposeView，并初始化一个与之绑定的 Composition，用来保存UI状态。

因此，Compose 的状态本质上是由 View 持有的，生命周期与该 View 一致。

## Compose的状态保持相关api

### remember

`remember`用于在同一个`Composition`生命周期内记住某个值，
即使 Composable 函数被多次重组，该值也不会丢失。

从实现角度看，`remember`会把状态存储在当前Composition的 SlotTable中，。当 UI 发生重组时，Compose会通过SlotTable取回上次保存的值，而不是重新执行初始化逻辑。

```kotlin
val state = remember { mutableStateOf(0) }
```

当传入的 key 发生变化时, Compose 会认为原来的状态已经失效，重新创建并替换新的实例。

```kotlin
val color = remember(user.id) { fetchUserColor(user) }
```

#### rememberSaveable
rememberSaveable 底层用的是 SavedStateRegistry/ onSaveInstanceState(Bundle)这一套机制。
因此，它可以在以下两种情况下恢复状态：
 - Configuration 变化导致的 Activity 重建
 - 系统在后台回收进程后，从“最近任务”返回 App

在实际 App 开发中，不太适合把 rememberSaveable 当作“应用级状态”的通用方案。

rememberSaveable 的底层是把状态写进 Bundle（通过 SavedStateRegistry / onSaveInstanceState），
这就意味着它能保存的类型必须是：

 - 基本类型（Int / Long / Float / Boolean / String 等），或

 - Parcelable / Serializable，

 - 通过 Saver 再包装成上面这些可写进 Bundle 的类型。

真正的业务代码应该写在Viewmodel里。 但是在很久的时间，Compose并不支持持有可以跨越应用重建的状态， 直到 Compose Runtime 引入了 retain { ... } 这一套 API，Compose才多出了一种新的能力。

## Game Changer - Retain

### ViewModle的局限
虽然 ViewModel 可以跨越配置变化、避免 Activity 重建时状态丢失，但在实际使用中也有一些不太舒服的地方：

 - 构造函数受限制

默认情况下，系统只支持无参构造函数，或者特定签名（比如带 SavedStateHandle）的构造函数， 如果你的 ViewModel 需要业务上的自定义参数，就必须手写一个自定义的ViewModelProvider.Factory，或者引入DI框架（Hilt / Koin / Dagger 等）帮助生成这些工厂。

 - 构造方式被框架绑死

ViewModel 的生命周期天然是“宿主级别”的：
 - Activity 级 ViewModel：随 Activity 创建与销毁；
 - Fragment 级 ViewModel：随 Fragment 的 View 生命周期或整个 Fragment 生命周期（取决于用哪种 owner）；
 - Navigation 级 ViewModel：随某个 NavBackStackEntry（页面/目的地）存在。
 
如果我们只想在「页面内部的一小块 UI」显示时创建状态、隐藏时就立刻回收状态，
例如：某个局部面板、抽屉、对话框、Tab 内容等，
ViewModel 就显得不够合适。

### Retain 的设计思路

retain { }方法中保持的对象会被存储在RetainedValuesStore中。
它的工作机制在[RetainedValuesStore的注释](https://github.com/androidx/androidx/blob/0fde915fbdcaa0cc8a901390bb195202a9f9914a/compose/runtime/runtime-retain/src/commonMain/kotlin/androidx/compose/runtime/retain/RetainedValuesStore.kt#L30
)中说的很明白了。

```kotlin
public interface RetainedValuesStore {
    public fun getExitedValueOrElse(key: Any, defaultValue: Any?): Any?
    public fun saveExitingValue(key: Any, value: Any?)
    public fun onContentEnteredComposition()
    public fun onContentExitComposition()
}
```

1. 内容准备退出 Composition

RetainedValuesStore.onContentExitComposition() 被调用，系统知道这块 Composable 要从界面树中移除了。

2. 开始“临时移除”
内容会被重新计算、从层级里摘掉。

- 普通 remember 的值会被忘记；

- 但用 retain { … } 保存的值不会立刻释放。

这些值会交给 saveExitingValue() 暂存起来，以便之后能取回。

3. 一段时间后被重新安装
如果这段内容再次进入 Composition，运行时会调用 getExitedValueOrDefault()：

 - 若 key 匹配，之前的值就被恢复， 并且从「暂存池」中移除。

4. 完全恢复后

当这块内容重新稳定地进入 Composition，
调用 onContentEnteredComposition()，
清理那些已经被替换或不再使用的保留值。

### 应用场景

RetainedValuesStore在Android中是托管在ViewModel里的，所以他自然可以跨越Activity重建，下面我来说他是怎么解决ViewModel的痛点的。

#### 创建一个retain生命周期的CoroutineScope

retain { … }保存的值，如果实现了RetainObserver接口，在值被保持/被废弃的时候，会收到onRetained/onRetired回调。 当onRetired调用的时候，我们给当前scope发一个cancel信号，就可以拿到一个与retain保存的值相同生命周期的CoroutineScope了。

```kotlin
interface ScopedObserver :
    RetainObserver,
    CoroutineScope

class ScopedObserverImpl : ScopedObserver {
    private val job = SupervisorJob()

    override val coroutineContext: CoroutineContext = Dispatchers.Main + job

    override fun onRetained() {}

    override fun onEnteredComposition() {}

    override fun onExitedComposition() {}

    override fun onRetired() {
        job.cancel()
    }

    override fun onUnused() {
        job.cancel()
    }
}
```

#### 更轻松的依赖注入

上面说到ViewModel的自定义构造参数很麻烦，如果用retain api的话， 我们可以直接这样做:

```kotlin
@Composable
fun rememberTabContentUiPresenter(
    tabType: TabType,
    repository: Repository = LocalRepository.current,
): Presenter<TabContentState> =
    retain(
        tabType,
        repository,
    ) {
        TabContentUiPresenter(  // TabContentUiPresenter implement ScopedObserver 
            tabType,
            repository
        )
    }
```

TabContentUiPresenter 继承了 ScopedObserver， 所以在Presenter里拥有一个与这个对象相同生命周期的scope，当他被回收是， 里面启动的协程就会都被cancel。

tabType 作为 key，用来标识当前保留的实例“属于哪个 Tab”。
当传入的 tabType 发生变化时：
- 旧的 TabContentUiPresenter 会被视为“已经退出、不可再复用”的实例；
- 对应的 ScopedObserver.onRetired() / onUnused() 会被调用；
- 然后 retain(tabType) { ... } 会基于新的 tabType 构造一个 全新的 TabContentUiPresenter

```kotlin
@Composable
fun TabContentScreen(
    selectedTab: TabType,
) {
    val presenter = rememberTabContentUiPresenter(selectedTab)
    val state by presenter.state.collectAsState()

    Column {
        TabContent(
            state = state,
            onEvent = presenter::onEvent,
        )
    }
}
```
这样。
UI 只关心当前 selectedTab，Presenter 的生命周期和协程管理全部交给 retain + ScopedObserver 去处理，既不用 ViewModel，也没有构造参数的限制。