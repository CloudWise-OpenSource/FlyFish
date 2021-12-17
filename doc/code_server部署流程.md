### 平台部署流程

#### 一、依赖组件即版本
```
 Node >= 8.9.3
 
 MySQL >= 5.6.38
 
 Redis >= 4.0.8
 
```

#### 二、编辑服务端配置文件
1. 进入项目
```
cd code_server

```

2. 安装项目依赖包
```
npm install
```


3. 查找127.0.0.1 替换127.0.0.1为服务器对应ip【本地部署无需修改】
```
vim macos/dist/pages/vscode.js
```

#### 三、启动服务
```
npm run linux-start
```