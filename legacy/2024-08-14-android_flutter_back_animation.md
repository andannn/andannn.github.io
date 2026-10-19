---
layout: post
title: "Android 14 Predictive back design"
date: 2024-06-03 10:53:28 +0800
tag: "Android"
---

### Android中back key的分发机制

最开始的时候，Android中的back key是由Activity来处理的，Activity中有一个onBackPressed()方法，当用户按下back key的时候，会调用这个方法。
现在的android app推荐使用单个Activity多个Fragment来构建UI，而Fragment是不能收到Back
key事件的，所以androidx中提供了一个OnBackPressedDispatcher类来处理back key事件的分发。

首先ComponentActivity实现了`OnBackPressedDispatcherOwner`接口，接口中提供一个`OnBackPressedDispatcher`对象。
这个`OnBackPressedDispatcher`的构造函数中传入一个`fallbackOnBackPressed`的函数，这个函数会在所有的`OnBackPressedCallback`
都没有处理back key事件的时候调用。
Fragment启动时可以设置`OnBackPressedCallback`，当用户按下back key的时候，`OnBackPressedDispatcher`负责分发back
key事件给最后注册的，并且是enable状态的`OnBackPressedCallback`。

这段代码可以说明上述的机制。

androidx/activity/OnBackPressedDispatcher.kt

```kotlin
    @MainThread
fun onBackPressed() {
    val callback = inProgressCallback ?: onBackPressedCallbacks.lastOrNull {
        it.isEnabled
    }
    inProgressCallback = null
    if (callback != null) {
        callback.handleOnBackPressed()
        return
    }
    fallbackOnBackPressed?.run()
}
```

### Android 14 Predictive back design

在Android 14中，新增了Predictive back design来处理back key事件。
https://developer.android.com/design/ui/mobile/guides/patterns/predictive-back

简单来说，可以通过侧边手势来触发back key事件，并且在按下过程中， UI会有一个预测的动画，来提示用户即将返回上一个页面，
如果用户不想返回，
可以取消这个操作。 这样的设计避免了误操作， 提高了用户体验。

代码上的实现的话， `OnBackPressedCallback` 新增了`handleOnBackStarted`, `handleOnBackProgressed`, `handleOnBackCancelled`
三个函数，分别对应手势按下开始，过程中和取消的事件。
同样`OnBackPressedDispatcher`只会分发给最后注册的，并且是enable状态的`OnBackPressedCallback`。

### Flutter的适配

Flutter从3.19版本开始，到现在的3.24版本，做了多个Breaking change来适配Android 14的Predictive back design。

1. 3.19版本舍弃了`WillPopScope

https://docs.flutter.dev/release/breaking-changes/android-predictive-back

原因简单来说，`WillPopScope`只能处理手势抬起的事件，而Android 14的Predictive back design需要处理手势按下开始，过程中和取消的事件。

3.19版本新增了`PopScope`来适配Android 14的Predictive back design。

PopScope控件会在当前页面注册一个PopEntry, 当页面里所有注册的`PopEntry`的`canPop`都为true时， 才可以返回上一个页面,
只要有一个`canPop`为false，就会阻止页面返回。

相关代码：

flutter/packages/flutter/lib/src/widgets/routes.dart

```dart
  RoutePopDisposition get popDisposition {
  for (final PopEntry<Object?> popEntry in _popEntries) {
    if (!popEntry.canPopNotifier.value) {
      return RoutePopDisposition.doNotPop;
    }
  }

  return super.popDisposition;
}
```

并且如果当页面的是最后一个页，并且没有enabled的`PopEntry`，就会通过Method Channel设置`OnBackPressedCallback`为false， 使其在接受back key时直接退出app。

具体实现：
1. 每次PopEntry的canPop值变化时会调用`_maybeDispatchNavigationNotification`函数，来通知
flutter/packages/flutter/lib/src/widgets/routes.dart
```dart 
  void _maybeDispatchNavigationNotification() {
    if (!isCurrent) {
      return;
    }
    final NavigationNotification notification = NavigationNotification(
      // canPop indicates that the originator of the Notification can handle a
      // pop. In the case of PopScope, it handles pops when canPop is
      // false. Hence the seemingly backward logic here.
      canHandlePop: popDisposition == RoutePopDisposition.doNotPop,
    );
    // Avoid dispatching a notification in the middle of a build.
    switch (SchedulerBinding.instance.schedulerPhase) {
      case SchedulerPhase.postFrameCallbacks:
        notification.dispatch(subtreeContext);
      case SchedulerPhase.idle:
      case SchedulerPhase.midFrameMicrotasks:
      case SchedulerPhase.persistentCallbacks:
      case SchedulerPhase.transientCallbacks:
        SchedulerBinding.instance.addPostFrameCallback((Duration timeStamp) {
          if (!(subtreeContext?.mounted ?? false)) {
            return;
          }
          notification.dispatch(subtreeContext);
        }, debugLabel: 'ModalRoute.dispatchNotification');
    }
  }
```

2. WidgetApp控件中有一个NotificationListener监听每个页面发来的通知。并通过Method Channel来设置OnBackPressedCallback的enable状态。
https://github.com/flutter/flutter/blob/9308a799c6e3d1aaca4d473d4828990e6369f77e/packages/flutter/lib/src/widgets/app.dart#L1367
```dart
  bool _defaultOnNavigationNotification(NavigationNotification notification) {
    switch (_appLifecycleState) {
      case null:
      case AppLifecycleState.detached:
      case AppLifecycleState.inactive:
        // Avoid updating the engine when the app isn't ready.
        return true;
      case AppLifecycleState.resumed:
      case AppLifecycleState.hidden:
      case AppLifecycleState.paused:
        SystemNavigator.setFrameworkHandlesBack(notification.canHandlePop);
        return true;
    }
  }
```

https://github.com/flutter/engine/blob/532955d81df492cb91b400a0032001bb004c7c42/shell/platform/android/io/flutter/embedding/android/FlutterFragment.java#L1690
```java
  @Override
  public void setFrameworkHandlesBack(boolean frameworkHandlesBack) {
    if (!getArguments().getBoolean(ARG_SHOULD_AUTOMATICALLY_HANDLE_ON_BACK_PRESSED, false)) {
      return;
    }
    onBackPressedCallback.setEnabled(frameworkHandlesBack);
  }
```



