---
layout: post
title:  "记录一下学习kotlin协程的过程"
date:   2024-06-03 10:53:28 +0800
---

### suspend关键字

首先写一个suspend函数
```kotlin
suspend fun noSuspend() = suspendCoroutine<Int> { continuation ->
    continuation.resume(10)
}
```

在java种调用这个函数， 发现需要传一个参数`Continuation`， 有一个Object类型的返回值。
```java
        Object result = CoroutineTestKt.noSuspend(new Continuation<Integer>() {
            @NotNull
            @Override
            public CoroutineContext getContext() {
                return null;
            }

            @Override
            public void resumeWith(@NotNull Object o) {

            }
        });
```
在suspend函数中， 隐含了一个`Continuation`的对象。 所以在普通函数中不能调用suspend函数， 因为不能提供这个`Continuation`对象。

这个返回值可能是`COROUTINE_SUSPENDED`标记， 表示协程被挂起。 也可能是函数的返回值。


### 协程构造函数

```kotlin
        val continuation = suspend {
            "AAA"
        }.createCoroutine(object : Continuation<String> {
            override val context: CoroutineContext
                get() = EmptyCoroutineContext

            override fun resumeWith(result: Result<String>) {
                println("result $result")
            }
        })
        continuation.resume(Unit)
```
Debug发现，`createCoroutine`调用了这个kotlin stdlib的函数，
并且走到了`*`分支处。

疑问1：这里`this`是Reciver的`(suspend () -> T)`， 然而他被认为是`BaseContinuationImpl`类。。

kotlin-stdlib-1.9.21-sources.jar!/jvmMain/kotlin/coroutines/intrinsics/IntrinsicsJvm.kt
```kotlin
public actual fun <T> (suspend () -> T).createCoroutineUnintercepted(
    completion: Continuation<T>
): Continuation<Unit> {
    val probeCompletion = probeCoroutineCreated(completion)
    return if (this is BaseContinuationImpl)
        create(probeCompletion)  *
    else
        createCoroutineFromSuspendFunction(probeCompletion) {
            (this as Function1<Continuation<T>, Any?>).invoke(it)
        }
}
```

疑问2：单步进入create函数，调用了SuspendLambda的init方法。`BaseContinuationImpl`实现类在哪？

```kotlin
internal abstract class SuspendLambda(
    public override val arity: Int,
    completion: Continuation<Any?>?
) : ContinuationImpl(completion), FunctionBase<Any?>, SuspendFunction {
    constructor(arity: Int) : this(arity, null)

    public override fun toString(): String =
        if (completion == null)
            Reflection.renderLambdaToString(this) // this is lambda
        else
            super.toString() // this is continuation
}
```

### 协程的挂起
不是所有的suspend函数都会挂起协程。
只有函数调用栈不同时， 才会挂起函数， 
比如切线程， 
或用事件循环（例如Android的Handler）， 
或者把`continuation`实例当成变量记住， 在将来某一时刻调用。

直接看一个例子： `foo`是一个suspend函数， 在`suspendCoroutine`的参数的block里面，在子线程里面调用了`cont.resume("1")`

首先构造一个协程，在suspend lambda中调用foo函数。

```kotlin
    @Test
    fun coroutine_constructor_test() {
        suspend fun foo() = suspendCoroutine { cont ->
            thread {
                println("thread current thread ${Thread.currentThread().name}")
                cont.resume("1")
            }
        }

        val continuation = suspend {
            foo()
            "result1"
        }.createCoroutine(object : Continuation<String> {
            override val context: CoroutineContext
                get() = EmptyCoroutineContext

            override fun resumeWith(result: Result<String>) {
                println("result $result")
            }
        })
        continuation.resume(Unit)
    }
```

用debug追踪：
首先这里`continuation.resume(Unit)`启动协程。 ①处调回到我们写的suspend lambda中。
然后调用foo函数。

foo函数的处理是在`suspendCoroutine`的block中， 它把当前的continuation对象又包了一层SafeContinuation，调用block后又调了getOrThrow。

