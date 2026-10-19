---
layout: post
title:  "升级Kotlin到2.0.0"
date:   2024-05-22 10:59:18 +0800
tag: "Kotlin"
---

kotlin 终于发布了2.0.0稳定版， 记录一下升级过程。

### 修正版本
修改ksp和kotlin的版本。
```toml
 [versions]
-ksp = "1.9.23-1.0.20"
+ksp = "2.0.0-1.0.21"
-kotlin = "1.9.22"
+kotlin = "2.0.0"
```

### 编译错误1: compose-compiler报错
```logcatfilter
e: This version (1.5.8) of the Compose Compiler requires Kotlin version 1.9.22 but you appear to be using Kotlin version 2.0.0 which is not known to be compatible.  Please consult the Compose-Kotlin compatibility map located at https://developer.android.com/jetpack/androidx/releases/compose-kotlin to choose a compatible version pair (or `suppressKotlinVersionCompatibilityCheck` but don't say I didn't warn you!).
```
compose-compiler版本应该升级了， 这个compose compiler和kotlin版本一直是匹配的。 

2.0.0似乎要用别的方式了：

[预发布 Kotlin 兼容性](https://developer.android.com/jetpack/androidx/releases/compose-kotlin?hl=zh-cn)

照着这个配好。

Over~~



