FROM harbor.cloudwise.com/base/jdk:1.8.0-201
MAINTAINER LCAP

COPY --chown=commonuser:commonuser lcapServer /data/app/flyfishDevServer
RUN chmod +x /data/app/flyfishDevServer/bin/*.sh && chown -R commonuser:commonuser /data

USER commonuser
#指定时区
RUN ln -snf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo Asia/Shanghai > /etc/timezone

EXPOSE 19532

CMD ["/data/app/flyfishDevServer/bin/docker-entrypoint.sh"]