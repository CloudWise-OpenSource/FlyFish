# 环境
node版本 10.12 以上
# 使用
安装依赖
```
npm i
```
本地运行
```
npm start
```
打包(目录：dist)
```
npm run build
```
打包后文件大小分析
```
npm run analyze
```
压缩（目录：publish）([遵循CICD打包规范](https://yunzhihui.feishu.cn/docs/doccn991FzkgC0q9FdBLFwyQ6xg#))
```
npm run cicd
```

# 工程目录

```
.
├── config                                   // webpack配置扩展
├── dist                                     // 打包目录
├── publish                                  // 压缩目录
├── src                                      // 源码目录
│   ├── Root.js                              // 引入router 和 store
│   ├── assets                               // 公共静态文件
│   ├── components                           // 公共组件库
│   ├── config                               // 配置文件(路由、微服务等)
│   ├── index.js                             // 入口文件
│   ├── layouts                              // 布局
│   ├── pages                                // 页面
│   ├── public                               // 非打包文件目录
│   ├── services                             // api服务
│   ├── source                               // npm源码目录(开发调试用)
│   ├── stores                               // 状态管理
│   ├── hooks                                // 自定义hook
│   ├── shared                               // 微服务共享状态处理
│   └── utils                                // 公共工具
├── README.md                                // 工程说明
├── jsconfig.json                            // 指定根目录和 为JavaScript服务增加配置
├── package-lock.json                        // 依赖锁定
├── package.json                             // 工程配置
├── .stylelintrc.js                          // stylelint配置
└── postcss.config.js                        // postcss插件配置


```

# 状态管理 cw-mobx
注册store（遵循以下约定）

```javascript
export default {
    // 唯一命名空间
	namespace: 'store', 
    // 状态
	state: { 
		num: 0,
	},
    // 副作用actins，处理异步请求 (函数生成器)
	effects: { 
		*addNumSync() {
			const res = yield getDemoApi(); // 异步请求
			this.num = res.data;
			this.addNum();
		}
	},
    // 状态修改actions
	reducers: {
		addNum() {
			this.num = this.num + 100;
		}
	},
    // 计算属性
	computeds: {
		getDoubleNum() {
			return this.num * 2;
		}
	}

};
```

使用store
```javascript
// 通过conncet高阶组件注入依赖(props)
export defalut connect(({
    store // 命名空间
}) => {
  return {
    num: store.num, // 状态
    getDoubleNum: store.getDoubleNum, // 计算属性

    addNum: store.addNum, // 状态修改actions
    addNumSync: store.addNumSync // 副作用actins
  };
})(Demo);

// 通过observer监听
import React, { useEffect } from 'react';
import { observer } from '@chaoswise/cw-mobx';
import store from './model/index';
const observerDemo = observer(() => {

  const { addNum, addSyncNum } = store;

  useEffect(() => {
    addSyncNum();
  }, [addSyncNum]);
  
  return (
    <div>
      局部model以及observr注册方法
      <div>{store.num}</div>
      <button onClick={addNum}>add</button>
    </div>
  );
});
```

使用loadingStore
> 对所有异步请求(effects中的方法)进行了loading状态监听
```js
// 1.引入全局loadingStore
import { loadingStore } from '@chaoswise/cw-mobx';

// 2.通过connect注入或者observer监听均可

const loading = loadingStore.loading['namespace/effectFunc'] // namespace: 注册store的命名空间  effectFunc  异步请求的effect函数名称


```

# 微服务 基于[qiankun](https://qiankun.umijs.org/)

## 主应用
1、注册子服务
```js
// src/config/microApp.config.js
import { registerMicroApps } from 'qiankun';
registerMicroApps([
  {
    name: 'dodi', // 与子应用package.json下的name保持一致
    entry: 'http://localhost:8803/',
    container: '#micro-app-container',
    activeRule: '#/dodi', // 路由匹配
  }
]);
```
2、入口文件引入微服务配置
```js
// 具体参考 src/config/index.js
import '@/config/microApp.config';
```
3、配置路由
> src/components/MicroAppWrapper下已经封装承载子应用的组件，可直接使用
```js
{
  icon : <Icon type="pie-chart" />,
  path: "/dodi/*", // 注册子服务通过activeRule进行匹配, /* 必须带
  name: '微服务',
  id: "33", // 权限id
  check: false, // 是否校验
  hideInMenu: false, // 是否显示菜单
  exact: true,
  component: lazy(() => import('../components/MicroAppWrapper')),
}
```

## 子应用
1、修改package.json打包命令(注入环境变量MICRO_TYPE)
> MICRO_TYPE=none 不使用微服务（默认）<br>
  MICRO_TYPE=main 主应用<br>
  MICRO_TYPE=child 子应用

```json
"scripts": {
  "start": "MICRO_TYPE=child chaoswise-scripts dev",
  "build": "MICRO_TYPE=child chaoswise-scripts build"
}
```
2、引入src/publi-path.js文件到入口文件
> 如果webpack配置了publicpath为静态地址则不需要
```js
// 处理集成后子应用静态文件404的问题
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__; // eslint-disable-line
}
```
3、配置src/publick/env-config.js下的```basename```，与主应用```activeRule```保持一致
```js
// 注册的activeRule
activeRule: '#/dodi', // 路由匹配
// 子应用的basename
basename: '/dodi/
```

备注
```js
// 读取MICRO_TYPE环境变量(判断打包模式)
var MICRO_TYPE  = window.process.env.MICRO_TYPE
// 判断是否在主应用下展示运行
var isInMainContainer = window.__POWERED_BY_QIANKUN__
```

## 注意事项
- qiankun主应用承载子应用的路由或者组件不能使用按需加载，否则会造成一闪消失的bug
- 子应用需要设置唯一publicpath（同部署补录名称）
- 子应用需要增加样式前缀（解决样式冲突）

# 使用以下公共依赖
> 详细使用方法参考[地址](https://git.cloudwise.com/DOCP/aops_web_commons.git)

依赖名称 | 说明 
---|---
@chaoswise/cw-mobx | 基于mobx mobx-react 的二次封装 
@chaoswise/request | 基于axios封装的公共请求函数 
@chaoswise/ui | 基于atnd封装的组件库
@chaoswise/utils | 公共函数库

# 常见问题解决
问题： node-sass与node版本不兼容导致启动失败

解决： 重新安装对应node版本的node-sass版本

NodeJS | Supported node-sass version	 
---|---
Node 15	| 5.0+
Node 14 | 4.14+
Node 13 | 4.13+, <5.0
Node 12 | 4.12+
Node 11 | 4.10+, <5.0

# Features

- 支持less、styled-jsx、css-moudle
- 引入eslint，规范代码风格
- 约定式路由（支持权限管理）
- 支持装饰器语法
- 支持国际化
- 兼容ie10+
- 按需加载
- 支持微服务（qiankun)
- 多主题切换
- TS支持
# TODO

- mock 使用
- 代码压缩配置自定义扩展
- git hook
- 全局配置
- 引入stylelint
- 微服务集成抽离vendor（待定）
# 已知问题
- 频繁调用action触发多次render
- styleint 开发模式不生效
- Icon导致大文件

### 已优化问题
- 微服务加载中loading提示、加载失败提示
- 提取polyfill文件(微服务主子应用共享)