---
layout: post
title: "几何变换中用到的矩阵知识"
date: 2025-11-17 21:45:48 +0800
tag: "Compose|Kotlin"
---
## 仿射变换通用矩阵（Affine Transform）

$$
\begin{bmatrix}
x' \\
y' \\
1
\end{bmatrix}
=
\begin{bmatrix}
a & b & dx \\
c & d & dy \\
0 & 0 & 1
\end{bmatrix}
\begin{bmatrix}
x \\
y \\
1
\end{bmatrix}
$$

 - a, b, c, d：控制旋转、缩放、斜切
 - dx, dy：平移

### 平移

$$
\begin{bmatrix}
1 & 0 & dx \\
0 & 1 & dy \\
0 & 0 & 1
\end{bmatrix}
$$

$$
[x', y'] = (x + dx, y + dy)
$$

### 缩放

$$
\begin{bmatrix}
sx & 0 & 0 \\
0 & sy & 0 \\
0 & 0 & 1
\end{bmatrix}
$$

$$
[x', y'] = (sx * x, sy * y)
$$

### 旋转

$$
\begin{bmatrix}
\cos\theta & -\sin\theta & 0 \\
\sin\theta & \cos\theta & 0 \\
0 & 0 & 1
\end{bmatrix}
$$

$$
[x', y'] = (\cos\theta * x -\sin\theta * y, \sin\theta * x + \cos\theta * y)
$$

### Compose使用的4x4矩阵

$$
\begin{bmatrix}
x' \\
y' \\
z' \\
w
\end{bmatrix}
=
\begin{bmatrix}
m_{00} & m_{01} & m_{02} & m_{03} \\
m_{10} & m_{11} & m_{12} & m_{13} \\
m_{20} & m_{21} & m_{22} & m_{23} \\
m_{30} & m_{31} & m_{32} & m_{33}
\end{bmatrix}
\begin{bmatrix}
x \\
y \\
z \\
1
\end{bmatrix}
$$

#### 点映射
$$
\begin{aligned}
w &= m_{03}x + m_{13}y + m_{33} \\[6pt]
x' &= \frac{m_{00}x + m_{10}y + m_{30}}{w} \\[6pt]
y' &= \frac{m_{01}x + m_{11}y + m_{31}}{w}
\end{aligned}
$$

```kotlin
    fun map(point: Offset): Offset {
        // See top-level comment
        if (values.size < 16) return point

        val v00 = this[0, 0]
        val v01 = this[0, 1]
        val v03 = this[0, 3]
        val v10 = this[1, 0]
        val v11 = this[1, 1]
        val v13 = this[1, 3]
        val v30 = this[3, 0]
        val v31 = this[3, 1]
        val v33 = this[3, 3]

        val x = point.x
        val y = point.y
        val z = v03 * x + v13 * y + v33
        val inverseZ = 1 / z
        val pZ = if (inverseZ.fastIsFinite()) inverseZ else 0f

        return Offset(x = pZ * (v00 * x + v10 * y + v30), y = pZ * (v01 * x + v11 * y + v31))
    }
```

#### 缩放
$$
\begin{bmatrix}
s_x & 0   & 0   & 0 \\
0   & s_y & 0   & 0 \\
0   & 0   & s_z & 0 \\
0   & 0   & 0   & 1
\end{bmatrix}
\begin{bmatrix}
m_{00} & m_{01} & m_{02} & m_{03} \\
m_{10} & m_{11} & m_{12} & m_{13} \\
m_{20} & m_{21} & m_{22} & m_{23} \\
m_{30} & m_{31} & m_{32} & m_{33}
\end{bmatrix}
$$


```kotlin
    /** Scale this matrix by [x], [y], [z] */
    fun scale(x: Float = 1f, y: Float = 1f, z: Float = 1f) {
        // See top-level comment
        if (values.size < 16) return
        this[0, 0] *= x
        this[0, 1] *= x
        this[0, 2] *= x
        this[0, 3] *= x
        this[1, 0] *= y
        this[1, 1] *= y
        this[1, 2] *= y
        this[1, 3] *= y
        this[2, 0] *= z
        this[2, 1] *= z
        this[2, 2] *= z
        this[2, 3] *= z
    }
```

#### 位移

$$
\begin{bmatrix}
0   & 0   & 0   & 0 \\
0   & 0   & 0   & 0 \\
0   & 0   & 0   & 0 \\
d_x & d_y & d_z & 1
\end{bmatrix}
\begin{bmatrix}
m_{00} & m_{01} & m_{02} & m_{03} \\
m_{10} & m_{11} & m_{12} & m_{13} \\
m_{20} & m_{21} & m_{22} & m_{23} \\
m_{30} & m_{31} & m_{32} & m_{33}
\end{bmatrix}
$$


```kotlin
    /** Translate this matrix by [x], [y], [z] */
    fun translate(x: Float = 0f, y: Float = 0f, z: Float = 0f) {
        // See top-level comment
        if (values.size < 16) return
        val t1 = this[0, 0] * x + this[1, 0] * y + this[2, 0] * z + this[3, 0]
        val t2 = this[0, 1] * x + this[1, 1] * y + this[2, 1] * z + this[3, 1]
        val t3 = this[0, 2] * x + this[1, 2] * y + this[2, 2] * z + this[3, 2]
        val t4 = this[0, 3] * x + this[1, 3] * y + this[2, 3] * z + this[3, 3]
        this[3, 0] = t1
        this[3, 1] = t2
        this[3, 2] = t3
        this[3, 3] = t4
    }
```

