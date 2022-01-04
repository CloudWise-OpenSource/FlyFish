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

2. 修改bind-addr为服务器ip
```
vim config.yaml
```

#### 三、启动服务
```
npm run linux-start
npm run macos-start
```