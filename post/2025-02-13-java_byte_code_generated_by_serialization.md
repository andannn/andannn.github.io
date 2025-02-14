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

### data class

Kotlin的数据类会生成以下方法。

`Foo(String var1, String var2, int var3, DefaultConstructorMarker var4)` 额外的构造函数， 用来做函数重载

`toString`

`copy`

`copy$default` 函数重载用

`equals`

`componentN` 解构语法用

```kotlin
data class Foo(
    val para1: String,
    val para2: String = "",
)

// deconstruct
val (a, b) = Foo("")
```

Decompiled Java ByteCode

```java
public final class Foo {
   @NotNull
   private final String para1;
   @NotNull
   private final String para2;
   public static final int $stable;

...

   @NotNull
   public final String component1() {
      return this.para1;
   }

   @NotNull
   public final String component2() {
      return this.para2;
   }

   @NotNull
   public final Foo copy(@NotNull String para1, @NotNull String para2) {
..
      return new Foo(para1, para2);
   }

   // $FF: synthetic method
   public static Foo copy$default(Foo var0, String var1, String var2, int var3, Object var4) {
      if ((var3 & 1) != 0) {
         var1 = var0.para1;
      }

      if ((var3 & 2) != 0) {
         var2 = var0.para2;
      }

      return var0.copy(var1, var2);
   }

   @NotNull
   public String toString() {
      return "Foo(para1=" + this.para1 + ", para2=" + this.para2 + ')';
   }

   public int hashCode() {
      int result = this.para1.hashCode();
      result = result * 31 + this.para2.hashCode();
      return result;
   }

   public boolean equals(@Nullable Object other) {
...
   }
}

// deconstruct
      Foo var0 = new Foo("", (String)null, 2, (DefaultConstructorMarker)null);
      String a = var0.component1();
      String b = var0.component2();
```


### extension function
Kotlin中带有Reciver的扩展函数本质上是一个静态函数， 函数的第一个参数是该Reciver。

``` kotlin
class Foo {
}

fun Foo.extension() {

}
```

``` java
   public static final void extension(@NotNull Foo $this$extension) {
      Intrinsics.checkNotNullParameter($this$extension, "<this>");
   }
```

### inline function
可以看到如果用inline修饰函数， block里的内容就被展开到调用方。
如果没有inline， 就是正常的函数调用（传入一个lambda）

```kotlin
class Foo {
    inline fun bar(block: () -> Unit) {
        block()
    }
}

fun main() {
    val foo = Foo()
    foo.bar {
        println("hello")
    }
}
```

with inline
```java
   public static final void main() {
      Foo foo = new Foo();
      int $i$f$bar = false;
      int var3 = false;
      String var4 = "hello";
      System.out.println(var4);
   }
```

without inline
```java
   public static final void main() {
      Foo foo = new Foo();
      foo.bar(TestKt::main$lambda$0);
   }

   private static final Unit main$lambda$0() {
      String var0 = "hello";
      System.out.println(var0);
      return Unit.INSTANCE;
   }
```

### companion 
companion object 本质上是一个静态的内部类， 他的名字默认是Companion， 如果这样声明， `companion object A`， 则生成的内部类的名字是A。

`Foo` 有一个静态的成员`Companion`，用类名来引用的时候都是引用的这个静态成员`Companion`

由于是一个内部类，伴生对象还可以实现接口，语法如下

`companion object A: Interface`

生成的内部类为

`public static final class A implements Interface`
    

```kotlin
class Foo {
    companion object {
        
    }
}
```

```java
public final class Foo {
   @NotNull
   public static final Companion Companion = new Companion((DefaultConstructorMarker)null);

   public static final class Companion {
      private Companion() {
      }

      // $FF: synthetic method
      public Companion(DefaultConstructorMarker $constructor_marker) {
         this();
      }
   }
}
```


#### Delegation﻿

1. 类代理

代理的类会生成一个私有成员$$delegate_0，它在构造函数中初始化。
并且重写所有的接口方法， 默认实现是直接调用这个类的对应方法。

```kotlin
interface Base {
    fun print()
}

class BaseImpl(val x: Int) : Base {
    override fun print() { print(x) }
}

class Derived(b: Base) : Base by b
```

```java
public final class Derived implements Base {
   // $FF: synthetic field
   private final Base $$delegate_0;

   public Derived(@NotNull Base b) {
      Intrinsics.checkNotNullParameter(b, "b");
      super();
      this.$$delegate_0 = b;
   }

   public void print() {
      this.$$delegate_0.print();
   }
```

2. 值代理

值的代理对象是一个私有成员变量`p$delegate`， 在生成的Getter/Setter方法中
调用这个代理对象的getter/setter方法
。

代理的getter/setter有一个`property: KProperty<*>`参数， 这个是别代理的成员的
类型。 可以看到这个值是从$$delegatedProperties取得的

```kotlin
class Example {
    var p: String by Delegate()
}

class Delegate {
    operator fun getValue(thisRef: Any?, property: KProperty<*>): String {
        return "$thisRef, thank you for delegating '${property.name}' to me!"
    }

    operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {
        println("$value has been assigned to '${property.name}' in $thisRef.")
    }
}
```

```java
public final class Example {
   // $FF: synthetic field
   static final KProperty[] $$delegatedProperties;
   @NotNull
   private final Delegate p$delegate = new Delegate();
   public static final int $stable;

   @NotNull
   public final String getP() {
      return this.p$delegate.getValue(this, $$delegatedProperties[0]);
   }

   public final void setP(@NotNull String var1) {
      Intrinsics.checkNotNullParameter(var1, "<set-?>");
      this.p$delegate.setValue(this, $$delegatedProperties[0], var1);
   }

   static {
      KProperty[] var0 = new KProperty[]{Reflection.mutableProperty1((MutablePropertyReference1)(new MutablePropertyReference1Impl(Example.class, "p", "getP()Ljava/lang/String;", 0)))};
      $$delegatedProperties = var0;
   }
}
```