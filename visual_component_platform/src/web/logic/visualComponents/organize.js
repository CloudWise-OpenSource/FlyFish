/**
 *
 * Created by chencheng on 2017/8/24.
 */
const Base = require('../base');

module.exports = class extends Base {
    /**
     * 添加组织
     * @returns {*|boolean}
     */
    addAction() {
        this.allowMethods = 'POST';
        const nameMaxLength = 64;
        const componentMarkMaxLength = 64;

        const rules = {
            name: {
                aliasName: '组织名称',
                trim: true,
                required: true,
                length: {max: nameMaxLength}
            },
        };

        const messages = {
            required: "{name}不能为空",
            name: {
                length: "组织名称字符数大于" + nameMaxLength,
            },
        };

        return this.doValidate(rules, messages);
    }

    /**
     * 获取组织列表
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
     * 获取单个组织详情
     * @returns {*|boolean}
     */
    getDetailAction() {
        this.allowMethods = 'GET';

        const rules = {
            org_id: {
                required: true,
            },
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }

    /**
     * 更新组织
     * @returns {*|boolean}
     */
    updateAction() {
        this.allowMethods = 'PUT';

        const rules = {
            name: {
                aliasName: '组织名称',
                trim: true,
                required: true,
                length: {max: 64}
            },
            org_id: {
                required: true,
            },
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }


    /**
     * 删除组织
     * @returns {*|boolean}
     */
    deleteAction() {
        this.allowMethods = 'DELETE';

        const rules = {
            org_ids: {
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
