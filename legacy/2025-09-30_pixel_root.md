---
layout: post
title: "Pixel 6a 解锁 & 刷机 & Root"
date: 2025-09-30 21:45:48 +0800
tag: "Root|Magisk"
---
#  Pixel 6a 解锁 & 刷机 & Root

> 本文适用于 Pixel 6a (代号 **bluejay**) 测试机。包括：解锁 Bootloader、刷入 LineageOS、自定义 Recovery、安装 Magisk、刷入Magisk模块。

---

## 1. 解锁 Bootloader

1. 确认已开启 **开发者模式** → 打开 **OEM 解锁** 和 **USB 调试**。
2. 连接电脑并进入 fastboot 模式：

```bash
adb reboot bootloader
fastboot devices
fastboot flashing unlock
```

3. 手机上会提示确认，使用音量键选择 **Yes**，电源键确认。
4. 注意：此操作会清空所有数据！

---

## 2. 刷入 LineageOS

1. 下载 LineageOS 官方或非官方镜像：  
   👉 https://download.lineageos.org/devices/bluejay

2. 下载并解压得到以下镜像文件：
   - `boot.img`
   - `vendor_boot.img`
   - `dtbo.img`
   - `vbmeta.img`
   - `lineage-xx.x-xxxxxx-nightly-bluejay-signed.zip`

3. 进入 fastboot 模式并刷入必要分区：

```bash
fastboot flash boot boot.img
fastboot flash vendor_boot vendor_boot.img
fastboot flash dtbo dtbo.img
fastboot flash vbmeta vbmeta.img
```

4. 进入 recovery：

```bash
fastboot reboot recovery
```

5. 在 recovery 界面选择 **Apply update → Apply from ADB**，然后执行：

```bash
adb sideload lineage-xx.x-xxxxxx-nightly-bluejay-signed.zip
```

6. 完成后重启进入系统。

---

## 3. 安装 Magisk 获取 Root

1. 下载最新 [Magisk APK](https://github.com/topjohnwu/Magisk/releases)，并安装。

2. 将对应版本的 `boot.img` 放到手机上。打开 Magisk：
   - 点击 **安装** → **选择并修补一个文件** → 选择 `boot.img`
   - 修补完成后，会生成 `magisk_patched.img`，存放在 `/sdcard/Download/`。

3. 推送到电脑并刷入：

```bash
adb pull /sdcard/Download/magisk_patched.img
fastboot flash boot magisk_patched.img
fastboot reboot
```

4. 重启后，打开 Magisk App，确认 **已安装**。

---

## 4. 安装模块

### 4.1 下载模块
- 从GitHub 获取 **Magisk 模块**，例如：  
https://github.com/NoName-exe/revanced-extended

### 4.2 安装模块
方法 ：ADB 命令安装
```bash
adb push ~/Downloads/<name>Magisk.zip /sdcard/Download/
adb shell su -c 'magisk --install-module /sdcard/Download/<name>-Magisk.zip'
adb reboot
```
