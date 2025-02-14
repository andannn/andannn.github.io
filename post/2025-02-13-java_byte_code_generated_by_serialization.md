---
layout: post
title: "解析Kotlin编译出的java字节码"
date: 2025-02-13 15:42:48 +0800
tag: "Android|Kotlin|KMP"
---

Kotlin的语法是非常精简的， 本文分析常见的Kotlin语法生成的字节码， 加深对Kotlin的理解。

### 分析字节码的工具
使用Idea的"Kotlin Bytecode"插件， 使用也很简单， 只要打开"Kotlin Bytecode"窗口，就会自动显示当前窗口的kotlin代码的Java字节码。 如果觉得看字节码很麻烦， 也可以用“DeCompile”功能反编译成Java代码。

### Getter Setter
Java的Getter Setter代码使用很广泛， 但是写起来也是真的折磨， 全都是模版代码。
Kotlin的val/var关键字就有Getter/Setter功能。

可以看到，java类里value1/value2成员变量都是私有的

然后生成了3个方法。

变量`value1`是用`val`修饰的， 只有`getValue1`方法。
变量`value2`是用`va2`修饰的， 有`getValue2`方法, `setValue2`方法。

Kotlin
```kotlin
class Foo {
    val value1: String = "1"

    var value2: Int = 2
}
```

Decompiled Java ByteCode

```Java
public final class Foo {
   @NotNull
   private final String value1 = "1";
   private int value2 = 2;
   public static final int $stable = 8;

   @NotNull
   public final String getValue1() {
      return this.value1;
   }

   public final int getValue2() {
      return this.value2;
   }

   public final void setValue2(int var1) {
      this.value2 = var1;
   }
}
```

#### object
object关键字修饰的类是一个单例对象。

反编译的Java代码中Foo类有一个静态成员`INSTANCE`， 它是在类静态初始化方法(static <clinit>()V)中被赋值的。
还有成员变量`meme`也是`static final`修饰的，证明这个成员也是属于类的。

当使用`Foo.meme`时， 生成的字节码是：
`Foo.INSTANCE.getMeme();`
所以使用这个单例对象本质上是使用Foo的静态成员`INSTANCE`。

Kotlin

```kotlin
object Foo {
    val meme: String = "1"

    init {
        val a = "1111"
    }
}
```

Decompiled Java ByteCode

```java
public final class Foo {
   @NotNull
   public static final Foo INSTANCE = new Foo();
   @NotNull
   private static final String meme = "1";
   public static final int $stable;

   private Foo() {
   }

   @NotNull
   public final String getMeme() {
      return meme;
   }

   static {
      String var0 = "1111";
   }
}

```

### 函数重载
Java的函数重载是每种形式都需要定义一个方法，十分麻烦。 
Kotlin则不需要，Kotlin额外生成了一个静态方法
`static void bar$default(Foo var0, String var1, String var2, String var3, int var4, Object var5)`

`var0`是reciver，

`var1` `var2` `var3`是 方法`bar`的3个参数

`var4`是一个二进制状态位，标记哪个参数使用初始值。 下面的例子传的是6，二进制是"110"， 表示第二个和第三个参数都使用初始值。


kotlin
```kotlin
class Foo {
    fun bar(para1: String, para2: String = "11", para3: String = "22") {}
}

// Call method
Foo().bar(para1 = "para1")
```

Decompiled Java ByteCode

```java
public final class Foo {
   public static final int $stable;

   public final void bar(@NotNull String para1, @NotNull String para2, @NotNull String para3) {
... 
   }

   // $FF: synthetic method
   public static void bar$default(Foo var0, String var1, String var2, String var3, int var4, Object var5) {
      if ((var4 & 2) != 0) {
         var2 = "11";
      }

      if ((var4 & 4) != 0) {
         var3 = "22";
      }

      var0.bar(var1, var2, var3);
   }
}

// Call method
Foo.bar$default(new Foo(), "para1", (String)null, (String)null, 6, (Object)null);
```

