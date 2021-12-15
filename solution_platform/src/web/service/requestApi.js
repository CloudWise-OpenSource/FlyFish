const Client = require('node-client-sdk');

/**
 * 处理paas响应
 * @param resp
 * @return {Error}
 */
const handlePaasResp = (resp) => resp.code === 0 ? resp.data : new Error(resp.msg);

/**
 * 枚举uri
 * @type {{uploadStaticSourceFile: string, queryModelData: string}}
 */
const EnumUri = {
    getModelList: '/openAPI/visualScreenEditor/getModelList',       // 获取模型列表
    queryModelData: '/openAPI/visualScreenEditor/getModelData',     // 查询模型数据
};


module.exports = class extends think.Service{
    constructor(){
        super();
        const { accessKeyID, accessKeySecret, domain } = think.config('paasAPIConf', undefined, 'web');

        // http client instance
        this.client = new Client({
            accessKeyID,            // paas平台accessKeyID
            accessKeySecret,        // paas平台accessKeySecret
            domain,
        });
    }

    /**
     * 获取模型列表
     * @returns {Promise<*>}
     */
    async getModelList(){
        return await this.client.get(EnumUri.getModelList)
            .then(resp => handlePaasResp(resp))
            .catch(err => think.isError(err) ? err : new Error(err));
    }

    /**
     * 查询模型数据
     * @param modelConf
     * @return {*}
     */
    async queryModelData(modelConf) {
        return await this.client.postJson(EnumUri.queryModelData, modelConf)
            .then(resp => handlePaasResp(resp))
            .catch(err => think.isError(err) ? err : new Error(err));
    }
}


