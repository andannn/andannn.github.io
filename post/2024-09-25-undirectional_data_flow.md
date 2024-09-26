---
layout: post
title: "单向数据流"
date: 2024-09-25 11:48:28 +0800
tag: "Compose|Android|Kotlin"
---

https://developer.android.com/develop/ui/compose/architecture#udf
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

APP有删除的功能，当在专辑列表页面删除一个文件删除后，需要更新3处UI。
 - 专辑列表界面中ListView。
 - 专辑列表界面的上部的Track数目。
 - 所有专辑的页面的专辑Track数目。

删除操作需要调用Actvity的api， 删除结束的事件也是在Activity中收到的， 接下来的问题是如何通知这两个页面呢？
最简单的当然是在Activity中取到所有当前显示的所有界面的实例直接通知， 但是这样做风险很大。
 - 如果写代码疏忽了， 少通知一个地方， 恭喜你， 造出了一个Bug。 
 - 如果我们直接把手机里的文件删掉， App肯定不知道这个事件， 会发生数据不同步的问题。
 - 之后新增Feature时， 这个删除功能可能会影响新Feature的UI， 所以通知的逻辑需要修改，有Degrade风险。

如果是UDF架构是怎样做的呢？

首先给数据源设置监听， 将数据源和UI进行绑定， 让其自动更新。
然后当有收到了用户操作事件， 调用平台Api删除文件， 结束， 我们的处理流程到此为止，UI会自动刷新。

所以做到这一点的前提是数据源是可以设置监听器的。
Android的MediaStore可以设置Observer， 我们可以利用这个监听， 实现UDF架构。


这段代码将监听器收到的结果转化成数据流返回。UI层通过绑定这个Flow，就可以实现自动刷新。
[MediaContentObserverRepositoryImpl.kt](https://github.com/andannn/Melodify/blob/master/core/data/src/main/java/com/andannn/melodify/core/data/repository/MediaContentObserverRepositoryImpl.kt#L44)
```kotlin
    override fun getContentChangedEventFlow(uri: String): Flow<Unit> {
        Log.d(TAG, "getContentChangedEventFlow: $uri")
        return callbackFlow {
            val observer =
                object : ContentObserver(null) {
                    override fun onChange(selfChange: Boolean) {
                        trySend(Unit)
                    }
                }

            contentResolver.registerContentObserver(
                /* uri = */ Uri.parse(uri),
                /* notifyForDescendants = */ true,
                /* observer = */ observer,
            )

            trySend(Unit)

            awaitClose {
                contentResolver.unregisterContentObserver(observer)
            }
        }.onStart { emit(Unit) }
    }
```

处理用户事件：

[MainActivity.kt#L63](https://github.com/andannn/Melodify/blob/master/app/src/main/java/com/andannn/melodify/MainActivity.kt#L63)
```kotlin
        lifecycleScope.launch {
            mainViewModel.deleteMediaItemEventFlow.collect { uris ->
                Log.d(TAG, "Requesting delete media items: $uris")
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                    val editPendingIntent = MediaStore.createTrashRequest(
                        /* resolver = */ contentResolver,
                        /* uris = */ uris.map { Uri.parse(it) },
                        /* value = */ true,
                    )
                    val request =
                        IntentSenderRequest.Builder(editPendingIntent.intentSender).build()

                    intentSenderLauncher.launch(request)
                }
            }
        }
```

这样， 处理用户事件只需要考虑更改数据源。数据源影响UI让其自动变化。 这样的设计使这两个流程解偶， 互不影响。 并且减少了因为考虑不全面产生的状态不一致的BUG。












