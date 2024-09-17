---
layout: post
title:  "Android 从图片中提取颜色并应用到app theme的实现方法"
date:   2024-02-17 16:06:08 +0900
tag: "Android"
---
[Jetcaster](https://github.com/android/compose-samples/tree/main/Jetcaster)
中有相关的实现，
本文记录一下实现原理。

### 提取颜色：
提取颜色用到了Android官方的[Palette API](https://developer.android.com/develop/ui/views/graphics/palette-colors)。
Palette能从一个bitmap中提取出六种颜色。
> The Palette library attempts to extract the following six color profiles:
> - Light Vibrant
> - Vibrant
> - Dark Vibrant
> - Light Muted
> - Muted
> - Dark Muted

但是我们一般不能在Android中直接拿到Bitmap， 所以需要从Uri中生成Bitmap。
这里用到了Coil库， Coil可以接受不同的Uri， 可以是本地文件， 网络Url， 或者是Media Store的Content url。

```kotlin
    val request =
        ImageRequest.Builder(context)
            .data(imageUrl)
            // We scale the image to cover 128px x 128px (i.e. min dimension == 128px)
            .size(128).scale(Scale.FILL)
            // Disable hardware bitmaps, since Palette uses Bitmap.getPixels()
            .allowHardware(false)
            // Set a custom memory cache key to avoid overwriting the displayed image in the cache
            .memoryCacheKey("$imageUrl.palette")
            .build()

    val bitmap =
        when (val result = context.imageLoader.execute(request)) {
            is SuccessResult -> result.drawable.toBitmap()
            else -> null
        }
```

然后创建Pallet， 取出颜色。
```kotlin
  withContext(Dispatchers.Default) {
    val palette =
      Palette.Builder(bitmap)
        // Disable any bitmap resizing in Palette. We've already loaded an appropriately
        // sized bitmap through Coil
        .resizeBitmapArea(0)
        // Clear any built-in filters. We want the unfiltered dominant color
        .clearFilters()
        // We reduce the maximum color count down to 8
        .maximumColorCount(8)
        .generate()
  
    palette.swatches
  }
```
