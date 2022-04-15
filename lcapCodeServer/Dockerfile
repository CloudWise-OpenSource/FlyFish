FROM node:14.19-buster-slim
WORKDIR /data/app/code-server
COPY . /data/app/code-server
RUN chmod -R +x *
EXPOSE 8081

CMD ["/usr/local/bin/npm", "run", "linux-docker-start"]