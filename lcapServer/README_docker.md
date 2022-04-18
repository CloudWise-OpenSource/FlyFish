#### 环境依赖

| 环境  | 说明      |
| ----- | --------- |
| docker  | >= 20.10.8  |
| docker-compose | >= 1.29.2 |

#### 所需服务器资源
| 资源  | 说明  |
| ----- | --------- |
| CPU  | 8Core |
| 内存 | 16G |
| 硬盘 | 200G |

#### 目录结构
- 将flyfish2.0-server、code-server、yapi放于同一个目录下
- 将前端build后的dist文件放于flyfish2.0-server根目录下
- 将www目录放于flyfish2.0-server根目录下
```
├── flyfish2.0-server
│   ├── Dockerfile
│   ├── README.md
│   ├── README_docker.md
│   ├── app
│   ├── app.js
│   ├── appveyor.yml
│   ├── changelog
│   ├── config
│   ├── docker-compose.yml
│   ├── init.sh
│   ├── mongo               // 数据库存储目录（配置和数据）
│   ├── nginx.conf          // nginx配置
│   ├── package.json
│   ├── dist                // 前端构建包
│   └── www                 // 静态资源
├── code-server             // 在线编辑器
│   ├── Dockerfile
│   ├── linux               // linux环境
│   └── macos               // mac环境
├── yapi                    
│   ├── Dockerfile
│   ├── server
│   ├── config
...

```
#### 准备工作
1. 宿主机默认为root账号，其他账号需要修改权限
2. flyfish2.0-server/www/components目录下执行npm install
#### 部署流程

1. 启动
```
docker-compose up -d
```
2. 更新
  - 宿主机上更新代码
  - 重新构建镜像并启动
  ```
  docker-compose up --force-recreate --build -d [ServerName]
  ```
  Tips: ServerName为容器名：flyfish-server、flyfish-yapi ...
