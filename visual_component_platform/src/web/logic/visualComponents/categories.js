/**
 *
 * Created by chencheng on 2017/8/24.
 */
const Base = require('../base');
const EnumComponentsCategoriesType = require('../../../common/constants/app/visual/EnumVisualComponents').EnumComponentsCategoriesType;

module.exports = class extends Base {
    /**
     * 添加分类
     * @returns {*|boolean}
     */
    addAction() {
        this.allowMethods = 'POST';

        const rules = {
            name: {
                aliasName: '分类名称',
                trim: true,
                required: true,
                length: {max: 64}
            },
        };

        const messages = {
            required: "{name}不能为空",
            type:{
                in: "不支持当前分类类型"
            }
        };

        return this.doValidate(rules, messages);
    }

    /**
     * 添加分类
     * @returns {*|boolean}
     */
    getPageListAction() {
        this.allowMethods = 'GET';

        const rules = {
            page: {
                required: true,
            },

            type: {
                aliasName: '分类类型',
                required: true,
            }
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }


    /**
     * 获取单个分类详情
     * @returns {*|boolean}
     */
    getDetailAction() {
        this.allowMethods = 'GET';

        const rules = {
            categories_id: {
                required: true,
            },
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }

    /**
     * 更新分类
     * @returns {*|boolean}
     */
    updateAction() {
        this.allowMethods = 'PUT';

        const rules = {
            name: {
                aliasName: '分类名称',
                trim: true,
                required: true,
                length: {max: 64}
            },

            categories_id: {
                required: true,
            },

            type: {
                aliasName: '分类类型',
                required: true,
            },
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }


    /**
     * 删除分类
     * @returns {*|boolean}
     */
    deleteAction() {
        this.allowMethods = 'DELETE';

        const rules = {
            categories_ids: {
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
