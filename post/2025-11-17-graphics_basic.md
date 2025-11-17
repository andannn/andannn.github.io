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

- 上面左边 3×3：旋转 + 缩放 + 斜切
- 右上 3×1：平移 (tx, ty, tz)
- 最后一行：控制 透视投影 和 W 分量

<!-- 
默认无变换
$$
\begin{bmatrix}
1 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{bmatrix}
$$ -->

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





