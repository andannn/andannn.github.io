---
layout: post
title: "Comopose Snack bar的实现方式"
date: 2024-12-04 15:42:48 +0800
tag: "Compose|Android|Kotlin|KMP"
---

Androidx的库有一些被迁移到了KMP， 例如Room， Navigation， ViewModel。
最近开始试着写KMP的项目， 总感觉用的不到位， 所以最近想通过阅读源码来熟悉KMP的写法。
我打算从Room来入手， 因为这是一个涉及知识特别广的库，不但可以得到一些Sqlite数据库的知识，
使用了协程涉及了API， 所以还可以学到一些协程的知识， 并且Room用到了KSP生成代码，能
学到一些元编程的知识。

由于自己水平不行， 只能通过逐行Debug来看代码了🤔

## 配置环境
请参考Bennyhuo大佬的视频。
https://www.bilibili.com/video/BV1pY4y127o6/

## Room单元测试
准备通过debugRoom的单元测试来学习， 由于没有什么目的， 只能写成流水账了。

### BaseConnectionPoolTest

room/room-runtime/src/commonTest/kotlin/androidx/room/coroutines/BaseConnectionPoolTest.kt

`ConnectionPool`是管理连接Sqlite数据库的类， 他提供了并发访问数据库的能力。
`useConnection`的block参数提供了一个Transactor， 可以在用它来做访问数据库的操作。
```kotlin
internal interface ConnectionPool {
    suspend fun <R> useConnection(isReadOnly: Boolean, block: suspend (Transactor) -> R): R
}
```
关于这个函数的测试总结以下要点

1. 在同一个协程中取得的Transactor是同一个实例。

每次调用这个函数时， 会把Transactor实例存到当前协程的coroutineContext中， 再次调用时会先check当前coroutineContext中有没有
ConnectionElement， 如果有就直接提供这个实例。

room/room-runtime/src/commonMain/kotlin/androidx/room/coroutines/ConnectionPoolImpl.kt
```kotlin
    override suspend fun <R> useConnection(
        isReadOnly: Boolean,
        block: suspend (Transactor) -> R
    ): R {
        if (isClosed) {
            throwSQLiteException(SQLITE_MISUSE, "Connection pool is closed")
        }
        val confinedConnection =
            threadLocal.get() ?: coroutineContext[ConnectionElement]?.connectionWrapper
...
    }
```

2. ConnectionPool在关闭后， SQLiteStatement，PooledConnection的使用会抛异常。

因为每次调用Transactor的借口时都会套一个withStateCheck， 会检查当前pool有没有被关闭

room/room-runtime/src/commonMain/kotlin/androidx/room/coroutines/ConnectionPoolImpl.kt
```kotlin
    private suspend inline fun <R> withStateCheck(block: () -> R): R {
        if (isRecycled) {
            throwSQLiteException(SQLITE_MISUSE, "Connection is recycled")
        }
        val connectionElement = coroutineContext[ConnectionElement]
        if (connectionElement == null || connectionElement.connectionWrapper !== this) {
            throwSQLiteException(
                SQLITE_MISUSE,
                "Attempted to use connection on a different coroutine"
            )
        }
        return block.invoke()
    }
```

并且在这个函数中额外check了当前协程有没有ConnectionElement， 这保证了创建PooledConnection和使用的地方必须是一个协程。

下面这个单元测试会报错。

room/room-runtime/src/commonTest/kotlin/androidx/room/coroutines/BaseConnectionPoolTest.kt
```kotlin
@Test
    fun connectionUsedOnWrongCoroutine() = runTest {
        val singleThreadContext = newFixedThreadPoolContext(1, "Test-Threads")
        val driver = setupDriver()
        val pool =
            newConnectionPool(
                driver = driver,
                fileName = fileName,
                maxNumOfReaders = 1,
                maxNumOfWriters = 1
            )
        pool.useReaderConnection { connection ->
            launch(singleThreadContext) {
                    assertThat(
                            assertFailsWith<SQLiteException> {
                                    connection.usePrepared("SELECT * FROM Pet") {}
                                }
                                .message
                        )
                        .isEqualTo(
                            "Error code: 21, message: Attempted to use connection on a different coroutine"
                        )
                }
                .join()
        }
        pool.close()
        singleThreadContext.close()
    }
```

3.  usePrepared加了一个Mutex锁， 也就是说在一个usePrepared调用结束之前， 另一个调用会一直挂起。
```kotlin
    @Test
    fun useStatementLocksConnection() = runTest {
        val multiThreadContext = newFixedThreadPoolContext(2, "Test-Threads")
        val driver = setupDriver()
        val pool =
            newConnectionPool(
                driver = driver,
                fileName = fileName,
                maxNumOfReaders = 1,
                maxNumOfWriters = 1
            )
        var count = 0
        pool.useReaderConnection { connection ->
            coroutineScope {
                val mutex = Mutex(locked = true)
                launch(multiThreadContext) {
                        connection.usePrepared("SELECT * FROM Pet") {
                        runBlocking { mutex.withLock {} }
                        while (it.step()) {
                            count++
                        }
                    }
                }
                launch(multiThreadContext) {
                    assertFailsWith<TimeoutCancellationException> {
                        withTimeout(200) {
                            delay(50) // to let statement above be used first
                            connection.usePrepared("SELECT * FROM Pet") {
                                fail("Statement should never prepare")
                            }
                        }
                    }
                    mutex.unlock()
                }
            }
        }
        pool.close()
        multiThreadContext.close()
        assertThat(count).isEqualTo(20)
    }
```



...