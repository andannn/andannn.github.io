---
layout: post
title:  "添加Flutter fragment到已有的Actvity中"
date:   2024-02-28 21:06:08 +0900
---

最近在研究flutter最为android library集成到Android工程的课题。
思路就是利用android的Navigation库，
让Navigation库来管理Fragment，这些Fragment可能是Android的页面， 也可能是Flutter的页面。

#### FlutterFragment结合Navigation库使用

FlutterFragment提供了一个静态方法， 可以创建出一个Fragment实例， 但是
Navigation库中， 我们不需要创建出Fragment实例， 而是在xml中声明出不同的Fragment。
所以这种形式不适合Navigation库。
```java
  @NonNull
  public static FlutterFragment createDefault() {
    return new NewEngineFragmentBuilder().build();
  }
```
代替方案是： 
 - 用`childFragmentManager`启动一个FlutterFragment。
 - 创建时设置`dartEntrypointArgs`以启动不同的页面。 
 - 继承`FlutterContainerFragment`的子类就可以重写这个初始值。
 - xml中声明这些Fragment， 以使用Navigation库启动。

```java
abstract class FlutterContainerFragment : Fragment() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        if (savedInstanceState == null) {
            val flutterFragment =
                FlutterFragment.NewEngineFragmentBuilder(
                    CustomFlutterFragment::class.java,
                ).apply {
                    // handle back key in flutter engine.
                    shouldAutomaticallyHandleOnBackPressed(true)
                    dartEntrypointArgs(listOf(flutterScreenName))
                }.build<CustomFlutterFragment>()
            childFragmentManager
                .beginTransaction()
                .add(
                    R.id.flutter_container,
                    flutterFragment,
                    TAG_FLUTTER_FRAGMENT,
                )
                .commit()
            )
        }
    }
}
```
```xml
    <navigation
        android:id="@+id/login_navigation"
        app:startDestination="@id/FlutterLoginA">

        <fragment
            android:id="@+id/FlutterLoginA"
            android:name="com.example.testfluttermodel.feature_login.FlutterLoginA">
        </fragment>

        <fragment
            android:id="@+id/FlutterLoginB"
            android:name="com.example.testfluttermodel.feature_login.FlutterLoginB">
        </fragment>
    </navigation>
```

#### 难题
实现过程中虽然有一些课题， 但是都研究解决了， 但是有个无解的问题。
就是Activity/Fragment重建的时候， Flutter引擎不能保持。
每次屏幕旋转， FlutterFragment就重建了， 重建是正常现象， 但是Flutter engine也重建。。。

我求助了万能的ChatGpt。

> FlutterActivityAndFragmentDelegate在Attach时Engine会创建， 在Detach时会销毁， 所以Fragment在configuration变化时， flutter引擎状态是不可能保持的， 我的理解对么

> 你的理解是正确的。在Flutter中，通常在FlutterActivity 或 FlutterFragment 的生命周期中会创建一个 Flutter 引擎，并在它们被销毁时销毁引擎。这意味着当 FlutterActivity 或 FlutterFragment 被销毁时，其中的 Flutter 引擎也会被销毁，因此引擎的状态不会被保持。
>
> 在Android中，当配置发生变化时，如屏幕方向或语言环境的变化，系统会销毁并重新创建Activity（或Fragment）。这会导致之前的Flutter引擎被销毁，因为它们是与Activity（或Fragment）相关联的。因此，即使使用retainInstance或其他方法保持Activity（或Fragment）的实例，Flutter引擎的状态也是不可能被保持的。

ChatGpt给出了解答， Flutter Engine不能可能保持。

**留给我们的只有两条路**

 - 用`CachedEngineFragmentBuilder`创建CachedEngine
 - AndroidManifest中设置`android:configChanges`， 防止重建

第二种方法不用考虑， 因为我们只是写一个Fragment， 不可能要影响Activity的属性。 这种对策只能是写一些需求不高的app。

第一种方法理论上是可行的， 我们可以创建一个缓存的引擎， 在Fragment重建时保留， 退出时销毁。

取flutter引擎时， 先从一个`FlutterEngineCache`单例中找。 如果找不到就创建一个新的引擎放到单例中。

FlutterActivityAndFragmentDelegate.java
```java
    String cachedEngineId = host.getCachedEngineId();
    if (cachedEngineId != null) {
      flutterEngine = FlutterEngineCache.getInstance().get(cachedEngineId);
      isFlutterEngineFromHost = true;
      if (flutterEngine == null) {
        throw new IllegalStateException(
            "The requested cached FlutterEngine did not exist in the FlutterEngineCache: '"
                + cachedEngineId
                + "'");
      }
      return;
    }
```
这种方法可能内存占用高， 因为Flutter team在新版本增加了一种创建方法。
利用`FlutterEngineGroupCache`创建dart虚拟机可以共享一些资源， 说是内存占用小一些。
这方面没有测试过， 但是我们如果需要解决这种重建问题， 就不能用这种启动方法了。。
```java
    String cachedEngineGroupId = host.getCachedEngineGroupId();
    if (cachedEngineGroupId != null) {
      FlutterEngineGroup flutterEngineGroup =
          FlutterEngineGroupCache.getInstance().get(cachedEngineGroupId);
      if (flutterEngineGroup == null) {
        throw new IllegalStateException(
            "The requested cached FlutterEngineGroup did not exist in the FlutterEngineGroupCache: '"
                + cachedEngineGroupId
                + "'");
      }

      flutterEngine =
          flutterEngineGroup.createAndRunEngine(
              addEntrypointOptions(new FlutterEngineGroup.Options(host.getContext())));
      isFlutterEngineFromHost = false;
      return;
    }
```

*以上内容是个人研究， 可能有错误*

[Github Source](https://github.com/andannn/TestFlutterModel)
