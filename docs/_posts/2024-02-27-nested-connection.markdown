---
layout: post
title:  "Android 从图片中提取颜色并应用到app theme的实现方法"
date:   2024-02-17 16:06:08 +0900
---

测试NestedScrollConnection：

```kotlin

@OptIn(ExperimentalMaterial3Api::class)
@Preview
@Composable
private fun TestPreview() {
    MusicPlayerTheme {
//        val scrollBehavior = pinnedScrollBehavior()
        val nestscrollConnection =
            remember {
                object : NestedScrollConnection {
                    override fun onPreScroll(
                        available: Offset,
                        source: NestedScrollSource,
                    ): Offset {
                        Log.d(TAG, "onPreScroll: available $available")
                        Log.d(TAG, "onPreScroll: source $source")
                        Log.d(TAG, "onPreScroll: return ${available.y / 5f}")
                        return available.copy(y = available.y / 5f)
                    }

                    override fun onPostScroll(
                        consumed: Offset,
                        available: Offset,
                        source: NestedScrollSource,
                    ): Offset {
                        Log.d(TAG, "onPostScroll: consumed $consumed")
                        Log.d(TAG, "onPostScroll: available $available")
                        Log.d(TAG, "onPostScroll: source $source")
                        return super.onPostScroll(consumed, available, source)
                    }
                }
            }

        val nestscrollConnection2 =
            remember {
                object : NestedScrollConnection {
                    override fun onPreScroll(
                        available: Offset,
                        source: NestedScrollSource,
                    ): Offset {
                        Log.d("${TAG}2", "onPreScroll: available $available")
                        Log.d("${TAG}2", "onPreScroll: source $source")
                        Log.d("${TAG}2", "onPreScroll: return ${available.y / 5f * 2}")
                        return available.copy(y = available.y / 5f * 2)
                    }

                    override fun onPostScroll(
                        consumed: Offset,
                        available: Offset,
                        source: NestedScrollSource,
                    ): Offset {
                        Log.d("${TAG}2", "onPostScroll: consumed $consumed")
                        Log.d("${TAG}2", "onPostScroll: available $available")
                        Log.d("${TAG}2", "onPostScroll: source $source")
                        return super.onPostScroll(consumed, available, source)
                    }
                }
            }

        val nestscrollConnection3 =
            remember {
                object : NestedScrollConnection {
                    override fun onPreScroll(
                        available: Offset,
                        source: NestedScrollSource,
                    ): Offset {
                        Log.d("${TAG}3", "onPreScroll: available $available")
                        Log.d("${TAG}3", "onPreScroll: source $source")
                        Log.d("${TAG}3", "onPreScroll: return ${available.y / 5f * 2}")
                        return available.copy(y = available.y / 5f * 2)
                    }

                    override fun onPostScroll(
                        consumed: Offset,
                        available: Offset,
                        source: NestedScrollSource,
                    ): Offset {
                        Log.d("${TAG}3", "onPostScroll: consumed $consumed")
                        Log.d("${TAG}3", "onPostScroll: available $available")
                        Log.d("${TAG}3", "onPostScroll: source $source")
                        return super.onPostScroll(consumed, available, source)
                    }
                }
            }
        Scaffold(
            modifier =
            Modifier,
            topBar = {
                TopAppBar(
                    modifier = Modifier,
                    title = {
                        Text(text = "AAAA")
                    },
//                    scrollBehavior = pinnedScrollBehavior()
//                    scrollBehavior = scrollBehavior,
                )
            },
        ) {
            Surface(modifier = Modifier.padding(it).nestedScroll(nestscrollConnection)) {
                Surface(modifier = Modifier.nestedScroll(nestscrollConnection2)) {
                    Surface(modifier = Modifier.nestedScroll(nestscrollConnection3)) {
                        LazyColumn {
                            item {
                                Text(
                                    modifier =
                                    Modifier
                                        .height(500.dp).fillMaxWidth(),
                                    text = "Content",
                                )
                            }

                            item {
                                Text(modifier = Modifier.height(500.dp).background(Color.Red).fillMaxWidth(), text = "Content")
                            }
                        }
                    }
                }
            }
        }
    }
}
```

```
2024-02-27 22:53:19.469  6414-6414  HomeScreen              com...musicplayer.feature.home.test  D  onPreScroll: available Offset(0.0, -24.4)
2024-02-27 22:53:19.469  6414-6414  HomeScreen              com...musicplayer.feature.home.test  D  onPreScroll: source Drag
2024-02-27 22:53:19.469  6414-6414  HomeScreen              com...musicplayer.feature.home.test  D  onPreScroll: return -4.8910155

2024-02-27 22:53:19.469  6414-6414  HomeScreen2             com...musicplayer.feature.home.test  D  onPreScroll: available Offset(0.0, -19.5)
2024-02-27 22:53:19.469  6414-6414  HomeScreen2             com...musicplayer.feature.home.test  D  onPreScroll: source Drag
2024-02-27 22:53:19.469  6414-6414  HomeScreen2             com...musicplayer.feature.home.test  D  onPreScroll: return -7.825625

2024-02-27 22:53:19.469  6414-6414  HomeScreen3             com...musicplayer.feature.home.test  D  onPreScroll: available Offset(0.0, -11.7)
2024-02-27 22:53:19.470  6414-6414  HomeScreen3             com...musicplayer.feature.home.test  D  onPreScroll: source Drag
2024-02-27 22:53:19.470  6414-6414  HomeScreen3             com...musicplayer.feature.home.test  D  onPreScroll: return -4.695375

2024-02-27 22:53:19.470  6414-6414  HomeScreen3             com...musicplayer.feature.home.test  D  onPostScroll: consumed Offset(0.0, -7.0)
2024-02-27 22:53:19.470  6414-6414  HomeScreen3             com...musicplayer.feature.home.test  D  onPostScroll: available Offset(0.0, 0.0)
2024-02-27 22:53:19.470  6414-6414  HomeScreen3             com...musicplayer.feature.home.test  D  onPostScroll: source Drag

2024-02-27 22:53:19.470  6414-6414  HomeScreen2             com...musicplayer.feature.home.test  D  onPostScroll: consumed Offset(0.0, -7.0)
2024-02-27 22:53:19.470  6414-6414  HomeScreen2             com...musicplayer.feature.home.test  D  onPostScroll: available Offset(0.0, 0.0)
2024-02-27 22:53:19.470  6414-6414  HomeScreen2             com...musicplayer.feature.home.test  D  onPostScroll: source Drag

2024-02-27 22:53:19.470  6414-6414  HomeScreen              com...musicplayer.feature.home.test  D  onPostScroll: consumed Offset(0.0, -7.0)
2024-02-27 22:53:19.470  6414-6414  HomeScreen              com...musicplayer.feature.home.test  D  onPostScroll: available Offset(0.0, 0.0)
2024-02-27 22:53:19.470  6414-6414  HomeScreen              com...musicplayer.feature.home.test  D  onPostScroll: source Drag
```
