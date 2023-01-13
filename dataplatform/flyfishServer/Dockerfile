FROM harbor.cloudwise.com/base/jdk:1.8.0-201
MAINTAINER LCAP

COPY --chown=commonuser:commonuser lcapServer /data/app/flyfishServer
RUN chmod +x /data/app/flyfishServer/bin/*.sh && chown -R commonuser:commonuser /data

USER commonuser

CMD ["/data/app/flyfishServer/bin/docker-entrypoint.sh"]