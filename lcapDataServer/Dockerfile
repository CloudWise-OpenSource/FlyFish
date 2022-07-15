FROM harbor.cloudwise.com/base/jdk:1.8.0-201
MAINTAINER LCAP

COPY --chown=commonuser:commonuser lcapDataServer /data/app/lcapDataServer
RUN chmod +x /data/app/lcapDataServer/bin/*.sh

ENV CW_LOCAL_IP=127.0.0.1
ENV CW_RUN_USER="commonuser"
ENV CW_INSTALL_APP_DIR="/data/app"
ENV CW_INSTALL_LOGS_DIR="/data/logs"
ENV CW_INSTALL_DATA_DIR="/data/appData"
ENV CW_NACOS_SERVER="svc-nacos:18117"
ENV CW_NACOS_USERNAME="nacos"
ENV CW_NACOS_PASSWORD="kbRmjCIED/vXbOjxUudm649N+KSUmy/JpFm53hwPH0hTwEcBYxy3jl72Hw5C4dJHeoIBKaQpa1Vp+4s/iIEQVAbRlHvZ7EATKCidTbpSbP1/ceg18fQFBeSslNmnOZ8rvmoWZkQ/NPs6WmEXCpyGr6z1/vSyJwhtdpnYt8fSlDg="
ENV CW_NACOS_NAMESPACE="PROD"
ENV CW_SERVER_NAME="lcapDataServer"
ENV CW_LCAP_WEB_DIR="/data/app/portalWeb/lcapWeb"
ENV CW_DATA_DIR="/data/appData/lcapDataServer"
ENV CW_SERVICE_PORT="18532"
ENV CW_MONGODB_IP="svc-mongodb"
ENV CW_MONGODB_PORT="18017"
ENV CW_MONGODB_USERNAME="admin"
ENV CW_MONGODB_PASSWORD="Yzh@redis_123"
ENV CW_JVM_HEAP_SIZE="1g"

USER commonuser

CMD ["/data/app/lcapDataServer/bin/docker-entrypoint.sh"]