/**
 *
 * Created by chencheng on 2017/8/24.
 */
const Base = require('../base');

module.exports = class extends Base {
    /**
     * 添加大屏
     * @returns {*|boolean}
     */
    addAction() {
        this.allowMethods = 'POST';
        const nameMaxLength = 64;

        const rules = {
            name: {
                aliasName: '大屏名称',
                trim: true,
                required: true,
                length: {max: nameMaxLength}
            },
        };

        const messages = {
            required: "{name}不能为空",
            name: {
                length: "大屏名称字符数大于" + nameMaxLength,
            },
        };

        return this.doValidate(rules, messages);
    }

    /**
     * 获取大屏列表
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
     * 获取单个大屏详情
     * @returns {*|boolean}
     */
    getDetailAction() {
        this.allowMethods = 'GET';
        const rules = {
            screen_id: {
                required: true,
            },
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }

    /**
     * 更新大屏
     * @returns {*|boolean}
     */
    updateAction() {
        this.allowMethods = 'POST';

        const rules = {
            name: {
                aliasName: '大屏名称',
                trim: true,
                required: true,
                length: {max: 64}
            },
            screen_id: {
                required: true,
            }
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }


    /**
     * 删除大屏
     * @returns {*|boolean}
     */
    deleteAction() {
        this.allowMethods = 'DELETE';

        const rules = {
            screen_ids: {
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
     * 解锁大屏
     * @returns {*|boolean}
     */
    unlockAction() {
        this.allowMethods = 'PUT';

        const rules = {
            screen_id: {
                required: true,
            },
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }

    /**
     * 复制大屏
     * @returns {*|boolean}
     */
    copyAction(){
        this.allowMethods = 'POST';

        const rules = {
            name: {
                aliasName: '大屏名称',
                trim: true,
                required: true,
                length: {max: 64}
            },
            screen_id: {
                required: true,
            }
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }

    /**
     * 获取大屏列表
     * @returns {*|boolean}
     */
    getDelPageListAction() {
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
