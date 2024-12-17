---
layout: post
title: "比较Kotlin 与 Dart 与本地（Native）的通信"
date: 2024-12-17 15:42:48 +0800
tag: "Android|Kotlin|KMP|Dart|Flutter"
---

最近准备开始了解一下Kotlin和Dart跨平台实现方式。

Kotlin最开始可以和Java无缝互调用， 在Android平台崭露头角，
成为Google首推的Android平台开发语言。Kotlin代码可以编译成java字节码，在JVM虚拟机中运行，在JAVA和Kotlin共存的工程中，Kotlin代码可以直接被Java调用， Java代码也可以直接被Kotlin调用， 工程的迁移成本和开发体验都很好。
Kotlin Multiplatform可以看作KotlinJvm的扩展，Kotlin Native编译产物是平台的的可执行文件，KotlinJs会编译生成JS代码。

而Dart的做法不太一样， Dart的编译产物不是可执行文件， 而是目标平台的机器码， 比如Android和iOS都是Arm64平台的架构， 而Android的app是需要有Darvik虚拟机的运行时支持的， 运行的是JAVA字节码，iOS则可以直接运行Native机器码。但是在dart眼里都是一样的，flutter app在Android和iOS中都会生成一样的ARM原生机器码。

KMP的模式是更`原生`的， 因为编译产物和原生平台是一模一样的。

还有就是工程的组建方式有很大区别。
这一点我们通过实际的项目来看， 最近在看Room的源码， 它依赖AndroidX的另一个库（[Sqlite](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:sqlite/)）， Flutter上与之对应的是[Sqlite3](https://github.com/simolus3/sqlite3.dart)。
通过对比这两个库， 我们可以很直观的感受两种语言跨平台的不同之处。


### SQLite简介

SQLite无需配置而且体积很小，很适合直接嵌入到应用程序中， 所以在移动端作为轻量级数据库应用特别广泛。
它本身是用C语言实现的， 在iOS平台上可以直接调用C的api去使用， 但是在Android中只能通过JNI调用C的API，
还好Android平台提供了Sqlite的支持，可以使用`SQLiteDatabase`来直接使用。

### Kotlin Multiplatform实现跨平台的数据库支持库

这个库有3个Module，分别是sqlite sqlite-framework sqlite-bundled

#### sqlite

sqlite里主要是接口定义，这些定义是和SQLite的C API对应的。
比如这个SQLiteConnection里有一个`prepare`方法， 返回一个`SQLiteStatement`.
对应C这个`sqlite3_prepare_v2`。
```kotlin
public interface SQLiteConnection {
    public fun prepare(sql: String): SQLiteStatement
...
}
```
```c
int sqlite3_prepare_v2(
  sqlite3 *db,            /* Database handle */
  const char *zSql,       /* SQL statement, UTF-8 encoded */
  int nByte,              /* Maximum length of zSql in bytes. */
  sqlite3_stmt **ppStmt,  /* OUT: Statement handle */
  const char **pzTail     /* OUT: Pointer to unused portion of zSql */
);
```

#### sqlite-framework

sqlite-framework是平台实现， 前面说过， KMP的思路就是编译产物和目标平台是一样的， Android上提供了Java的数据库API， sqlite-framework在Android上的实现也是也是调用了Android提供的SQLiteDatabase。android以外的平台，
nativeMain里面，使用了KotlinNative实现， 用Kotlin和C的互调用的方法，实现了sqlite库里定义的借口。

#### sqlite-bundled

sqlite-bundled负责加载动态库。

Android和JVM平台上，需要通过JNI调用C的API，在jvmAndroidMain里， 使用了JNI接口。

nativeMain里和sqlite-framework里的实现一样， 直接做了一个映射。

这个sqlite-bundled的实现上，是没有区别iOS平台和desktop平台，因为都是用Kotlin Native可以实现，如果编译这个库， 发现产物里是有所有平台对应的可执行文件的， android上是aar， jvm上是jar，其他平台klib。

> 注意在Android上， sqlite-bundled也是直接使用动态库来使用调用数据库的， 如果在app中依赖了这个库，app的包体积会大10M左右， 因为so文件被打到apk里了。

### Dart实现跨平台的数据库支持库

Dart可以通过FFI调用C的API，只要实现一套ffi，就可以使用dart代码实现所有平台的数据库支持了。

但是前提是需要加载动态库，android和ios是需要把动态库打到包里的， android端是在插件里引用了[sqlite3-native-library](https://github.com/simolus3/sqlite3.dart/blob/main/sqlite3_flutter_libs/android/build.gradle)
库， 可以把动态库打到apk里。darwin(iOS/Mac Os)
依赖了[CSQLite](https://github.com/simolus3/sqlite3.dart/blob/main/sqlite3_flutter_libs/darwin/sqlite3_flutter_libs/Package.swift)库。
Windows端会[编译一个dll](https://github.com/simolus3/sqlite3.dart/blob/89f0ba691087cbc55173f0bd6653e9b2cd3fb1b2/sqlite3_flutter_libs/windows/CMakeLists.txt)， 打到包里。

### 总结
Kotlin多平台在处理复杂的桌面端环境时优势更大， 就像C语言一样， 一处编写，处处运行。平台的差异都交给编译起处理了， 所以可以看到KMP的Sqlite库中只有Kotlin Native的代码， 没有处理平台差异。
但是Dart版本的Sqlite库，需要在加载库上面做平台差异判断。

但是KMP没有DartFFI那种直接调用平台借口的能力。如果开发一个JVM应用， 或者Android应用， 仍然需要借助JNI去和原生Api互调用。
