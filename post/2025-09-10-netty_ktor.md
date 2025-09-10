---
layout: post
title: "Ktor学习"
date: 2025-09-10 11:45:48 +0800
tag: "Kotlin|Backend|Netty"
---

最近想补一下网络编程的知识，最热门的肯定是Spring Boot，但是我对于Spring的框架设计很反感，我也不是很熟悉Java反射的api，所以阅读源码很困难。

Ktor是JetBrains推出的「协程优先的异步、非阻塞」HTTP框架。
总结一下这几天的理解。

### 在Java生态上构建
Ktor本身是一个多平台的FrameWork，Jvm上通过调用Netty，Jetty实现。 在Native平台， 通过Jetbrains基于协程实现的CIO实现Http/1协议，可惜的是至今没有支持Http/2。
Kotlin最开始是建立在Jvm生态上的语言，他可以用Jvm丰富的生态来让Ktor快速推广到商用稳定阶段，其他的平台上Ktor没有这个优势，以至于在Native平台上， Ktor基本不能用于商用。

Netty是基于Java NIO设计的非阻塞异步事件驱动网络库，他是一个相对底层的api，用Netty直接开发的难度较高，而且容易出错。

Spring WebFlux就是基于Netty设计的，他用Reactor来处理事件流， 相对来说更适合写业务。
但是Spring WebFlux仍然难用，处理多个流的时候，不得不组合Mono/Flux，而这样的写法既繁琐，可读性又差。
Spring一直在与Kotlin进行深度合作， 现在可以用协程api来替代Mono/Flux，利用Kotlin强大的协程API，可以简化写法。

而Ktor相比于SpringWebFlux，他从核心的设计上就是基于协程的，对于Kotlin user来说用着更自然，而且底层是Netty又保证了并发性能和稳定性。

### Ktor的PipeLine
ktor有Server端和Client端实现， 这两段都是基于Pipeline工作流设计的。
ktor预先定义了一些“Phase”，Ktor插件里用拦截器可以挂在这些Phase上，实现不同的处理逻辑。

我整理了server端的Pipeline：

- EnginePipeline

当Netty收到请求时，执行EnginePipeline把请求交给Ktor处理。

- ApplicationCallPipeline

寻找匹配的Router处理业务逻辑。

- ApplicationReceivePipeline

call.receive<T>() 触发。获得请求里的body， 并进行反序列化操作

- ApplicationSendPipeline

call.respond(...) 触发。ApplicationSendPipelin，在最后的“Engineg Phase“上把相应结果交给Netty

![image4](/images/20250910-172725.jpeg)


