FROM harbor.cloudwise.com/base/jdk:1.8.0-201
MAINTAINER LCAP

COPY --chown=commonuser:commonuser lcapServer /data/app/flyfishDevServer
RUN chmod +x /data/app/flyfishDevServer/bin/*.sh && chown -R commonuser:commonuser /data

USER commonuser
FROM openjdk:8-jdk-alpine
#指定时区
RUN ln -snf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo Asia/Shanghai > /etc/timezone

ARG JAR_FILE
ARG OUT_DIRECTORY
#复制依赖jar
COPY ${OUT_DIRECTORY}/lib /home/project/lib/
#复制配置文件
COPY ${OUT_DIRECTORY}/resources /home/project/resources/
#复制项目jar
COPY ${JAR_FILE} /home/project/model-one.jar
#声明使用的端口，需要-p去绑定宿主机否则将随机绑定
EXPOSE 8081

CMD ["/data/app/flyfishDevServer/bin/docker-entrypoint.sh"]