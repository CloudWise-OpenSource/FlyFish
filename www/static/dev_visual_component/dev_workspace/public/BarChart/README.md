# 柱状图

## 部分类型声明
```ts
interface seriesItem {
  legend: string,
  value: number,
  color?: string
}

interface seriesGroupItem {
  name: string,
  data: number[]
}
```

## 数据源格式要求`[{ data }]`data字段结构
关于数据源, 为以下约定方式:
1. 整体结构为二维数组
2. 组成方式为: [ xAxis: [], series: T<[]> ]
  - xAxis为xAxis.data的最终入参方式
  - series为series.data, 若为`number[]`或`string[]`的话，自动禁用`legend`. 若为`seriesItem[]`, 则根据`legend`和`color`字段自动生成图例。若为标准图例格式(`seriesGroupItem[]`)效果同`seriesItem[]`