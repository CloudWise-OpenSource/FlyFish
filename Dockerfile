#基础镜像
FROM luckydwqdocker/flyfish:v1.0

#工作目录
WORKDIR /data/app/flyFish/flyfish

#copy工作目录
COPY . /data/app/flyFish/flyfish

#设置环境变量
ENV PATH=/root/.nvm/versions/node/v14.17.5/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

#端口映射
EXPOSE 8364

#安装依赖
RUN sh startup.sh

# #docker run
# # CMD ["node", "dev.js"]
CMD ["sh", "scripts/setup.sh"]