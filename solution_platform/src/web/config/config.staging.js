module.exports = {
  // platform 静态资源前缀
  platformPrefix: "/",
  indexTitle: "",

  // paas API conf
  paasAPIConf: {
    accessKeyID: "80b60beae162111013185863e0fba512", // paas平台accessKeyID
    accessKeySecret: "1d2d43c0bd0d11f761c2d7a24d0a42b6", // paas平台accessKeySecret
    domain: "http://10.2.3.247:8360",
  },

  // 不需要验证是否登录的路由配置
  noCheckIsLoginRoutes: [
    "/web/rbac/user/login",
    "/web/visualScreen/screenEditor/getModelList", // 获取大屏模型列表
    "/web/visualScreen/screenEditor/getModelData", // 获取大屏模型数据
    "/web/visualScreen/screen/downloadScreenSource",
  ],

  proxy: {
    proxyDataHub: {
      targetHost: "http://10.0.3.187:4567", //目标主机(内部封装)
      prefix: "proxyDataHub", //代理前缀
    },
  },
};
