/**
 *
 * Created by chencheng on 2017/8/24.
 */
const Base = require('../base');
const EnumAccessTokenStatus = require('../../../common/constants/app/accessToken').EnumAccessTokenStatus;

module.exports = class extends Base {
    /**
     * 添加AccessToken
     * @returns {*|boolean}
     */
    addAction() {
        this.allowMethods = 'POST';
    }

    /**
     * 添加AccessToken
     * @returns {*|boolean}
     */
    getPageListAction() {
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


    /**
     * 获取单个AccessToken详情
     * @returns {*|boolean}
     */
    getDetailAction() {
        this.allowMethods = 'GET';

        const rules = {
            access_key_id: {
                required: true,
            },
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }

    /**
     * 更新AccessToken
     * @returns {*|boolean}
     */
    updateStatusAction() {
        this.allowMethods = 'PUT';

        const rules = {
            access_key_id: {
                required: true,
            },

            status: {
                aliasName: 'AccessToken类型',
                required: true,
                in: Object.values(EnumAccessTokenStatus)
            },
        };

        const messages = {
            required: "{name}不能为空",
            status:{
                in: "不支持当前AccessToken状态"
            }
        };

        return this.doValidate(rules, messages);
    }


    /**
     * 删除AccessToken
     * @returns {*|boolean}
     */
    deleteAction() {
        this.allowMethods = 'DELETE';

        const rules = {
            access_key_ids: {
                isArray: true,
                required: true,
            },
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }


}
