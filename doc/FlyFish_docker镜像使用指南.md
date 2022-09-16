### Flyfish docker镜像使用指南

> **该镜像只支持x86的类unix系统**

* 机器上安装docker和docker-compose
* 下载Flyfish [docker-compose.yaml](https://github.com/CloudWise-OpenSource/FlyFish/releases/download/FlyFish-2.2.0/docker-compose.yaml)文件，并放置到单独的文件夹中
* 在docker-compose.yaml所在的文件夹执行

```shell
docker-compose up -d
```

* 执行命令后，看到

```shell
Creating mongodb           ... done
Creating flyfishcodeserver ... done
Creating flyfishserver     ... done
Creating fiyfishweb        ... done
Creating flyfishdataserver ... done
```

则服务启动成功。

> 由于flyfish内嵌了33个组件，需要等组件初始化完成后才能登录成功
>
> 查看server日志：docker logs flyfishserver -f
>
> upload component success: 62d60a64ae3be617a2a61ad3,  progress: 33/33
> upload done
>
> 至此 组件初始化完成

* 访问地址：http://127.0.0.1:8089

  用户名：admin  密码：utq#SpV!
