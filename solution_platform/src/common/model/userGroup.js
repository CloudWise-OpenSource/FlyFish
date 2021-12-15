const baseModel = require('./baseModel');
const EnumDelType = require('../constants/EnumCommon').EnumDelType;

module.exports = class extends baseModel {
    constructor(...args) {
        super(...args);
        this._pk = 'group_id';   // 设置主键字段
        this._soft_del_field = 'deleted_at'
    }

    /**
     * 设置表名
     * @returns {string}
     */
    get tableName () {
        return 'user_group';
    }

    /**
     * 添加额外的schema数据
     * @returns {{createdAt: {default: (function(): number)}, updatedAt: {update: boolean, default: (function(): number)}}}
     */
    get schema() {
        return {
            deleted_at: {
                default: EnumDelType.no
            },
            created_at: {
                default: () => Date.now()
            },
            updated_at: {
                update: true,
                default: () => Date.now()
            }
        }
    }


    /**
     * 添加分组
     *
     * @param {Number} account_id
     * @param {Number} parent_group_id
     * @param {Object} params
     * @param {string} [params.group_id]
     * @param {string} params.group_name
     * @param {string} params.description
     * @returns {Promise.<*>}
     */
    async addGroup(account_id, parent_group_id, params) {
        let {group_id, group_name, description} = params;
        description = description || "";

        return await this.transaction(async () => {
            await this.execute(`SELECT @myLeft := lft FROM ${this.tableName} WHERE account_id = ${account_id} AND group_id = ${parent_group_id}`);
            await this.execute(`UPDATE ${this.tableName} SET rgt = rgt + 2 WHERE account_id = ${account_id} AND rgt > @myLeft;`);
            await this.execute(`UPDATE ${this.tableName} SET lft = lft + 2 WHERE account_id = ${account_id} AND lft > @myLeft; `);
            if(group_id) {
                await this.execute(`INSERT INTO ${this.tableName}(group_id, account_id, group_name, description, parent_group_id, lft, rgt, created_at, updated_at, deleted_at) VALUES(${group_id}, ${account_id}, '${group_name}', '${description}', ${parent_group_id},@myLeft + 1, @myLeft + 2, ${Date.now()}, ${Date.now()}, 1);`);
                return group_id;
            }else{
                await this.execute(`INSERT INTO ${this.tableName}(account_id, group_name, description, parent_group_id, lft, rgt, created_at, updated_at, deleted_at) VALUES(${account_id}, '${group_name}', '${description}', ${parent_group_id},@myLeft + 1, @myLeft + 2, ${Date.now()}, ${Date.now()}, 1);`);
                const result  = await this.query(`SELECT LAST_INSERT_ID() AS last_group_id;`);
                return result[0].last_group_id;
            }
        }).catch(e => {
            this.rollback();
            think.logger.error(e);
            return think.isError(e) ? e : new Error(e);
        })
    }

    /**
     * 获取分组节点
     * @param {Number} account_id
     * @param {Number} group_id
     * @param {Number} parent_group_id
     * @return {Promise<*>}
     */
    async getGroup(account_id, group_id, parent_group_id){
        return await this.query(`SELECT node.group_id, node.group_name, node.parent_group_id, node.lft, node.rgt, node.description FROM ${this.tableName} AS node,${this.tableName} AS parent WHERE node.lft BETWEEN parent.lft AND parent.rgt AND parent.group_id = ${group_id} ORDER BY node.lft desc;`)
            .catch(e => {
                think.logger.error(e);
                return think.isError(e) ? e : new Error(e);
            });
    }

    /**
     * 删除分组节点
     * @param {Number} account_id
     * @param {Number} group_id
     * @return {Promise<T>}
     */
    async delGroup(account_id, group_id, isStartTransaction = true) {
        const doDel = async () => {
            await this.execute(`SELECT @myLeft := lft, @myRight := rgt, @myWidth := rgt - lft + 1 FROM ${this.tableName} WHERE account_id = ${account_id} AND group_id = ${group_id}`);
            await this.execute(`DELETE FROM ${this.tableName} WHERE lft BETWEEN @myLeft AND @myRight`);
            await this.execute(`UPDATE ${this.tableName} SET rgt = rgt - @myWidth WHERE account_id = ${account_id} AND rgt > @myRight;`);
            await this.execute(`UPDATE ${this.tableName} SET lft = lft - @myWidth WHERE account_id = ${account_id} AND lft > @myRight;`);
            return true;
        }

        if (isStartTransaction) {
            return await this.transaction(doDel).catch(e => {
                this.rollback();
                think.logger.error(e);
                return think.isError(e) ? e : new Error(e);
            })
        } else {
            return await doDel();
        }
    }
};
