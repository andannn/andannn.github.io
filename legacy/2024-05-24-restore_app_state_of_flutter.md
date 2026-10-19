---
layout: post
title:  "Flutter实现app被系统回收后恢复状态"
date:   2024-05-24 14:59:18 +0800
tag: "Flutter"
---

Android里的状态管理相对说比较复杂，按生命周期从短到长分为以下几种：

 - ViewStateHolder： View里初始化的变量， 与View的生命周期绑定。
 - ActivityScope：与Activity绑定， 如果Config变化（屏幕旋转， 改语言），Activity就会销毁。
 - ActivityRetainedScope： 跨越Activity的重建与销毁， 保持状态。
 - Singleton: 与Application的实例绑定， 如果低内存被回收， 或app从recent被kill， 相应的实例也被销毁。
 - SavedState：如果因为app长时间不在前台， 或者低内存被回收， 状态会保持在SavedStateHandle里。

FlutterActivity的Flutter引擎是与Activity绑定的， Activity销毁了后， Flutter引擎也随之销毁。
但是这不是很糟糕么？ 屏幕旋转，或者改语言后， Flutter引擎就要重建， 状态也都丢掉。

FlutterActivity在AndroidManifest.xml里配置了一下configChanges。
当这些配置变化时，Activity会自行处理，而不会重建。
```xml
android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
```

所以Flutter相当于ActivityRetained，不会受Config变化的影响。
但是如果低内存时， FlutterActivity被回收了，状态就会消失。
所以Flutter需要负责把需要保持的状态存到SavedInstance里。
处理这件事的就是RestorationManager。

简单来说， 就是通过MethodChannel， Flutter把要保存的状态交给Android侧， 当Activity重建时， Android侧把保存的状态交给Flutter。

Flutter侧使用时， 需要在Flutter树的顶层设置一个RootRestorationScope， 保证子节点可以用`RestorationScope.of`访问`RestorationBucket`，

