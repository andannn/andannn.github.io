---
layout: post
title: "Comopose Snack bar的实现方式"
date: 2024-12-04 15:42:48 +0800
tag: "Compose|Android|Kotlin|KMP"
---
![U](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwow6ukp-1.png?alt=media&token=24ee05cc-c58f-4ecb-8348-804d66e04ab4)

Snack bar可能会带有一个Action button， 用户可以在Snack bar显示时， 点击这个按钮。

View的写法如下， 我们把Listener传给Snack bar， 用户点击时这个Listener会收到回调。
```kotlin
class MyUndoListener : View.OnClickListener {

  fun onClick(v: View) {
    // Code to undo the user's last action.
  }
}

val mySnackbar = Snackbar.make(findViewById(R.id.myCoordinatorLayout),
                               R.string.email_archived, Snackbar.LENGTH_SHORT)
mySnackbar.setAction(R.string.undo_string, MyUndoListener())
mySnackbar.show()
```

Compose给我们提供了基于协程的api，我们只需要调用这个函数， 函数的返回值就是用户的操作的回调。
```kotlin
    suspend fun showSnackbar(
        message: String,
        actionLabel: String? = null,
        withDismissAction: Boolean = false,
        duration: SnackbarDuration,
    ): SnackbarResult
```

kotlin的协程时CPS(Continuation-passing style)模式， 本质上也是设置Callback，在将来某一个时间触发这个回调。

我们知道kotlin的suspend函数隐含了一个continuation， 通过`suspendCancellableCoroutine`方法可以把当前协程挂起，并取得continuation。
 *1处把continuation传递给了currentSnackbarData， 保存起来。

currentSnackbarData并不是一个集合，只是一个变量，所以showSnackbar不能支持多次调用。这个函数用mutex锁来限制每次调用都会等待上一次的调用结束。

这个函数是一个suspend函数，自然也支持取消操作， 当所在的协程取消时， currentSnackbarData被置为null，
使画面上正在显示的snackbar控件消失。
```kotlin
    suspend fun showSnackbar(visuals: SnackbarVisuals): SnackbarResult =
        mutex.withLock {
            try {
                return suspendCancellableCoroutine { continuation ->
                    currentSnackbarData = SnackbarDataImpl(visuals, continuation) *1
                }
            } finally {
                currentSnackbarData = null
            }
        }
```

当snack bar自动消失， 或者用户点击action的时候， 协程会恢复执行， 并返回结果。
 *2处在一段时间的延时后， 调用了dismiss方法, *3处取得了保存的continuation并恢复执行。
```kotlin
@Composable
fun SnackbarHost(
    hostState: SnackbarHostState,
    modifier: Modifier = Modifier,
    snackbar: @Composable (SnackbarData) -> Unit = { Snackbar(it) }
) {
    val currentSnackbarData = hostState.currentSnackbarData
    val accessibilityManager = LocalAccessibilityManager.current
    LaunchedEffect(currentSnackbarData) {
        if (currentSnackbarData != null) {
            val duration =
                currentSnackbarData.visuals.duration.toMillis(
                    currentSnackbarData.visuals.actionLabel != null,
                    accessibilityManager
                )
            delay(duration)
            currentSnackbarData.dismiss()   *2
        }
    }
}

    private class SnackbarDataImpl(
        override val visuals: SnackbarVisuals,
        private val continuation: CancellableContinuation<SnackbarResult>
    ) : SnackbarData {

        override fun performAction() {
            if (continuation.isActive) continuation.resume(SnackbarResult.ActionPerformed)
        }

        override fun dismiss() {
            if (continuation.isActive) continuation.resume(SnackbarResult.Dismissed) *3
        }
    }
```



