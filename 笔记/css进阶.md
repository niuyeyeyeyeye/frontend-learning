#  css进阶

## flexbox布局

### flex值

将盒子的display设置成flex，盒子内的直系元素都会变成flex元素，将会为盒子添加一个默认横向的主轴和一个垂直于主轴的交叉轴，并且盒子内的`直系子元素会从起始线（默认在左边）开始在主轴方向上排成一行`,元素在交叉轴会被拉伸，如果元素总宽度大于盒子，在主轴上会被缩小

### justify-content属性

设置容器内主轴元素间和周围的空间

- `start`

  从行首开始排列。每行第一个元素与行首对齐，同时所有后续的元素与前一个对齐。

- `center`

  第一个元素到行首的距离和最后一个元素到行尾的距离相同

- `space-between`

  相邻元素间距离相同。每行第一个元素与行首对齐，每行最后一个元素与行尾对齐。


- `space-around`

  相邻元素间距离相同。每行第一个元素到行首的距离和每行最后一个元素到行尾的距离将会是相邻元素之间距离的一半。

- `space-evenly`

  相邻 flex 项之间的间距，主轴起始位置到第一个 flex 项的间距，主轴结束位置到最后一个 flex 项的间距，都完全一样。

### flex-wrap属性

将flex-wrap设置为`wrap`，如果你的项目太大而无法全部显示在一行中，则会换行显示。

### align-items属性

使元素在交叉轴上对齐

- `stretch`

  元素如果小于盒子的高度，将会等量增大填充容器

- `center`

  元素在交叉轴上居中，如果高度大于容器将会两个方向同时溢出

- `start`

  元素与容器的交叉轴起点对齐

- `end`

  元素与容器的交叉轴末端对齐





## grid网格布局

### grid值

将盒子的display属性值设置为grid，将会控制直系子元素的行和列

### grid-template-columns

可以设置子元素的列数和宽度

`grid-template-columns: 60px 1fr`fr是可分配空间的比例单位，fr前面必须带数字，冒号后有几个属性就分成几格

`grid-template-columns: repeat()函数`：

有两个值，可以设置可分配空间的列数并平均分配

```css
repeat(3, 1fr)
```

### grid-column

直接设置子元素的位置,根据grid-template-columns设置的列数来定位，有grid-column-start和grid-column-end两个值,开始线和结束线，有n列就有n+1条线。

`grid-column：1 / -1;`-1是一行的最后一条线

## 响应式布局

### flex属性

作用于子元素，分配元素的剩余空间，有`flex-grow（默认0，不填充）`，`flex-shrink（默认1，允许压缩）`,`flex-basis（默认auto，由内容宽高决定）`三个值，分别是**是否填充剩余空间**，**空间不够是否压缩自身**，，**初始尺寸**。

`flex：1;`平均分配盒子宽高

`flex：auto;`平分剩余空间

`flex:none;`空间固定，由内容或宽高决定

`flex：initial`不扩大可缩小

### rem / vw / vh

#### rem

默认`1rem = 16px`

相对根元素(html)的 font-size —— 改一处，全站缩放

~~~css
html {
      font-size: 16px;
    }
~~~

`会改变未设置font-size值的子元素`

#### clamp

clamp(最小值, 理想值, 最大值)

~~~ css
font-size: clamp(14px, 3vw, 24px);
~~~



#### vm

`1vm = 视口宽1%`，相当于屏幕宽度的百分之一



#### vh

`1vh = 视口高1%`

### @media规则

@media 媒体类型 and（媒体特征）{

css内容

}

#### 媒体类型（通常省略）

- screen（屏幕/电脑/手机）
- print（打印机/打印预览）
- all（所有设备）

#### 媒体特征（必须写在括号内）

- 宽度类：min-width(大于等于)、max-width(小于等于)、width（精确）

  ~~~ css
  新版（可读性更好）：
  (min-width: 601px) and (max-width: 900px) 可简写为
  (601px <= width <= 900px)
  ~~~

- 高度类：min-height、max-height

- 交互类：hover，pointer：coarse等

- 横屏/竖屏：`orientation: landscape`/`orientation: portrait`