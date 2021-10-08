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
        const nameMaxLength = 64;
        const componentMarkMaxLength = 64;

        const rules = {
            name: {
                aliasName: '组件名称',
                trim: true,
                required: true,
                length: {max: nameMaxLength}
            },

            component_mark: {
                aliasName: '组件标识',
                trim: true,
                required: true,
                length: {max: 64}
            },

            // categories_id: {
            //     aliasName: '组件分类',
            //     required: true,
            // },
        };

        const messages = {
            required: "{name}不能为空",
            name: {
                length: "组件名称字符数大于" + nameMaxLength,
            },
            component_mark: {
                length: "组件标识字符数大于" + componentMarkMaxLength,
            },
            type:{
                in: "不支持当前组件类型"
            }
        };

        return this.doValidate(rules, messages);
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
        this.allowMethods = 'PUT';

        const rules = {
            name: {
                aliasName: '组件名称',
                trim: true,
                required: true,
                length: {max: 64}
            },
            component_id: {
                required: true,
            },
            // categories_id: {
            //     aliasName: '组件分类',
            //     required: true,
            // },
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }

    /**
     * 组件上下架
     * @returns {object}
     */
     shelfAction() {
        this.allowMethods = 'PUT';

        const rules = {
            component_id: {
                required: true,
            },
            shelf_status: {
                aliasName: '上下架状态',
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

    /**
     * 组件下载
     * @returns {*|boolean}
     */
    downloadAction() {
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
     * 组件源代码下载
     * @returns {*|boolean}
     */
    downloadComponentCodeAction() {
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

}
