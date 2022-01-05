### 平台部署流程

```
注意: 使用的是发行版本，已经安装好所有依赖，无需自己安装，按照下列文档操作即可~
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
linux平台：npm run linux-start
mac平台：npm run macos-start
```