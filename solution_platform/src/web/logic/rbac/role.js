/**
 * Created by chencheng on 2017/8/5.
 */

const Base = require('../base');

module.exports = class extends Base {
    /**
     * 添加角色
     */
    addAction() {
        this.allowMethods = 'POST';
        const rules = {
            role_name: {
                aliasName: '角色名称',
                trim: true,
                required: true,
            },
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }

    /**
     * 获取角色分页列表
     */
    getPageListAction(){
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
     * 获取单个角色详情
     */
    getDetailAction() {
        this.allowMethods = 'GET';

        const rules = {
            role_id: {
                required: true,
            },
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }

    /**
     * 更新角色
     */
    async updateAction() {
        this.allowMethods = 'PUT';

        const rules = {
            role_name: {
                aliasName: '角色名称',
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
     * 删除角色
     */
    async deleteAction() {
        this.allowMethods = 'DELETE';

        const rules = {
            role_ids: {
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
     * 获取角色下的用户
     */
    async getUserByRoleAction() {
        this.allowMethods = 'GET';
    }

    /**
     * 更新角色成员
     */
    async updateRoleMemberAction() {
        this.allowMethods = 'PUT';

        const rules = {
            role_id: {
                required: true,
            },
            addUsers: {
                isArray: true,
            },
            delUsers: {
                isArray: true,
            },
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }

}
