FROM harbor.cloudwise.com/base/jdk:1.8.0-201
MAINTAINER LCAP

COPY --chown=commonuser:commonuser lcapServer /data/app/lcapServer
RUN chmod +x /data/app/lcapServer/bin/*.sh && chown -R commonuser:commonuser /data

ENV CW_SERVICE_NAME=lcapServer
ENV CW_SERVER_NAME=lcapServer
ENV CW_LOCAL_IP=127.0.0.1
ENV CW_RUN_USER="commonuser"
ENV CW_INSTALL_APP_DIR="/data/app"
ENV CW_INSTALL_LOGS_DIR="/data/logs"
ENV CW_INSTALL_DATA_DIR="/data/appData"
ENV CW_NACOS_SERVER="svc-nacos:18117"
ENV CW_NACOS_USERNAME="nacos"
ENV CW_NACOS_PASSWORD="kbRmjCIED/vXbOjxUudm649N+KSUmy/JpFm53hwPH0hTwEcBYxy3jl72Hw5C4dJHeoIBKaQpa1Vp+4s/iIEQVAbRlHvZ7EATKCidTbpSbP1/ceg18fQFBeSslNmnOZ8rvmoWZkQ/NPs6WmEXCpyGr6z1/vSyJwhtdpnYt8fSlDg="
ENV CW_NACOS_NAMESPACE="PROD"
ENV CW_SERVER_NAME="lcapServer"
ENV CW_LCAP_WEB_DIR="/data/app/portalWeb/lcapWeb"
ENV CW_DATA_DIR="/data/appData/lcapServer"
ENV CW_SERVICE_PORT="18531"
ENV CW_JVM_HEAP_SIZE="1g"

USER commonuser

CMD ["/data/app/lcapServer/bin/docker-entrypoint.sh"]