---
layout: post
title: "学习Compose"
date: 2025-02-13 15:42:48 +0800
tag: "Android|Kotlin|KMP"
---

准备从生成的字节码中学习Compose的基础。 菜如我这样的看不懂CompilerPlugin的代码。 所以想从字节码分析工具中尝试看出一些东西。

#### 一个最简单的例子

```kotlin
@Composable fun Test() {
   printlin()
}
```

/// Decompiled code
```java
   @Composable
   public static final void Test(@Nullable Composer $composer, int $changed) {
      $composer = $composer.startRestartGroup(-977606198);
      ComposerKt.sourceInformation($composer, "C(Test):ComposeTest.kt#ppsd2i");
      if ($changed == 0 && $composer.getSkipping()) {
         $composer.skipToGroupEnd();
      } else {
         if (ComposerKt.isTraceInProgress()) {
            ComposerKt.traceEventStart(-977606198, $changed, -1, "com.andannn.melodify.Test (ComposeTest.kt:6)");
         }

         System.out.println();

         if (ComposerKt.isTraceInProgress()) {
            ComposerKt.traceEventEnd();
         }         
      }

      ScopeUpdateScope var2 = $composer.endRestartGroup();
      if (var2 != null) {
         var2.updateScope(ComposeTestKt::Test$lambda$0);
      }
   }

   private static final Unit Test$lambda$0(int $$changed, Composer $composer, int $force) {
      Test($composer, RecomposeScopeImplKt.updateChangedFlags($$changed | 1));
      return Unit.INSTANCE;
   }
```

```kotlin
@Composable fun Test(foo: Foo) {
    Text(text = foo.toString())
}
```

`$changed`表示Compose函数传入参数的状态位， 除了最低位， 每3个bit表示一个参数。以下是标识位的含义：
0b000 -> Uncertain
0b001 -> Same
0b010 -> Different
0b011 -> Static

```java
   @Composable
   public static final void Test(@NotNull Foo foo, @Nullable Composer $composer, int $changed) {
      Intrinsics.checkNotNullParameter(foo, "foo");
      $composer = $composer.startRestartGroup(-1197380576);
      ComposerKt.sourceInformation($composer, "C(Test)9@158L27:ComposeTest.kt#ppsd2i");
      int $dirty = $changed;
      if (($changed & 0b1110) == 0) { // Uncertain
         $dirty |= $composer.changed(foo) ? 0b0100 : 0b0010;
      }

      if (($dirty & 0b1011) == 0b_001_0 && $composer.getSkipping()) {
         $composer.skipToGroupEnd();
      } else {
         if (ComposerKt.isTraceInProgress()) {
            ComposerKt.traceEventStart(-1197380576, $dirty, -1, "com.andannn.melodify.Test (ComposeTest.kt:8)");
         }

         TextKt.Text(foo.toString(), (GlanceModifier)null, (TextStyle)null, 0, $composer, 0, 14);
         if (ComposerKt.isTraceInProgress()) {
            ComposerKt.traceEventEnd();
         }
      }

      ScopeUpdateScope var4 = $composer.endRestartGroup();
      if (var4 != null) {
         var4.updateScope(ComposeTestKt::Test$lambda$0);
      }

   }

   private static final Unit Test$lambda$0(Foo $foo, int $$changed, Composer $composer, int $force) {
      Test($foo, $composer, RecomposeScopeImplKt.updateChangedFlags($$changed | 1));
      return Unit.INSTANCE;
   }
```



