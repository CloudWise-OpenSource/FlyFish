/**
 * Created by chencheng on 2017/8/5.
 */

const Base = require('../base');

module.exports = class extends Base {
    /**
     * 添加分组
     */
    addAction() {
        this.allowMethods = 'POST';
        const rules = {
            group_name: {
                aliasName: '分组名称',
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
     * 获取分组分页列表
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
     * 获取单个分组详情
     */
    getDetailAction() {
        this.allowMethods = 'GET';

        const rules = {
            group_id: {
                required: true,
            },
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }

    /**
     * 更新分组
     */
    async updateAction() {
        this.allowMethods = 'PUT';

        const rules = {
            group_name: {
                aliasName: '分组名称',
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
     * 删除分组
     */
    async deleteAction() {
        this.allowMethods = 'DELETE';

        const rules = {
            group_id: {
                required: true,
            },
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }

    /**
     * 获取分组下的用户
     */
    async getUserByGroupAction() {
        this.allowMethods = 'GET';
    }

    /**
     * 更新分组成员
     */
    async updateGroupMemberAction() {
        this.allowMethods = 'PUT';

        const rules = {
            group_id: {
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
