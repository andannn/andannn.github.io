---
layout: post
title: "单向数据流"
date: 2024-09-25 11:48:28 +0800
tag: "Compose|Android|Kotlin"
---

> A unidirectional data flow (UDF) is a design pattern where state flows down and events flow up. By following unidirectional data flow, you can decouple composables that display state in the UI from the parts of your app that store and change state.

![U](https://developer.android.com/static/develop/ui/compose/images/state-unidirectional-flow.png)

#### UDF设计模式解决了什么问题？

开发App需要考虑的问题无非是处理事件， 然后更新UI。 听起来简单， 但是实际情况要复杂的多， 
事件可能是用户操作， 也有可能是系统或外部的事件。 UI的数据来源有可能是数据库， 也有可能是网络。
这就导致App的状态更新不及时， 导致Bug的发生。

UDF的设计模式可以简化这个流程， 将改变状态和更新UI解偶。

#### 举例
考虑一个场景，一个音乐播放器App， 他的数据来源是手机本地的音乐文件。
用户可以删除音乐文件, 删除文件后， 需要更新App的UI状态。

这个App有两个页面， 
第一个是显示所有专辑的页面 
![0](/images/image1.png)

另一个是专辑列表页面。
![0](/images/image2.png)

我可以在专辑列表页面删除一个文件删除后， 首先需要将专辑的列表中的项目删除，然后更新专辑列表界面的上部的Track数目， 最后第一个页面的专辑Track数目也需要更新。

删除操作需要调用Actvity的api， 删除结束的事件也是在Activity中收到的， 接下来的问题是如何通知这两个页面呢？
最简单的当然是在Activity中取到所有当前显示的所有界面的实例直接通知， 但是这样做风险很大， 因为如果写代码疏忽了， 少通知一个地方， 恭喜你， 造出了一个Bug。 再有如果我们直接把手机里的文件删掉， App肯定不知道这个事件， 也会发生数据不同步的问题。

如果是UDF架构是怎样做的呢？

首先收到了用户操作事件， 调用平台Api删除文件， 结束， 我们的处理流程到此为止。
UI刷新的流程则需要设置监听， 将数据源和UI进行绑定， 让其自动更新。