```kotlin
enum class ParamState(val bits: Int) {
    /**
     * Indicates that nothing is certain about the current state of the parameter. It could be
     * different than it was during the last execution, or it could be the same, but it is not
     * known so the current function looking at it must call equals on it in order to find out.
     * This is the only state that can cause the function to spend slot table space in order to
     * look at it.
     */
    Uncertain(0b000),

    /**
     * This indicates that the value is known to be the same since the last time the function was
     * executed. There is no need to store the value in the slot table in this case because the
     * calling function will *always* know whether the value was the same or different as it was
     * in the previous execution.
     */
    Same(0b001),

    /**
     * This indicates that the value is known to be different since the last time the function
     * was executed. There is no need to store the value in the slot table in this case because
     * the calling function will *always* know whether the value was the same or different as it
     * was in the previous execution.
     */
    Different(0b010),

    /**
     * This indicates that the value is known to *never change* for the duration of the running
     * program.
     */
    Static(0b011),
    Unknown(0b100),
    Mask(0b111);

    fun bitsForSlot(slot: Int): Int = bitsForSlot(bits, slot)
}
```

```kotlin
@Composable fun Test(foo: Foo, bar: Bar) {
    Text(text = foo.toString())
}
```

```java
   @Composable
   public static final void Test(@NotNull Foo foo, @NotNull Bar bar, @Nullable Composer $composer, int $changed) {
      $composer = $composer.startRestartGroup(1037984167);
      ComposerKt.sourceInformation($composer, "C(Test)P(1)9@181L27,10@213L27:ComposeTest.kt#ppsd2i");
      int $dirty = $changed;
      if (($changed & 0b1110) == 0) { // Uncertain
         $dirty |= $composer.changed(foo) ? 0b0100 : 0b0010;
      }

      if (($changed & 0b_111_000_0) == 0) {
         $dirty |= $composer.changed(bar) ? 0b_010_000_0 : 0b_001_000_0;
      }

      if (($dirty & 0b_101_101_1) == 0b_001_001_0 && $composer.getSkipping()) {
         $composer.skipToGroupEnd();
      } else {
         if (ComposerKt.isTraceInProgress()) {
            ComposerKt.traceEventStart(1037984167, $dirty, -1, "com.andannn.melodify.Test (ComposeTest.kt:8)");
         }

         TextKt.Text(foo.toString(), (GlanceModifier)null, (TextStyle)null, 0, $composer, 0, 0b_111_0);
         TextKt.Text(bar.toString(), (GlanceModifier)null, (TextStyle)null, 0, $composer, 0, 0b_111_0);
         if (ComposerKt.isTraceInProgress()) {
            ComposerKt.traceEventEnd();
         }
      }

      ScopeUpdateScope var5 = $composer.endRestartGroup();
      if (var5 != null) {
         var5.updateScope(ComposeTestKt::Test$lambda$0);
      }
   }
```

### remember
```kotlin
@Composable fun Test() {
    val a = remember {
        initValue()
    }
}
```

```java
   @Composable
   public static final void Test(@Nullable Composer $composer, int $changed) {
      $composer = $composer.startRestartGroup(-977606198);
      ComposerKt.sourceInformation($composer, "C(Test)11@243L36:ComposeTest.kt#ppsd2i");
      if ($changed == 0 && $composer.getSkipping()) {
         $composer.skipToGroupEnd();
      } else {
         if (ComposerKt.isTraceInProgress()) {
            ComposerKt.traceEventStart(-977606198, $changed, -1, "com.andannn.melodify.Test (ComposeTest.kt:10)");
         }

         ComposerKt.sourceInformationMarkerStart($composer, -492369756, "CC(remember):Composables.kt#9igjgp");
         Object it$iv$iv = $composer.rememberedValue();
         Object var10000;
         if (it$iv$iv == Composer.Companion.getEmpty()) {
            Object value$iv$iv = initValue();
            $composer.updateRememberedValue(value$iv$iv);
            var10000 = value$iv$iv;
         } else {
            var10000 = it$iv$iv;
         }

         Object var11 = var10000;
         ComposerKt.sourceInformationMarkerEnd($composer);
         String a = (String)var11;
         if (ComposerKt.isTraceInProgress()) {
            ComposerKt.traceEventEnd();
         }
      }

      ScopeUpdateScope var12 = $composer.endRestartGroup();
      if (var12 != null) {
         var12.updateScope(ComposeTestKt::Test$lambda$1);
      }
   }
```