---
layout: post
title: "Kotlin-Swift 协程的互调用"
date: 2025-08-07 11:45:48 +0800
tag: "Swift|Kotlin"
---

Kotlin的协程是结构化并发， 他是底层是CPS，支持协作式的取消。 Swift的协程和Kotlin非常相似。


## 基于回调的协程函数
Kotlin可以通过suspendCoroutine函数会尝试挂起协程， 取得Continuation实例。
如果在block中直接调用了continuation.resume或continuation.resumeWithException，则该suspend函数不会挂起，而是直接返回。

如果没有调用，则会返回了一个COROUTINE_SUSPENDED状态位，标记函数已经挂起。通常这种情况是函数调用栈切换， 例如切线程， 或者是讲Continuation实例保存在别处，作为callback将来调用。
```kotlin
suspend fun foo(): Int = suspendCoroutine { continuation ->
// Case1: 直接返回
    continuation.resume(1)

// Case2: 协程挂起
    thread {
      continuation.resumeWithException(1)
    }
}
```

Swift也类似，他有两个函数， 一个是有异常抛出的情况用withCheckedThrowingContinuation， 没有的话用withCheckedContinuation。

```swift
    func bar() async -> Int {
        return await withCheckedContinuation { countinuation in
            countinuation.resume(returning: 1)
        }
    }

    func foo() async throws -> Int {
        return try await withCheckedThrowingContinuation { countinuation in
            countinuation.resume(throwing: NSError(domain: "", code: 1))
        }
    }
```

## 协程的创建
Kotlin创建协程需要一个CoroutineScope， 这个scope提供了一个CoroutineContext， 他可以取消在该Scope中启动的协程。 启动的子协程也可以通过这个context获取启动时注入的实例， 算是一种DI机制。

用户可以自行创建一个CoroutineScope， 这是需要用户自己管理scope的生命周期。
通常平台会给提供CoroutineScope， 比如android上有ViewModelScope， LifecycleScope。

Kotlin还有一个GloableScope， 这个就相当于没有生命周期的scope， 启动的协程不会别取消。

```kotlin
GloableScope.launch {
  foo()
}
```

Swift启动协程使用Task构造器, 这种创建Task的方式， 和kotlin的GloableScope类似， 都是top level的， 没有生命周期管理。

```swift
Task {
  try await foo()
}
```

## 协程的取消
Kotlin协程的取消是协作式的，suspendCancellableCoroutine函数可以相应取消。
invokeOnCancellation函数注册一个callback， 当协程被取消时， callback被调用， 这时需要回收打开的资源， 避免造成泄漏问题。
之后，CancellationException会经过一次Dispatcher的dispach， 抛出CancellationException异常。

```kotlin
suspend fun foo() = suspendCancellableCoroutine { continuation ->
  continuation.invokeOnCancellation {
    // 回收资源
  }

  continuation.resume(1)
}
```

Swift使用withTaskCancellationHandler相应task的取消。
```swift
    func foo() async throws -> Int {
        return try await withTaskCancellationHandler {
            await withCheckedContinuation { countinuation in
                countinuation.resume(returning: 1)
            }
        } onCancel: {
            // 回收资源
        }
    }
```


## Kotlin协程与Swift协程互调用

### swift调用kotlin的suspend函数
Kotlin Native目前只可以导出objc的头文件。
下面suspend的foo函数，转换成了fooWithCompletionHandler的objc函数。
```kotlin
suspend fun foo(): String
```

```objc
- (void)fooWithCompletionHandler:(void (^)(NSString * _Nullable, NSError * _Nullable))completionHandler __attribute__((swift_name("foo(completionHandler:)")));
```
这个objc方法是符合下面文档所说的Swift objc[异步函数互调用的格式](https://developer.apple.com/documentation/swift/calling-objective-c-apis-asynchronously)的，
因此swift代码把这个函数看作`func foo() async throws -> String`，在swift中调用。
```swift
Task {
  try await foo()
}
```

kotlin的suspend函数，如果desugar一下，就是下面这种形式。

```java
Object foo(@NotNull Continuation $completion)
```

这里猜测一下，fooWithCompletionHandler调用到kotlin时，这个函数很可能这样套了一层：(实际debug了一下， foo函数中的取得的coroutineContext就是EmptyCoroutineContext)
```kotlin
fun fooWithCompletionHandler(callback: (String?, Throwable?) -> Unit) {
    suspend {
        foo()
    }.startCoroutine(
        object : Continuation<String> {
            override val context: CoroutineContext
                get() = EmptyCoroutineContext

            override fun resumeWith(result: Result<String>) {
                if (result.isSuccess) {
                    callback(result.getOrNull(), null)
                } else {
                    callback("", result.exceptionOrNull())
                }
            }
        },
    )
}
```

这样的话， foo函数启动调用时， 所在的协程中是没有调度器的，自然也就不支持取消。


### kotlin调用swift的协程函数
fooWithCompletionHandler这个protocal，swift实现只需要callback风格和async风格两种二选一就可以了。
```objc
- (void)fooWithCompletionHandler_:(void (^)(NSString * _Nullable, NSError * _Nullable))completionHandler __attribute__((swift_name("foo(completionHandler_:)")));
```
```swift
    func foo(completionHandler_ completionHandler: @escaping (String?, (any Error)?) -> Void) {
        <#code#>
    }
    
    func foo() async throws -> String {
        <#code#>
    }
    
```

如果只实现了async风格的函数， objc调用时是什么行为呢？ 
。。。搞不大懂。

参考：
https://forums.swift.org/t/concurrency-interoperability-with-objective-c/41616




