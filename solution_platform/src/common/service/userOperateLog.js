/**
 * Created by chencheng on 2017/8/24.
 */
const EnumOperateLogType = require('../constants/app/system/operateLog').EnumOperateLogType;

/**
 * 格式化过滤条件
 * @param search
 * @param {Number} search.user_id
 * @param {Number} search.log_type
 * @param {String} search.keyword
 * @param {String} search.startTime
 * @param {String} search.endTime
 * @returns {*}
 */
const formatSearchParams = (search) => {
    search = think.isEmpty(search) ? {} : JSON.parse(search);
    let newSearch = {};
    if (search.hasOwnProperty('keyword') && !think.isEmpty(search.keyword)) newSearch.content = ['like','%' + search.keyword + '%'];
    if (!think.isEmpty(search.user_id) && search.user_id != EnumOperateLogType.all) newSearch.user_id = search.user_id;
    if (!think.isEmpty(search.log_type) && search.log_type != EnumOperateLogType.all) newSearch.log_type = search.log_type;
    if (!think.isEmpty(search.startTime) && !think.isEmpty(search.endTime)) newSearch.created_at = ['BETWEEN', parseInt(search.startTime), parseInt(search.endTime)];

    return newSearch;
};


module.exports = class extends think.Service{
	constructor(db){
		super();
		// 用户操作日志model实例
		this.modelOperateLogIns = db ? think.model('userOperateLog').db(db) : think.model('userOperateLog');
	}

    /**
     * 添加
     * @param account_id
     * @param user_id
     * @param log_type
     * @param content
     * @return {Promise<*>}
     */
	async addLog(account_id, user_id, log_type, content = null) {
        content = think.isEmpty(content) ? "" : content;

        return await this.modelOperateLogIns.add({account_id, user_id, log_type, content}).catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
	}

    /**
     * 获取操作日志分页列表
     * @param {Number} account_id
     * @param {Number} page         // 当前分页数
     * @param {Number} pageSize     // 每页显示的数量
     * @param {Object} search       // 搜索条件
     * @param {Array} [fields]
     * @returns {Promise<void>}
     */
	async getLogPageList(account_id, page, pageSize = 15, search = {}, fields = "*"){
        const where = Object.assign({account_id}, formatSearchParams(search));
        fields = Array.isArray(fields) ? fields.join(',') : fields;

        return await this.modelOperateLogIns.where(where).page(page, pageSize).field(fields).countSelect().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err);
        });
    }

}
