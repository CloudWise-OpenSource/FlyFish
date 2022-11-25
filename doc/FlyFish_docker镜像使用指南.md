### Flyfish docker 镜像使用指南

> **该镜像支持 x86 的类 unix 系统**
> 
> **支持Windows10及以上系统**
> 
> **不支持ARM架构CPU，如M1芯片的Mac系统**

- 机器上安装 docker 和 docker-compose
- 下载 FlyFish [docker-compose.yaml](https://github.com/CloudWise-OpenSource/FlyFish/releases/download/FlyFish-2.3.0/docker-compose.yaml)文件，并放置到单独的文件夹中
- 在 docker-compose.yaml 所在的文件夹执行

```shell
docker-compose up -d
```

- 执行命令后，看到

```shell
Creating mongodb           ... done
Creating flyfishcodeserver ... done
Creating flyfishserver     ... done
Creating fiyfishweb        ... done
Creating flyfishdataserver ... done
```

则服务启动成功。

> 由于 flyfish 内嵌了 33 个组件，需要等组件初始化完成后才能登录成功
>
> 查看 server 日志：docker logs flyfishserver -f
>
> upload component success: 62d60a64ae3be617a2a61ad3, progress: 33/33
> upload done
>
> 至此 组件初始化完成

- 访问地址：http://127.0.0.1:8089

  用户名：admin 密码：utq#SpV!
  
### FAQ

Q：通过Docker部署后，左侧功能菜单不可用，全部空白，如下图所示

<img width="1401" alt="截屏2022-10-26 14 44 10" src="https://user-images.githubusercontent.com/21328793/197953835-d1216106-2a4a-412c-a5c1-21ed54f644a1.png">
A：将docker-compose里的127的地址都改成本机IP后再次尝试
