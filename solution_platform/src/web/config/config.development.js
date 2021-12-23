module.exports = {
  // platform 静态资源前缀
  platformPrefix: "/",
  indexTitle: "",

  // paas API conf
  paasAPIConf: {
    accessKeyID: "f77ab8f512518ba7f98e5e45782227ab", // paas平台accessKeyID
    accessKeySecret: "2018040a545ee4f789c89ce04ee32876", // paas平台accessKeySecret
    domain: "http://10.2.3.56:8360",
  },

  // 不需要验证是否登录的路由配置
  noCheckIsLoginRoutes: [
    "/web/rbac/user/login",
    "/web/visualScreen/screenEditor/getModelList", // 获取大屏模型列表
    "/web/visualScreen/screenEditor/getModelData", // 获取大屏模型数据
    "/web/visualScreen/screen/downloadScreenSource",
    "/web/rbac/user/captcha",
    "/web/rbac/user/registry",
  ],

  proxy: {
    proxyDataHub: {
      targetHost: "http://10.0.3.187:4567", //目标主机(内部封装)
      prefix: "proxyDataHub", //代理前缀
    },
  },
};
