FROM node:14.19-alpine
ENV ROOTDIR /data/app/flyfish2.0-server
WORKDIR $ROOTDIR
COPY package.json $ROOTDIR
COPY changelog/package.json  $ROOTDIR/changelog/package.json

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
  apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
  PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN npm config set registry https://registry.npmmirror.com && npm install && \
cd $ROOTDIR/changelog && npm install 

COPY . $ROOTDIR

RUN chmod -R +x node_modules
EXPOSE 7001

CMD ["/bin/sh", "startup.sh"]