/**
 * Created by chencheng on 2017/8/5.
 */

const Base = require('../base');

module.exports = class extends Base {
    /**
     * 获取操作日志分页列表
     */
    async getPageListAction(){
        this.allowMethods = 'GET';

        const rules = {
            page: {
                required: true,
            },
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }


}
