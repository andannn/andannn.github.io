---
layout: post
title: "Swift UI学习"
date: 2025-08-29 11:45:48 +0800
tag: "Swift|Kotlin"
---

记录一下学习Swift UI的过程。

## StateObject
StateObject类似于Android的ViewModel。是做状态管理和与UI交互的类。

@StateObject注解的类就是把初始化和销毁的控制交给SwiftUI控制。

例如有A，B两个页面， 当从A页面迁移到B页面时， A的页面被销毁了，UI中初始化的对象就都会被销毁， 但是这不是我们预期的动作了， 因为路由还在栈内， 当退回A页面时需要复用， StateObject正是解决了这个问题。

值得注意的是， StateObject如果要注册监听， 一定要使用weak self，防止循环引用。

例如这段代码, 虽然也是用了weak self， 由于使用了await并引用了self。 self又变成强引用了。

```swift
dataTask = Task { [weak self] in
    guard let self else { return }

    for try await user in self.authRepository.getAuthedUserAsyncSequence() {
        self.user = user
    }
}
```

正确写法应该是：
```swift
dataTask = Task { [weak self] in
    guard let stream = self?.authRepository.getAuthedUserAsyncSequence() else { return }

    for try await user in stream {
        self?.user = user
    }
}
```
