---
layout: post
title:  "Kotlin协程与反应式编程"
date:   2024-03-18 10:06:18 +0900
---

最近看了一个Jetbrains大佬做的关于Kotlin协程和多并发的演讲， 这里稍微整理一下。

Kotlin协程的核心是挂起和恢复， 可以轻松处理高并发， 但是如果我门运行在协程中的函数是阻塞的， 协程的能力会被大大削弱。

举个例子：
在一个`CoroutineScope`中， 我们启动了两个协程， 让他们并发执行。
结果也是符合预期的。 515ms执行完毕。
```kotlin
    @Test
    fun coroutine_constructor_test2() = runBlocking {
        val time = measureTimeMillis {
            coroutineScope {
                launch {
                    delay(500)
                }

                launch {
                    delay(500)
                }
            }
        }
        println("consumed time is $time")
    }
```
```logcatfilter
consumed time is 515
```

如果我们把`delay`函数改成`sleep`， 让线程阻塞。
结果变成了1014ms。 原因就是这两个协程里的任务都是阻塞的。
```kotlin
    @Test
    fun coroutine_constructor_test2() = runBlocking {
        val time = measureTimeMillis {
            coroutineScope {
                launch {
                    sleep(500)
                }

                launch {
                    sleep(500)
                }
            }
        }
        println("consumed time is $time")
    }
```
```logcatfilter
consumed time is 1014
```
没关系， 我们可以设置一个Dispatcher， 让他们在两个线程中并发执行。
结果也是符合预期的， 很完美是不是？
```kotlin
    @Test
    fun coroutine_constructor_test2() = runBlocking {
        val time = measureTimeMillis {
            coroutineScope {
                launch(Dispatchers.IO) {
                    println(Thread.currentThread().name)
                    sleep(500)
                }

                launch(Dispatchers.IO) {
                    println(Thread.currentThread().name)
                    sleep(500)
                }
            }
        }
        println("consumed time is $time")
    }
```
```logcatfilter
DefaultDispatcher-worker-1 @coroutine#2
DefaultDispatcher-worker-2 @coroutine#3
consumed time is 519
```

但是如果有很多并发处理，我们启动100个协程， 让他们并行处理。
结果不是很理想， 足足慢了一倍。 原因就是我们不可能无限起线程。后来的任务只能等待前面的任务执行完毕。
```kotlin
    @Test
    fun coroutine_constructor_test2() = runBlocking {
        val time = measureTimeMillis {
            coroutineScope {
                repeat(100) {
                    launch(Dispatchers.IO) {
                        println(Thread.currentThread().name)
                        sleep(500)
                    }
                }
            }
        }
        println("consumed time is $time")
    }
```
```logcatfilter
consumed time is 1057
```

所以我们使用协程， 最理想的情况是每个方法都应该是非阻塞的， 例如OkHttp的设计。

我没看过OkHttp的源码， 直接上ChatGpt：

>以下是 OkHttp 的工作原理：
> 
>连接池管理：OkHttp 使用连接池来管理与服务器的连接。连接池允许多个 HTTP 请求共享同一个 TCP 连接，从而减少了连接的建立和关闭的开销，并且提高了性能。
>
>异步任务执行：OkHttp 使用异步任务执行的方式来发起 HTTP 请求和处理响应。当您发起一个 HTTP 请求时，OkHttp 不会立即阻塞当前线程，而是将请求添加到异步执行队列中，并且使用线程池来处理这些请求。
>
>事件循环机制：OkHttp 使用了事件循环（event loop）机制来处理异步任务。它会在后台启动一个线程来轮询异步执行队列，一旦有请求完成或者有可读或可写的数据到达，它就会立即处理这些事件，并且触发相应的回调或者将数据返回给调用者。
>
>总的来说，OkHttp 使用连接池和异步任务执行的方式来实现高效的 HTTP 请求处理。它并不是为每个请求启动一个独立的线程，而是通过复用连接和异步执行的方式来提高性能并减少资源的消耗。

有个OkHttp的事件循环的设计，Http请求可以异步执行。
Kotlin协程可以抹平异步程序的复杂度， 让代码看起来是同步的。
我认为这个是Kotlin协程的最大优势。