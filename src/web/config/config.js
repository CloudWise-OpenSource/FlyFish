module.exports = {
    // platform 静态资源前缀
    platformPrefix: '/',
    indexTitle: '',

    // paas API conf
    paasAPIConf: {
        accessKeyID: "a04d0daa30fbad5191d794f527084446",            // paas平台accessKeyID
        accessKeySecret: "6788991a041734cb794e934f470650f4",        // paas平台accessKeySecret
        // domain: "http://10.2.2.236:8360",
    },

    // 不需要验证是否登录的路由配置
    noCheckIsLoginRoutes: [
        '/web/rbac/user/login',
        '/web/components/devComponentIO/compileDevComponent',
        '/web/visualScreen/screenEditor/getModelList',  // 获取大屏模型列表
        '/web/visualScreen/screenEditor/getModelData',  // 获取大屏模型数据
        "/web/visualScreen/screen/downloadScreenSource",
        "/web/rbac/user/captcha",
        "/web/rbac/user/registry",
    ],

    authToken: {
        private: 'nyDAu_3xGrhoJT23HefA', // 私用authtoken
        public: 'Y2xvdWR3aXNlLWxvd2NvZGU=', // 对公authtoken
    },

    defaultAccountId: 1, // 默认accountid


    proxy: {
        proxyDataHub: {
            targetHost: "http://10.0.3.187:4567",        //目标主机(内部封装)
            prefix: 'proxyDataHub',                          //代理前缀
        },
    }
};
