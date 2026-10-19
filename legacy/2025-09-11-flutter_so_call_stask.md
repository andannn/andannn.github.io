---
layout: post
title: "libflutter.so 解析符号"
date: 2025-09-11 11:45:48 +0800
tag: "Flutter"
---

https://github.com/flutter/flutter/wiki/Crashes/7f173706432bbad02c8f59168536d61d28231f77
官方给的手顺已经旧了，下面整理新手顺：

1. Get the Engine revision from the Framework (this could be automated).  在本地fluttersdk的路径下能找到： <FLUTTER_SDK>/bin/internal/engine.version
2. With the full engine revision (e.g. cea5ed2b9be42a981eac762af3664e4a17d0a53f), you can now get the proper symbol files: To view the available artifacts for a build, visit this URL in a browser (replacing the engine hash with your hash): 
https://console.cloud.google.com/storage/browser/flutter_infra_release/flutter/82bd5b7209295a5b7ff8cae0df96e7870171e3a5
https://console.cloud.google.com/storage/browser/_details/flutter_infra_release/flutter/82bd5b7209295a5b7ff8cae0df96e7870171e3a5/android-arm64-release/symbols.zip
（如果要解析线上crash，一般要下载arm64-release）

3. Symbolicate with addr2line
A alternative way to symbolicate is by using the addr2line tool. It is bundled with the NDK. To use it, simply call it with a path to the .so file downloaded above and feed the stack addresses to it manually. For example, on macOS:
$ANDROID_HOME/ndk/<nkd-version>/toolchains/llvm/prebuilt/darwin-x86_64/bin/llvm-addr2line-e ~/Downloads/libflutter.so	
（ndkVersion可以去app的build gradle里看 <Project Root>/android/app/build.gradle）

