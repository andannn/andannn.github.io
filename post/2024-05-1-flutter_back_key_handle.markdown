---
layout: post
title:  "Flutter 处理Android端的back key的方式"
date:   2024-05-01 11:36:18 +0800
---

Android端保留了物理返回键，一般来说， 物理返回键是最优先的，不论页面在loading， 还是error状态， 都不能
阻塞物理返回键。 这样用户体验会好很多。 
但是这加大了开发的难度， 耗时的异步操作都应该有取消操作，想象一下如果不取消， 用户快速推出再进入页面， 就会有
很多耗时任务被创建出来一起执行， 这不但消耗性能， 而且可能会造成很多奇怪的BUG。

Flutter处理back key的方法貌似很复杂， 我之前捋过一遍，第二次看又忘了😄。 
这里整理出这套流程， 仅作为MEMO用。

### Activity -> Flutter 事件传递
首先是`FlutterActivity`收到BackKey按下事件的通知。然后交给了`FlutterActivityAndFragmentDelegate`处理。
然后调用了`navigationChannel`通知给Flutter端。
https://github.com/flutter/engine/blob/b9389a920220fb10aacb6137f90a7b6f5afd4a8a/shell/platform/android/io/flutter/embedding/android/FlutterActivityAndFragmentDelegate.java#L778
```java
  void onBackPressed() {
    ensureAlive();
    if (flutterEngine != null) {
      Log.v(TAG, "Forwarding onBackPressed() to FlutterEngine.");
      flutterEngine.getNavigationChannel().popRoute();
    } else {
      Log.w(TAG, "Invoked onBackPressed() before FlutterFragment was attached to an Activity.");
    }
  }
```

当`WidgetsFlutterBinding.ensureInitialized()` 调用的时候， Navigation的MethodChannel被初始化。

当channel的popRoute方法调用时， 首先遍历`WidgetsBindingObserver`的数组， 如果没有`WidgetsBindingObserver`处理这个事件， 则调用`SystemNavigator.pop()`，直接退出app。
https://github.com/flutter/flutter/blob/3e399c1578b3f1199c2cb068d808738ad704698c/packages/flutter/lib/src/widgets/binding.dart#L413
```dart
  @override
  void initInstances() {
...
    SystemChannels.navigation.setMethodCallHandler(_handleNavigationInvocation);
...
  }

  Future<dynamic> _handleNavigationInvocation(MethodCall methodCall) {
    return switch (methodCall.method) {
      'popRoute' => handlePopRoute(),
      'pushRoute' => handlePushRoute(methodCall.arguments as String),
      'pushRouteInformation' => _handlePushRouteInformation(methodCall.arguments as Map<dynamic, dynamic>),
      _ => Future<dynamic>.value(),
    };
  }

  Future<void> handlePopRoute() async {
    for (final WidgetsBindingObserver observer in List<WidgetsBindingObserver>.of(_observers)) {
      if (await observer.didPopRoute()) {
        return;
      }
    }
    SystemNavigator.pop();
  }
```

### RootBackButtonDispatcher处理BackKey事件
RootBackButtonDispatcher如果有Callback， 则会向`WidgetsBinding`注册监听。
收到了`didPopRoute`事件时， 触发这个callback。
https://github.com/flutter/flutter/blob/3e399c1578b3f1199c2cb068d808738ad704698c/packages/flutter/lib/src/widgets/router.dart#L1052C1-L1075C1
```dart
class RootBackButtonDispatcher extends BackButtonDispatcher with WidgetsBindingObserver {
  /// Create a root back button dispatcher.
  RootBackButtonDispatcher();

  @override
  void addCallback(ValueGetter<Future<bool>> callback) {
    if (!hasCallbacks) {
      WidgetsBinding.instance.addObserver(this);
    }
    super.addCallback(callback);
  }

  @override
  void removeCallback(ValueGetter<Future<bool>> callback) {
    super.removeCallback(callback);
    if (!hasCallbacks) {
      WidgetsBinding.instance.removeObserver(this);
    }
  }

  @override
  Future<bool> didPopRoute() => invokeCallback(Future<bool>.value(false));
}
```

这个callback是在`Router`初始化时设置的。 然后调用了`RouterDelegate`的`popRoute`相应了backKey事件。
```dart
class _RouterState<T> extends State<Router<T>> with RestorationMixin {
...
  @override
  void initState() {
    super.initState();
    widget.routeInformationProvider?.addListener(_handleRouteInformationProviderNotification);
    widget.backButtonDispatcher?.addCallback(_handleBackButtonDispatcherNotification);
    widget.routerDelegate.addListener(_handleRouterDelegateNotification);
  }

  Future<bool> _handleBackButtonDispatcherNotification() {
  _currentRouterTransaction = Object();
  return widget.routerDelegate
      .popRoute()
      .then<bool>(_handleRoutePopped(_currentRouterTransaction));
  }
...
}
```




