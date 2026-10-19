---
layout: post
title: "通过gradle发布到MavenCentral"
date: 2025-10-04 21:45:48 +0800
tag: "Maven|Gradle"
---

记录一下用Gradle发布开源库的流程。

### 插件
配置Gradle插件。
https://github.com/vanniktech/gradle-maven-publish-plugin

可以参考视频。
https://www.youtube.com/watch?v=nd2ULXyBaV8

和对应的文档。
https://vanniktech.github.io/gradle-maven-publish-plugin/central/

### 本地Secret相关配置

按视频前半配置都很顺利， 到了Provide Credentials部分，作者省略了一部分，这里详细说下。

https://www.youtube.com/watch?v=nd2ULXyBaV8&t=237s
https://vanniktech.github.io/gradle-maven-publish-plugin/central/#secrets

文档里的配置写的是：

```
mavenCentralUsername=username
mavenCentralPassword=the_password

signing.keyId=12345678
signing.password=some_password
signing.secretKeyRingFile=/Users/yourusername/.gnupg/secring.gpg
```

首先`signing.keyId`指的是之前准备工作生成的GPG Key。

用下面的命令打出来的key是长格式的。配置的时候应该取后8位。

```
% gpg --list-secret-keys
[keyboxd]
---------
sec   ed25519 2025-10-06 [SC] [expires: 2028-10-05]
      6D0A931FCDB4AD27C0581935679B74D35D3DE126
uid           [ultimate] Qingnan Jiang <jqn296763005@gmail.com>
ssb   cv25519 2025-10-06 [E] [expires: 2028-10-05]

```

`signing.password`位注册GPG KEY时写的密码。

`signing.secretKeyRingFile` 需要填`secring.gpg`文件的路径。 用下面的指令，生成文件。

`gpg --export-secret-keys --armor <key id>  <path to secring.gpg>
`