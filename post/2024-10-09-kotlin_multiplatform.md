---
layout: post
title: "Migrate Android project to kotlin multiplatform"
date: 2024-10-09 11:48:28 +0800
tag: "Compose|Android|Kotlin|KMP"
---

最近看到了Android官方把ViewModel和Navigation两个库迁移到了KMP，Compose multiplatform终于有了路由和状态的官方解决方案， 所以决定把自己之前为了练手写的Compose工程迁移成KMP。

先放结果：
https://github.com/andannn/Melodify/pull/136

####Hilt dagger不能用了， 需要迁移成Koin
Hilt dagger是谷歌官方维护的一个依赖注入框架， 他本质上是生成了一些java代码， 通过依赖安卓组件(Activiy/Service)
的钩子将依赖注入组件中， 他通过定义module和写注解就可以简单的实现依赖注入， 给安卓开发带来了很大的便利， 但是由于生成的是java代码。 他只能用在安卓或者JVM环境， 期待谷歌官方也讲Hilt迁移成KMP。 XD

Koin利用了Kolin强大的dsl能力， 实现了一系列便利的api，使得我们可以很容易声明类的依赖图。
并且他对安卓有很好的支持， 像与生命周期挂钩的ViewModel也可以使用koin进行依赖注入。
由于是纯kolin， 他自然也支持KMP， 所以就使用Koin来代替Hilt Dagger。

##### 决定迁移过程， 先迁移core， 再feature， 最后是app
这个是项目的结构，每个数据层都有单独的模块， ui层也按feature分了模块。
这样我们可以以Module为单位去做迁移，然后每迁移一个Module就可以编译来确认结果。
就是说整个项目同时存在纯kotlin的模块和kotlin mutiplatform的模块，也是可以编译成功的。


settings.gradle.kt
```
include(":app")
include(":core:data")
include(":core:network")
include(":core:player")
include(":core:datastore")
include(":core:network")
include(":core:database")
include(":feature:common")
include(":feature:home")
include(":feature:player")
include(":feature:playlist")
```

 - 首先是:core:network