在我们的例子中block中只是切了一个线程， 并没有立即调`cont.resume`， 所以在`getOrThrow`函数中，`result`还是初始的`UNDECIDED`，
所以④处`result`被赋值`COROUTINE_SUSPENDED`，并且返回`COROUTINE_SUSPENDED`， 这个返回值也是`suspendCoroutineUninterceptedOrReturn`
的参数block的返回值。

suspend函数的不是表面看着的那样，当`suspendCoroutineUninterceptedOrReturn`返回`COROUTINE_SUSPENDED`时， foo函数以下的处理并不会执行。
像是在foo函数底下塞了一个return。
然后在②处会跳出这个循环，当前函数所有的流程都走完了。

直到线程被启动， `cont.resume("1")`执行时， ③处判断当前result为`COROUTINE_SUSPENDED`， 再次调到①处的invokeSuspend。
再次回到我们写的suspend lambda中，
但是我不能理解的是， 这个调用直接调到了`我们写的suspend lambda`的`foo`函数之后的地方， 这肯定是理想的情况， 但是如何做到的， 我想不通。

> [benny huo 深入理解协程的状态转移](https://www.bennyhuo.com/2019/05/07/coroutine-suspend/#4-%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3%E5%8D%8F%E7%A8%8B%E7%9A%84%E7%8A%B6%E6%80%81%E8%BD%AC%E7%A7%BB)
> 介绍了suspend lambda的真是面貌
> 在resumeWith->invokeSuspend过程，会管理一个flag， 并在恢复执行时根据这个flag选择恢复的位置。
> 这件事在代码中看不到， 可能在编译器代码里能找到吧。。。
> 
> [KotlinConf 2017 - Deep Dive into Coroutines on JVM by Roman Elizarov 7:40](https://www.youtube.com/watch?v=YrrUCSi72E8)
> 也提到了这件事。

kotlin-stdlib-1.9.21-sources.jar!/commonMain/kotlin/coroutines/Continuation.kt

```kotlin
public suspend inline fun <T> suspendCoroutine(crossinline block: (Continuation<T>) -> Unit): T {
    return suspendCoroutineUninterceptedOrReturn { c: Continuation<T> ->
        val safe = SafeContinuation(c.intercepted())
        block(safe)
        safe.getOrThrow()
    }
}
```

kotlin-stdlib-1.9.21-sources.jar!/jvmMain/kotlin/coroutines/SafeContinuationJvm.kt
```kotlin
    internal actual fun getOrThrow(): Any? {
        var result = this.result // atomic read
        if (result === UNDECIDED) {
            if (RESULT.compareAndSet(this, UNDECIDED, COROUTINE_SUSPENDED)) return COROUTINE_SUSPENDED　④
            result = this.result // reread volatile var
        }
        return when {
            result === RESUMED -> COROUTINE_SUSPENDED // already called continuation, indicate COROUTINE_SUSPENDED upstream
            result is Result.Failure -> throw result.exception
            else -> result // either COROUTINE_SUSPENDED or data
        }
    }
```

kotlin-stdlib-1.9.21-sources.jar!/jvmMain/kotlin/coroutines/SafeContinuationJvm.kt
```kotlin
    public actual override fun resumeWith(result: Result<T>) {
        while (true) { // lock-free loop
            val cur = this.result // atomic read
            when {
                cur === UNDECIDED -> if (RESULT.compareAndSet(this, UNDECIDED, result.value)) return
                cur === COROUTINE_SUSPENDED -> if (RESULT.compareAndSet(this, COROUTINE_SUSPENDED, RESUMED)) {
                    delegate.resumeWith(result)　　　　     ③
                    return
                }
                else -> throw IllegalStateException("Already resumed")
            }
        }
    }
```

/kotlin-stdlib-1.9.21-sources.jar!/jvmMain/kotlin/coroutines/jvm/internal/ContinuationImpl.kt
```kotlin
    public final override fun resumeWith(result: Result<Any?>) {
        // This loop unrolls recursion in current.resumeWith(param) to make saner and shorter stack traces on resume
        var current = this
        var param = result
        while (true) {
            // Invoke "resume" debug probe on every resumed continuation, so that a debugging library infrastructure
            // can precisely track what part of suspended callstack was already resumed
            probeCoroutineResumed(current)
            with(current) {
                val completion = completion!! // fail fast when trying to resume continuation without completion
                val outcome: Result<Any?> =
                    try {
                        val outcome = invokeSuspend(param)　             ①
                        if (outcome === COROUTINE_SUSPENDED) return　    ②
                        Result.success(outcome)
                    } catch (exception: Throwable) {
                        Result.failure(exception)
                    }
                releaseIntercepted() // this state machine instance is terminating
                if (completion is BaseContinuationImpl) {
                    // unrolling recursion via loop
                    current = completion
                    param = outcome
                } else {
                    // top-level completion reached -- invoke and return
                    completion.resumeWith(outcome)
                    return
                }
            }
        }
    }
```

### 协程的拦截器
拦截器在Okhttp中很常用， 可以获取当前的请求或这结果， 做一些额外的处理， 协程的拦截器也是同样的。
> [KotlinConf 2017 - Deep Dive into Coroutines on JVM by Roman Elizarov 20:40](https://www.youtube.com/watch?v=YrrUCSi72E8)
> 提到了在当初设计协程时时没有CoroutineContext的。为了解决协程恢复执行时， 在哪个线程执行的问题， 加了这个CoroutineContext的设计。
>

ContinuationImpl中有一个intercepted方法，他从CoroutineContext取得ContinuationInterceptor， 调用`interceptContinuation`来获取有拦截处理的`Continuation`。


kotlin-stdlib-1.9.21-sources.jar!/jvmMain/kotlin/coroutines/jvm/internal/ContinuationImpl.kt
```kotlin
    public fun intercepted(): Continuation<Any?> =
        intercepted
            ?: (context[ContinuationInterceptor]?.interceptContinuation(this) ?: this)
                .also { intercepted = it }
```

在协程创建时， `SafeContinuation`的代理对象就是拦截后的`Continuation`。

kotlin-stdlib-1.9.21-sources.jar!/commonMain/kotlin/coroutines/Continuation.kt
```kotlin
public fun <T> (suspend () -> T).createCoroutine(
    completion: Continuation<T>
): Continuation<Unit> =
    SafeContinuation(createCoroutineUnintercepted(completion).intercepted(), COROUTINE_SUSPENDED)
```

`suspendCoroutine`函数中， `SafeContinuation`的代理对象也是拦截后的`Continuation`。
kotlin-stdlib-1.9.21-sources.jar!/commonMain/kotlin/coroutines/Continuation.kt
```kotlin
public suspend inline fun <T> suspendCoroutine(crossinline block: (Continuation<T>) -> Unit): T {
    contract { callsInPlace(block, InvocationKind.EXACTLY_ONCE) }
    return suspendCoroutineUninterceptedOrReturn { c: Continuation<T> ->
        val safe = SafeContinuation(c.intercepted())
        block(safe)
        safe.getOrThrow()
    }
}
```

需要注意的是，不是每个suspend函数都会触发拦截， 只有挂起的情况下， 走`resumeWith`时才会调用`delegate.resumeWith(result)` 走到拦截器的地方。

```kotlin
    public actual override fun resumeWith(result: Result<T>) {
        while (true) { // lock-free loop
            val cur = this.result // atomic read
            when {
                cur === UNDECIDED -> if (RESULT.compareAndSet(this, UNDECIDED, result.value)) return
                cur === COROUTINE_SUSPENDED -> if (RESULT.compareAndSet(this, COROUTINE_SUSPENDED, RESUMED)) {
                    delegate.resumeWith(result) *
                    return
                }
                else -> throw IllegalStateException("Already resumed")
            }
        }
    }
```