# viewbox-offset

自用

### 产生原因

UI给的矢量图，导出时width height写死了，然后因为旋转了不同组，导致多余了很多冗余信息，并且自动伸缩不能，所以制作了这个沙雕工具.

### 适用范围

path元素的d属性值，只支持以三次贝塞尔画的曲线和直线，也就是M和C

### 计算内容

整个path距离画布的偏移值x和y

### 原理

收集各个点，计算三次贝塞尔曲线的顶点，入栈，然后寻找最小的x值和最小的y值作为offset值

### 公式依据

设 Bt 为要计算的贝塞尔曲线上的坐标，N 为控制点个数，P0,P1,P2..Pn 为贝塞尔曲线控制点的坐标，当 N 值不同时有如下计算公式: 

如 N 为 3 表示贝塞尔曲线的控制点有 3 个点，这时 n 为 2 ，这三个点分别用 P0,P1,P2 表示。

+ N = 3: P = (1-t)^2*P0 + 2*(1-t)*t*P1 + t^2*P2 
+ N = 4: P = (1-t)^3*P0 + 3*(1-t)^2*t*P1 + 3(1-t)*t^2*P2 + t^3*P3 
+ N = 5: P = (1-t)^4*P0 + 4*(1-t)^3*t*P1 + 6(1-t)^2*t^2*P2 + 4*(1-t)*t^3*P3 + t^4*P4 
--------------------- 
版权声明：本文为CSDN博主「DuanJiaNing_」的原创文章，遵循CC 4.0 by-sa版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/aimeimeits/article/details/72809382

### 简化公式

```javascript
const t = .5;
const coefficient = Math.pow(t, 3);
const x = coefficient * (this.start.x + 3.0 * this.ctrl0.x + 3.0 * this.ctrl1.x + this.end.x);
const y = coefficient * (this.start.y + 3.0 * this.ctrl0.y + 3.0 * this.ctrl1.y + this.end.y);
```
