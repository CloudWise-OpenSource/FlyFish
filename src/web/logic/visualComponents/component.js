/**
 *
 * Created by chencheng on 2017/8/24.
 */
const Base = require('../base');

module.exports = class extends Base {
    /**
     * 添加组件
     * @returns {*|boolean}
     */
    addAction() {
        this.allowMethods = 'POST';
    }

    /**
     * 上传组件封面
     * @returns {*|boolean}
     */
    updateComponentCoverAction() {
        this.allowMethods = 'POST';
    }

    /**
     * 获取组件列表
     * @returns {*|boolean}
     */
    getPageListAction() {
        this.allowMethods = 'GET';

        const rules = {
            page: {
                required: true,
            },

            type: {
                aliasName: '组件类型',
                required: true,
            }
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }


    /**
     * 获取单个组件详情
     * @returns {*|boolean}
     */
    getDetailAction() {
        this.allowMethods = 'GET';

        const rules = {
            component_id: {
                required: true,
            },
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }

    /**
     * 更新组件
     * @returns {*|boolean}
     */
    updateAction() {
        this.allowMethods = 'POST';

        const rules = {
            component_id: {
                required: true,
            },
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }


    /**
     * 删除组件
     * @returns {*|boolean}
     */
    deleteAction() {
        this.allowMethods = 'DELETE';

        const rules = {
            component_ids: {
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
