---
layout: post
title: "Kotlin Basic"
date: 2025-07-07 11:45:48 +0800
tag: "Compose|Android"
---

## What you can learn
- Kotlin语言基础和进阶特性
- 声明式UI框架 Compose
- 使用Kotlin Multiplatform实现Android/iOS共享代码

## Kotlin 发展史
- **2016**  
  发布**Kotlin 1.0**（API稳定）

- **2017**
  
  在Google I/O 2017，Google宣布：
  “Kotlin is now an officially supported language for Android.”

- **2019**  

  在Google I/O 2019，Google再次宣布：
  “Android development will become increasingly Kotlin-first.”

- **2020–2023**  
  Kotlin Multiplatform (KMP)快速发展，支持Android/iOS共享代码

- **2024**  
  Kotlin 2.0.0版本, Kotlin K2编译器发布了稳定版本。

- **2025**  
  Compose Multiplatform发布1.8版本- iOS稳定版本。

## Kotlin 简介

Kotlin最初是一门JVM语言，核心是生成JVM字节码，可以在Java虚拟机上运行。
它与Java具备完美的互操作性 (Interoperability)，同时拥有更现代的语法和丰富的语言特性，深受Android开发者的喜爱。

 - 空安全（Null Safety）：在编译期防止空指针异常（NPE）。
 - 扩展函数（Extension Functions）：可以为现有类添加新功能而不修改源码。
 - 数据类（Data Classes）：自动生成toString()、equals()等方法。
 - 智能类型转换（Smart Casts）/ 类型推导（Type Inference）: 面向对象编程
 - Lambda表达式和高阶函数：更方便进行函数式编程。
 - 协程（Coroutines）：简化异步编程。

详细可以看官方文档： https://kotlinlang.org/docs/basic-syntax.html

## Kotlin Multiplatform (KMP) 的优点

### 性能上接近原生。  

Kotlin代码会根据平台，编译对应平台的Binary。

例如在Android上，它编译的是JVM字节码， 在iOS上编译成原生机器码 (Native binary)，生成一个 **.framework**。

### 能够利用完整的平台功能

KMP通过expect/actual机制，可以调用平台API。（如Android SDK、iOS UIKit）

Flutter / React Native虽然能跨平台，但由于它们使用独立的运行时（Dart VM 或 JavaScript Engine），和Android/iOS系统原生运行时是分开的。
因此，需要通过 **桥接层** 进行通信：
- Flutter通过Platform Channels
- React Native通过Bridge通信

这种方式在调用原生功能时，
有性能开销（序列化/反序列化，线程切换）。调试和维护复杂。

KMP不使用单独的虚拟机或运行时，而是直接编译成平台原生产物，调用原生API就是同一进程、同一语言层级的直接函数调用，没有桥接开销。

### 渐进式集成
KMP支持函数级别粒度的共享，让你可以非常灵活地渐进式集成跨平台能力。

共享逻辑的范围完全自由：
可以是一个函数， 一个工具类， 或者整个数据层，甚至UI+数据层都由Kotlin实现。 

[image1](../public/images/image3.png)

### Compose Multiplatform统一UI

Compose Multiplatform（以下称CMP）是Jetbrains基于Google的Jetpack Compose做的拓展， 增加了iOS，Desktop，Web的target。

- 在android上，CMP使用的仍然是Google的实现，所以在Android上没有任何兼容性问题。
- 其他端使用的Skia作为底层绘制引擎，能保证UI描画统一。

### 更轻松的调用平台原生画面

在跨平台开发中，不可避免的需要调用平台的View，例如地图，广告，相机，视频播放器。

KMP提供了更直接的原生视图互操作性。 例如在iOS端，Kotlin可以直接将UiViewController嵌入到ComposeView体系。

## Kotlin Multiplatform (KMP) 的缺点

### 社区支持较差

Flutter/React Native开发中，几乎可以找到所有原生对应的第三方库，即使完全不懂原生开发，也可以通过用第三方库实现功能。KMP社区刚刚起步，没有那么多开源支持。

### 开发者技能要求比较高

因为第三方支持比较少， 原生平台开发的技能和Kotlin开发的知识必不可少。

### iOS上UI的渐进式集成对内存压力比较大

由于iOS端上使用的是Skia引擎绘制的，如果需要从原生iOS工程中逐步把UI迁移到Compose， 这种做法会初始化更多的Skia实例造成内存占用过高。


## Kotlin Multiplatform 应用事例

- X（旧推特）用KMP重构
https://www.youtube.com/watch?v=z-u99yZFn5o

[image4](../public/images/image4.png)

- Bilibili使用KMP共享数据层和UI
https://www.youtube.com/watch?v=YKTlW8Qkj0w&t=340s

[image5](../public/images/image4.png)
