---
layout: post
title: "单向数据流"
date: 2024-09-25 11:48:28 +0800
tag: "Compose|Android|Kotlin"
---

https://developer.android.com/develop/ui/compose/architecture#udf
> A unidirectional data flow (UDF) is a design pattern where state flows down and events flow up. By following unidirectional data flow, you can decouple composables that display state in the UI from the parts of your app that store and change state.

![U](https://developer.android.com/static/develop/ui/compose/images/state-unidirectional-flow.png)

#### UDF设计模式解决了什么问题？

```dart
class TestSlider extends StatelessWidget {
  const TestSlider({super.key});

  @override
  Widget build(BuildContext context) {
    return Slider(value: 0.0, onChanged: (_) {});
  }
}
```

```dart
class TestSlider extends StatefulWidget {
  const TestSlider({super.key});

  @override
  State<TestSlider> createState() => _TestSliderState();
}

class _TestSliderState extends State<TestSlider> {
  double _value = 0.0;

  @override
  Widget build(BuildContext context) {
    return Slider(
      value: _value,
      onChanged: (factor) {
        setState(() {
          _value = factor;
        });
      },
    );
  }
}
```








