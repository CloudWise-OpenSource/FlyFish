/**
 *
 * Created by chencheng on 2017/8/24.
 */
const Base = require('../base');

module.exports = class extends Base {

    /**
     * 登录
     * @returns {*|boolean}
     */
    loginAction() {
        this.allowMethods = 'POST';

        const rules = {
            user_email: {
                aliasName: '邮箱',
                trim: true,
                required: true,
                email: true,
            },

            user_password: {
                aliasName: '密码',
                required: true,
            }
        };

        const messages = {
            required: "{name}不能为空",

            user_email: {
                email: "邮箱不是email格式",
            },
        };

        return this.doValidate(rules, messages);
    }

    /**
     * 禁用用户
     * @returns {*|boolean}
     */
     deleteAction() {
        this.allowMethods = 'DELETE';

        const rules = {
            user_id: {
                aliasName: '用户id',
                required: true,
            },
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }

    /**
     * 添加用户
     * @returns {*|boolean}
     */
    addAction() {
        this.allowMethods = 'POST';

        const rules = {
            user_name: {
                aliasName: '用户名称',
                trim: true,
                required: true,
                length: {max: 64}
            },
            user_email: {
                aliasName: '用户邮箱',
                email: true,
                trim: true,
                required: true,
                length: {max: 64}
            },
            user_phone: {
                aliasName: '用户手机号',
                trim: true,
                required: true,
                length: {max: 64}
            },
            user_password: {
                aliasName: '用户密码',
                trim: true,
                required: true,
                length: {max: 64}
            },
        };

        const messages = {
            required: "{name}不能为空",
            type:{
                in: "不支持当前用户类型"
            }
        };

        return this.doValidate(rules, messages);
    }

    /**
     * 添加用户
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
     * 获取单个用户详情
     * @returns {*|boolean}
     */
    getDetailAction() {
        this.allowMethods = 'GET';

        const rules = {
            user_id: {
                required: true,
            },
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }

    /**
     * 更新用户
     * @returns {*|boolean}
     */
    updateAction() {
        this.allowMethods = 'PUT';

        const rules = {
            user_name: {
                aliasName: '用户名称',
                trim: true,
                required: true,
                length: {max: 64}
            },
            user_email: {
                aliasName: '用户邮箱',
                email: true,
                trim: true,
                required: true,
                length: {max: 64}
            },
            user_phone: {
                aliasName: '用户手机号',
                trim: true,
                required: true,
                length: {max: 64}
            },
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }

    /**
     * 重置用户密码
     * @returns {*|boolean}
     */
    resetPasswordAction() {
        this.allowMethods = 'PUT';

        const rules = {
            user_id: {
                aliasName: '用户ID',
                trim: true,
                required: true,
            },
            old_password: {
                aliasName: '老密码',
                trim: true,
                required: true,
            },
            new_password: {
                aliasName: '新密码',
                trim: true,
                required: true,
            }
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }


}
