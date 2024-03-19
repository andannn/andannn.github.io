---
layout: post
title:  "Android 中的网络请求"
date:   2024-03-18 10:06:18 +0900
---

Android这么多年来app的架构是一直在改善的， 如果架构比较古老， 在项目迭代的时候绝对是一件非常痛苦的事情。

在Android中，最古老的网络请求方式之一是使用`HttpURLConnection`类。
曾经看过一个古老的Android项目，用的就是HttpURLConnection， 其实已经写的很工整了， 所有共通部分都做了抽象。
但是时间久了， 业务越来越复杂， 整个项目看起来也是乱七八糟。

异步操作也很麻烦， 那个项目用的部分是AsyncTask， 部分是Service。
怀疑AsyncTask是重构时后加的。。

消息传递也更加麻烦了， 因为用到了Service， 导致通信必须用Intent， 所有结果都要可序列化。。。

已经开始头疼了。 一顿操作猛如虎， 结果就做了一个网络请求。

### Retrofit
Retrofit使用了java的动态代理， 我们写网络接口只需要定义方法，和返回值。

```java
public interface GitHubService {
  @GET("users/{user}/repos")
  Call<List<Repo>> listRepos(@Path("user") String user);
}
```

返回值Call的定义如下：

`execute()`是同步方法, 在当前线程执行。

`enqueue(Callback<T> callback)`是异步方法, 返回结果通过Callback传回来。
```java
public interface Call<T> extends Cloneable {
  Response<T> execute() throws IOException;

  void enqueue(Callback<T> callback);
.....
}
```

Android开发中， 网络请求肯定不能在主线程执行， 大部分情况我们需要用第二种方法。
但是Callback会带来另一个问题， 如果项目业务很复杂， 我们有并发的需求， 再加上错误处理， 
代码容易写的很乱。

### Kotlin协程
Retrofit也支持了Kotlin协程的suspend关键字， 有了kotlin协程的支持， 我们就不用写
Callback了。

原理很简单，调用时挂起当前协程， callback回来时再恢复。

代码如下：
https://github.com/square/retrofit/blob/87e0c81fde5e166b23e7a8184ba783f64c8f572f/retrofit/src/main/java/retrofit2/KotlinExtensions.kt#L89
```kotlin
suspend fun <T : Any> Call<T>.await(): T {
  return suspendCancellableCoroutine { continuation ->
    continuation.invokeOnCancellation {
      cancel()
    }
    enqueue(object : Callback<T> {
      override fun onResponse(call: Call<T>, response: Response<T>) {
        if (response.isSuccessful) {
          val body = response.body()
          if (body == null) {
            val invocation = call.request().tag(Invocation::class.java)!!
            val service = invocation.service()
            val method = invocation.method()
            val e = KotlinNullPointerException(
              "Response from ${service.name}.${method.name}" +
                " was null but response body type was declared as non-null",
            )
            continuation.resumeWithException(e)
          } else {
            continuation.resume(body)
          }
        } else {
          continuation.resumeWithException(HttpException(response))
        }
      }

      override fun onFailure(call: Call<T>, t: Throwable) {
        continuation.resumeWithException(t)
      }
    })
  }
}
```

`await()`方法中， 使用`suspendCancellableCoroutine`挂起协程， 然后调用`enqueue`执行
接口方法， 返回结果通过callback取得后调用`continuation.resume`恢复协程。
如果出错， 调用`continuation.resumeWithException`抛出异常。

所以我们可以使用suspend关键字把接口方法定义成这样：

```kotlin
interface GitHubService {
  @GET("users/{user}/repos")
  suspend fun  listRepos(@Path("user") String user) : List<Repo>
}
```

### 错误处理
`continuation.resumeWithException(e)`上面看到， 如果遇到错我， 我们是直接通过抛出异常来恢复协程的，
我们需要使用`try-cache`来接住异常。 如果忘记了写`try-cache`， 很可能这个异常直接传到主线程导致app崩溃。

[SandWitch][SandWitch-Repo]库可以完美解决这个问题。

[SandWitch-Repo]: [https://github.com/skydoves/sandwich]

它将返回结果套了一层， 目的是接住异常， 当成结果返回， 接口可以写成下面这样：

```kotlin
interface GitHubService {
  @GET("users/{user}/repos")
  suspend fun listRepos(@Path("user") String user) : ApiResponse<List<Repo>>
}
```

`ApiResponse`的定义如下：
```kotlin
public sealed interface ApiResponse<out T> {

  public data class Success<T>(public val data: T, public val tag: Any? = null) : ApiResponse<T>

  public sealed interface Failure<T> : ApiResponse<T> {
    public open class Error(public val payload: Any?) : Failure<Nothing> {
        ...
    }

    public open class Exception(public val throwable: Throwable) : Failure<Nothing> {
        ...   
    }
  }
}
```

成功时会返回范型结果T。  失败有两种情况， 一种是Exception， 例如超时或断网情况下的错误。 另一种是服务器端定义的错误。

构造ApiResponse的方法如下：
```kotlin
public inline fun <T> apiResponseOf(
  successCodeRange: IntRange = SandwichInitializer.successCodeRange,
  crossinline f: () -> Response<T>,
): ApiResponse<T> = try {
  val response = f()
  if (response.raw().code in successCodeRange) {
    ApiResponse.Success(
      data = response.body() ?: Unit as T,
      tag = response,
    )
  } else {
    ApiResponse.Failure.Error(response)
  }
} catch (ex: Exception) {
  ApiResponse.Failure.Exception(ex)
}.operate().maps()
```
可以看出如果返回的status code如果不在`successCodeRange`， 则认为返回了服务器端的错误。
这个`successCodeRange`的默认值是200-299, 我们也可以在初始化时修改这个范围。
```kotlin
  public var successCodeRange: IntRange = 200..299
```
