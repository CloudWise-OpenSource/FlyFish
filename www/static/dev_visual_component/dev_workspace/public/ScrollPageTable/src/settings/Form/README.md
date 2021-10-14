# 使用4.x的开发方式

对3.x的`form`进行封装

## FAQ

1. 控制台报warn: `Warning: `getFieldDecorator` will override `value`, so please don't set `value` directly and use `setFieldsValue` to set it.`
由于部分templates中引用的二次封装的`props`中有`value`导致。