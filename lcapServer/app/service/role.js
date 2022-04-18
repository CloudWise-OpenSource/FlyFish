'use strict';
const Service = require('egg').Service;
const Enum = require('../lib/enum');

const _ = require('lodash');
class RoleService extends Service {
  async add(createRoleInfo) {
    const { ctx } = this;

    const returnData = { msg: 'ok', data: {} };
    const existsRoles = await ctx.model.Role._findOne({ name: createRoleInfo.name, status: Enum.COMMON_STATUS.VALID });
    if (!_.isEmpty(existsRoles)) {
      returnData.msg = 'Exists Already';
      return returnData;
    }

    await ctx.model.Role._create(createRoleInfo);
    const result = await ctx.model.Role._findOne({ name: createRoleInfo.name });
    returnData.data = result;

    return returnData;
  }

  async updateBasicInfo(id, updateInfo) {
    const { ctx } = this;
    await ctx.model.Role._updateOne({ id }, updateInfo);
  }

  async updateMembersInfo(id, updateInfo) {
    const { ctx } = this;

    const memberIds = _.uniq(updateInfo.members || []);
    const curRoleMembers = await ctx.model.User._find({ role: id });
    const curRoleMemberIds = (curRoleMembers || []).map(e => e.id);


    const enableMemberIds = _.difference(_.union(memberIds), _.union(curRoleMemberIds));
    const disableMemberIds = _.difference(_.union(curRoleMemberIds), _.union(memberIds));

    await ctx.model.User._updateMany({ id: { $in: enableMemberIds } }, { role: id });
    await ctx.model.User._updateMany({ id: { $in: disableMemberIds } }, { role: null });

    await ctx.model.Role._updateOne({ id }, { updateTime: Date.now() });
  }

  async updateAuthInfo(id, updateInfo) {
    const { ctx } = this;

    await ctx.model.Role._updateOne({ id }, updateInfo);
  }

  async delete(id) {
    const { ctx } = this;

    const returnData = { msg: 'ok' };
    const curRoleUsers = await ctx.model.User._findOne({ role: id, status: Enum.COMMON_STATUS.VALID });
    if (!_.isEmpty(curRoleUsers)) {
      returnData.msg = 'Exists Already';
      return returnData;
    }

    const result = await ctx.model.Role._findOne({ id });
    if (!_.isEmpty(result) && [ Enum.ROLE.ADMIN, Enum.ROLE.MEMBER ].includes(result.name)) {
      returnData.msg = 'Can Not Delete';
      return returnData;
    }

    await ctx.model.Role._updateOne({ id }, { status: Enum.COMMON_STATUS.INVALID });
    return returnData;
  }

  async getRoleList(requestData) {
    const { ctx } = this;

    const queryCond = {
      status: Enum.COMMON_STATUS.VALID,
    };
    if (requestData.id) queryCond.id = requestData.id;
    if (requestData.name) queryCond.name = { $regex: _.escapeRegExp(requestData.name) };

    const total = await ctx.model.Role._count(queryCond);
    const data = await ctx.model.Role._find(queryCond, null, { sort: '-update_time', skip: requestData.curPage * requestData.pageSize, limit: requestData.pageSize });

    return { total, data };
  }

  async getAll() {
    const { ctx } = this;

    const queryCond = {
      status: Enum.COMMON_STATUS.VALID,
    };

    return await ctx.model.Role._find(queryCond, [ 'name' ], { sort: '-update_time' });
  }

  async getRoleInfo(id) {
    const { ctx } = this;

    const roleInfo = await ctx.model.Role._findOne({ _id: id });
    const members = await ctx.model.User._find({ role: id, status: Enum.COMMON_STATUS.VALID });

    roleInfo.members = (members || []).map(member => {
      return {
        id: member.id,
        username: member.username,
        email: member.email,
        phone: member.phone,
      };
    });

    return roleInfo;
  }
}

module.exports = RoleService;
