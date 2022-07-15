# FROM 基础镜像
FROM harbor.cloudwise.com/base/alpine:3.14.1-tengine
# 作者
MAINTAINER LCAP

COPY --chown=commonuser:commonuser lcapWeb /data/app/lcapWeb
RUN chmod +x /data/app/lcapWeb/scripts/docker-entrypoint.sh

# 声明整体应用变量默认值（需要被替换的内容）
ENV CW_LOCAL_IP=svc-lcapserver
ENV CW_INSTALL_APP_DIR=/data/app
ENV CW_YAPI_SERVER_PORT=18532
ENV CW_CODE_SERVER_PORT=18533
ENV CW_LOCAL_PORT=18080

VOLUME /data/app/lcapWeb/www
# 调用docker-entrypoint.sh脚本, 根据自己服务名书写
USER commonuser
CMD /data/app/lcapWeb/scripts/docker-entrypoint.sh