#### 旋转
$$
\begin{bmatrix}
\cos\theta & \sin\theta & 0 & 0 \\
-\sin\theta & \cos\theta & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{bmatrix}
\begin{bmatrix}
m_{00} & m_{01} & m_{02} & m_{03} \\
m_{10} & m_{11} & m_{12} & m_{13} \\
m_{20} & m_{21} & m_{22} & m_{23} \\
m_{30} & m_{31} & m_{32} & m_{33}
\end{bmatrix}
$$

```kotlin
    fun rotateZ(degrees: Float) {
        // See top-level comment
        if (values.size < 16) return

        val r = degrees * (PI / 180.0)
        val s = sin(r).toFloat()
        val c = cos(r).toFloat()

        val a00 = this[0, 0]
        val a10 = this[1, 0]
        val v00 = c * a00 + s * a10
        val v10 = -s * a00 + c * a10

        val a01 = this[0, 1]
        val a11 = this[1, 1]
        val v01 = c * a01 + s * a11
        val v11 = -s * a01 + c * a11

        val a02 = this[0, 2]
        val a12 = this[1, 2]
        val v02 = c * a02 + s * a12
        val v12 = -s * a02 + c * a12

        val a03 = this[0, 3]
        val a13 = this[1, 3]
        val v03 = c * a03 + s * a13
        val v13 = -s * a03 + c * a13

        this[0, 0] = v00
        this[0, 1] = v01
        this[0, 2] = v02
        this[0, 3] = v03
        this[1, 0] = v10
        this[1, 1] = v11
        this[1, 2] = v12
        this[1, 3] = v13
    }
```

$$
\begin{bmatrix}
m_{00} & m_{01} & m_{02} & m_{03} \\
m_{10} & m_{11} & m_{12} & m_{13} \\
m_{20} & m_{21} & m_{22} & m_{23} \\
m_{30} & m_{31} & m_{32} & m_{33}
\end{bmatrix}
\begin{bmatrix}
\cos\theta & 0 & -\sin\theta & 0 \\
0 & 1 & 0  & 0 \\
\sin\theta & 0 & \cos\theta  & 0 \\
0 & 0 & 0  & 1
\end{bmatrix}
$$

```kotlin
    fun rotateY(degrees: Float) {
        // See top-level comment
        if (values.size < 16) return

        val r = degrees * (PI / 180.0)
        val s = sin(r).toFloat()
        val c = cos(r).toFloat()

        val a00 = this[0, 0]
        val a02 = this[0, 2]
        val v00 = a00 * c + a02 * s
        val v02 = -a00 * s + a02 * c

        val a10 = this[1, 0]
        val a12 = this[1, 2]
        val v10 = a10 * c + a12 * s
        val v12 = -a10 * s + a12 * c

        val a20 = this[2, 0]
        val a22 = this[2, 2]
        val v20 = a20 * c + a22 * s
        val v22 = -a20 * s + a22 * c

        val a30 = this[3, 0]
        val a32 = this[3, 2]
        val v30 = a30 * c + a32 * s
        val v32 = -a30 * s + a32 * c

        this[0, 0] = v00
        this[0, 2] = v02
        this[1, 0] = v10
        this[1, 2] = v12
        this[2, 0] = v20
        this[2, 2] = v22
        this[3, 0] = v30
        this[3, 2] = v32
    }
```


$$
\begin{bmatrix}
m_{00} & m_{01} & m_{02} & m_{03} \\
m_{10} & m_{11} & m_{12} & m_{13} \\
m_{20} & m_{21} & m_{22} & m_{23} \\
m_{30} & m_{31} & m_{32} & m_{33}
\end{bmatrix}
\begin{bmatrix}
1 & 0  & 0  & 0 \\
0 & \cos\theta  & \sin\theta & 0 \\
0 & -\sin\theta  & \cos\theta  & 0 \\
0 & 0  & 0  & 1
\end{bmatrix}
$$

```kotlin
    fun rotateX(degrees: Float) {
        // See top-level comment
        if (values.size < 16) return

        val r = degrees * (PI / 180.0)
        val s = sin(r).toFloat()
        val c = cos(r).toFloat()

        val a01 = this[0, 1]
        val a02 = this[0, 2]
        val v01 = a01 * c - a02 * s
        val v02 = a01 * s + a02 * c

        val a11 = this[1, 1]
        val a12 = this[1, 2]
        val v11 = a11 * c - a12 * s
        val v12 = a11 * s + a12 * c

        val a21 = this[2, 1]
        val a22 = this[2, 2]
        val v21 = a21 * c - a22 * s
        val v22 = a21 * s + a22 * c

        val a31 = this[3, 1]
        val a32 = this[3, 2]
        val v31 = a31 * c - a32 * s
        val v32 = a31 * s + a32 * c

        this[0, 1] = v01
        this[0, 2] = v02
        this[1, 1] = v11
        this[1, 2] = v12
        this[2, 1] = v21
        this[2, 2] = v22
        this[3, 1] = v31
        this[3, 2] = v32
    }
```
