/**
 *
 * Created by chencheng on 2017/8/24.
 */
const Base = require('../base');

module.exports = class extends Base {
    /**
     * 初始化组件开发空间
     * @returns {*|boolean}
     */
    initDevWorkspaceAction() {
        this.allowMethods = 'POST';

        const rules = {
            component_id: {
                aliasName: '组件ID',
                required: true,
            }
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }

    /**
     * 读取开发组件文件内容
     * @returns {*|boolean}
     */
    readDevFileAction() {
        this.allowMethods = 'GET';

        const rules = {
            component_id: {
                aliasName: '组件ID',
                required: true,
            },

            filePath: {
                aliasName: '文件名称',
                required: true,
            }
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }


    /**
     * 保存开发组件文件内容
     * @returns {*|boolean}
     */
    saveDevFileContentAction() {
        this.allowMethods = 'PUT';

        const rules = {
            component_id: {
                aliasName: '组件ID',
                required: true,
            },
            filePath: {
                aliasName: '文件名称',
                required: true,
            }
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }

    /**
     * 保存开发组件文件内容
     * @returns {*|boolean}
     */
    npmDevComponentAction() {
        this.allowMethods = 'POST';

        const rules = {
            component_id: {
                aliasName: '组件ID',
                required: true,
            }
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }

    /**
     * 编译开发组件文件内容
     * @returns {*|boolean}
     */
    compileDevComponentAction() {
        this.allowMethods = 'PUT';

        const rules = {
            component_id: {
                aliasName: '组件ID',
                required: true,
            }
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
    addDevFileOrDir() {
        this.allowMethods = 'POST';

        const rules = {
            component_id: {
                aliasName: '组件ID',
                required: true,
            },
            filePath: {
                aliasName: '父路径',
                required: true,
            },
            type: {
                aliasName: '文件类型',
                required: true,
            },
            name: {
                aliasName: '文件名称',
                required: true,
            },
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }


    /**
     * 更新开发组件文件或目录
     * @returns {*|boolean}
     */
    updateDevFileOrDirAction() {
        this.allowMethods = 'PUT';

        const rules = {
            component_id: {
                aliasName: '组件ID',
                required: true,
            },
            filePath: {
                aliasName: '当前文件名称',
                required: true,
            },
            name: {
                aliasName: '文件名称',
                required: true,
            },
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }

    /**
     * 删除开发组件文件或目录
     * @returns {*|boolean}
     */
    delDevFileOrDirAction() {
        this.allowMethods = 'DELETE';

        const rules = {
            component_id: {
                aliasName: '组件ID',
                required: true,
            },
            filePath: {
                aliasName: '当前文件名称',
                required: true,
            }
        };

        const messages = {
            required: "{name}不能为空",
        };

        return this.doValidate(rules, messages);
    }

}
