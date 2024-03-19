---
layout: post
title:  "Flutter中从Sqflite迁移到Drift（1）"
date:   2024-03-12 20:06:18 +0900
---

作为一个Android出身的Flutter初学者， 我学习flutter的方式是是Flutter pub中寻找与Android中相同功能的库。

android开发时， 很多解决方案基本都是官方都已经给了，官网上有详细介绍。
但是Flutter的官方并没有提供太多的开源库。一般社区会有很多解决方案， 这就难为了我这种选择困难症了。

这里简单聊一下：

### 状态管理

Android中用的是Jetpack的ViewModel。 
安卓中的状态管理还是比较麻烦的， 因为Android的Activity有重建的问题， 所以我们不能直接把状态写在Activity中，
所以就有了ViewModel。

类似的是Flutter Sdk中给出了StatefulWidget， 当Widget树重建的时， StatefulWidget中的状态会保持。
但是这种写法的代码是不易读， 而且控制UI更新的方法也比较麻烦，所以Flutter出现了很多状态管理的库。

最流行的库是GetX，它给出了一种很方便的使用方式，他把所有的Controller放在一个单例中管理， 可以通过静态方法调用。

```dart
  final Controller c = Get.find();
```

这种方式可以很方便的取得一个Controller实例， Controller的生命周期也是由GetX来管理的， 我们也不需要管。
但是有一个问题， 状态管理是属于UI层的， 我们也可以在Data层取到这些Controller， 因为调用的方法也是静态的。

我工作时候的项目就是用的GetX， 由于管理不是很严， 代码写的也是比较随意， 导致Controller到处都在用，可维护性极差。 不是说这个库不好， 而是他不能限制住使用者。
所以我没有使用他。

然后我发现了Bloc。
Bloc的推荐的架构和Android是一样的， bloc是作为UI层和Data层连接的角色， UI的事件传到Bloc， Bloc通知State层，
并等待State层的响应， 并触发Bloc中状态的变化。

与GetX不同， Bloc的状态是与BuildContext中管理的。他随着BuildContext的生命周期创建和销毁， 所以它是完全交给开发者控制的。

### 路由管理
路由的库也有很多，我用的是官方的Navigation 2.0。 有官方的解决方案， 我还是不喜欢用库。。

### 网络请求
没有详细查， Dio似乎是唯一解？

### 数据库
开发的时候做的调查不是很充分，选择了最流行的Sqflite。 他就是通过MethodChannel调用原声端，
而且对sql做了简单的包装， 总体来说还是很好用的。 

**但是，sqflite不支持反应式编程**

在Android中，我们一般用Room来写数据库， 他可以直接返回一个冷流Flow， 直接可以监听数据库的变化。
我们做反应式的编成一定是需要我们的数据源是可以监听变化的。
如果选择数据库作为数据源，Sqflite很明显就不适合了。

当时没有作太多调研， 直接选择自己写一个监听体系。

修改数据库时需要手动通知改了那些表。

创建Stream时我们需要给出这个流会受哪些表的变化影响。

代码：
```dart
mixin DbChangedNotifierMixin {
  final Map<DatabaseTablesKey, ValueNotifier<int>> _tablesNotifiers = {};

  void notifyChanged([List<String> changedTableNames = const []]) {
    _tablesNotifiers.forEach((key, notifier) {
      if (key.haveTableIn(changedTableNames)) {
        notifier.notifyChanged();
      }
    });
  }

  Stream<T> createStream<T>(
    List<String> tableNames,
    Future<T> Function() onGetData,
  ) {
    final changeSources = _tablesNotifiers.putIfAbsent(
        DatabaseTablesKey({...tableNames}), () => ValueNotifier(0));

    return StreamUtil.createStream(
      changeSources,
      onGetData,
    );
  }
}
```

这种方法可以实现， 但是我们需要手动通知修改了哪些表， 这有可能会写错，造成bug发生。

### Drift真香啊
最近发现了Drift这个库， 他本身就做了反应式的设计， 并且给Sql做了一套全面的支持， 无疑时Sqflite的上位替代。

Drift的优点
- 由dart ffi调用， 无须Method channel， 速度会快。
- 使用sqLite3， 效率比Android原生好一些。
- 无须手写sql， 有框架支持可以在编译时期排除很多问题。

Drift的缺点
- 原生平台的debug工具不能用了

发现了这个库之后， 我开始了迁移工作， 意外的很简单， 直接对着代码一行一行翻译就ok了。
最近也完成了迁移的工作， 有时间写下具体的内容和遇到的问题。

https://github.com/andannn/aniflow/pull/71