---
layout: post
title: "Ktor学习"
date: 2025-09-10 11:45:48 +0800
tag: "Kotlin|Backend|Netty|Ktor"
---

最近想补一下网络编程的知识，最热门的肯定是Spring Boot，但是我对于Spring的框架设计很反感，我也不是很熟悉Java反射的api，所以阅读源码很困难。

Ktor是JetBrains推出的「协程优先的异步、非阻塞」HTTP框架。
总结一下这几天的理解。

## 在Java生态上构建
Ktor本身是一个多平台的FrameWork，Jvm上通过调用Netty，Jetty实现。 在Native平台， 通过Jetbrains基于协程实现的CIO实现Http/1协议，可惜的是至今没有支持Http/2。
Kotlin最开始是建立在Jvm生态上的语言，他可以用Jvm丰富的生态来让Ktor快速推广到商用稳定阶段，其他的平台上Ktor没有这个优势，以至于在Native平台上， Ktor基本不能用于商用。

Netty是基于Java NIO设计的非阻塞异步事件驱动网络库，他是一个相对底层的api，用Netty直接开发的难度较高，而且容易出错。

Spring WebFlux就是基于Netty设计的，他用Reactor来处理事件流， 相对来说更适合写业务。
但是Spring WebFlux仍然难用，处理多个流的时候，不得不组合Mono/Flux，而这样的写法既繁琐，可读性又差。
Spring一直在与Kotlin进行深度合作， 现在可以用协程api来替代Mono/Flux，利用Kotlin强大的协程API，可以简化写法。

而Ktor相比于SpringWebFlux，他从核心的设计上就是基于协程的，对于Kotlin user来说用着更自然，而且底层是Netty又保证了并发性能和稳定性。

## Ktor的PipeLine
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


![image3](/images/Ktor.png)


## Ktor Server端插件整理

### ContentNegotiation

https://ktor.io/docs/server-serialization.html

 - convertResponseBody
 转换ResponseBody，拦截器挂在ApplicationSendPipeline.Transform

 - convertRequestBody
 转换RequestBody，拦截器挂在ApplicationReceivePipeline.Transform

### Caching Headers
https://ktor.io/docs/server-caching-headers.html#configure

### RequestBodyLimit
ktor/ktor-server/ktor-server-plugins/ktor-server-body-limit/common/src/io/ktor/server/plugins/bodylimit/RequestBodyLimit.kt

限制request body 字节数， 如果超过限制， 则返回413 Payload Too Large。

### AutoHeadResponse
某个路由定义了 GET 处理器时，它会自动生成对应的 HEAD 处理器，不需要你手动写。
```
curl -I -X HEAD http://localhost:8082/head
```
不返回body

### ConditionalHeaders

1. ETag

服务器会在响应里加上 ETag 头，通常是一个哈希值或版本号。

客户端下次请求时，可以带上 If-None-Match 头，把上次的 ETag 发给服务器。 (-H 'If-None-Match: "abc123"')

服务器比对 ETag：

一样：说明资源没变 → 返回 304 Not Modified（不传 body，客户端用缓存）。

不一样：说明资源更新了 → 返回 200 OK（新内容 + 新的 ETag）。

2. If-Modified-Since 是 HTTP 缓存验证头。
"If-Modified-Since: Fri, 04 Mar 2022 09:52:07 GMT"

客户端告诉服务器：“我这边有个缓存，它最后修改时间是 xxx，如果你的资源在这之后没更新，就别传 body 给我了。”

服务器检查资源的 Last-Modified 时间：

如果 没有更新 → 返回 304 Not Modified（只发 headers，不发 body）。

如果 有更新 → 返回 200 OK + 新内容。

### Compression

- 客户端请求头

客户端用这些头告诉服务器自己支持哪些压缩方式。

`Accept-Encoding: gzip, deflate, br`

- 服务器响应头

服务器用这些头告诉客户端实际用了什么压缩方式。

`Content-Encoding: gzip` 

### DefaultHeaders

默认两个Header， 也可以自定义

Date: Sun, 28 Sep 2025 04:31:05 GMT

Server: Ktor/3.2.3

### DoubleReceive

TODO

### ForwardedHeaders

TODO

### FreeMarker/Mustache/JTE/Pebble/Thymeleaf/Velocity

常用于：生成 HTML 页面、邮件内容、文档等。

https://ktor.io/docs/server-templating.html

### HSTS

TODO

### HttpsRedirect
A plugin that redirects all HTTP requests to the HTTPS

### XHttpMethodOverride

ktor-server-method-override 插件会拦截请求，
检查是否有 方法覆盖标识，然后修改 call.request.httpMethod。

支持的覆盖方式：

 - HTTP Header 
X-HTTP-Method-Override: DELETE

 - 表单字段

POST /resource，body 里有 _method=DELETE

### MicrometerMetrics

自动收集 HTTP 请求指标，并注册到 Micrometer 的 MeterRegistry 里。

### PartialContent 
安装 PartialContent 插件 后，Ktor 会自动识别请求里的 Range 头，帮你切片返回，支持 206 Partial Content。

Request Header:

Range: bytes=0-1023

Response:
206 Partial Content

p.s.
返回body必须是ReadChannelContent

### RateLimit

Rate limiting（限流） = 限制用户在一定时间内的请求次数.

请求次数过多会返回

HTTP/1.1 429 Too Many Requests


### RequestValidation

Ktor 里的 请求校验插件（RequestValidation）。装上后，你可以为反序列化后的类型（如 data class）注册校验规则；

当你在路由里 call.receive<T>() 时，会自动触发对应的校验。


### StatusPage

StatusPages 是 Ktor 的“统一错误与状态响应”插件：拦截未处理异常或特定状态码，返回自定义内容（HTML/JSON/文本/文件）


### Sessions

TODO

### SSE

TODO

### WebSockets

TODO


### openAPI / swaggerUI
TODO

## Ktor Client端插件整理
