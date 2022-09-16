### FlyFish docker 镜像使用指南

> **该镜像只支持 x86 的类 unix 系统**

- 机器上安装 docker 和 docker-compose
- 下载 Flyfish [docker-compose.yaml](https://objects.githubusercontent.com/github-production-release-asset-2e65be/414829493/10d6c8dd-3515-4baa-8261-e032b30eb295?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20220916%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20220916T063824Z&X-Amz-Expires=300&X-Amz-Signature=ca8c922fd9adaaf37478637c109694576731bac8e594de3ff16c7efa6f99c9ff&X-Amz-SignedHeaders=host&actor_id=17558799&key_id=0&repo_id=414829493&response-content-disposition=attachment%3B%20filename%3Ddocker-compose.yaml&response-content-type=application%2Foctet-stream)文件，并放置到单独的文件夹中
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
