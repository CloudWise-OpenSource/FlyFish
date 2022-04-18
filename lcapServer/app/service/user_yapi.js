'use strict';
const Service = require('egg').Service;
const DEFAULT_PASSWORD = '123456';
const Enum = require('../lib/enum');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

class UserDoucService extends Service {
  async syncUser(userInfo) {
    const { ctx, logger, config: { services: { yapi: { baseURL, tokenEncryptionKey } } } } = this;
    const { username, email, role } = userInfo;
    let yapiUser;
    try {
      const { data: existsYapiUserInfo } = await ctx.http.get(baseURL + `/api/user/find_by_username?username=${username}`);
      yapiUser = existsYapiUserInfo;

      const roleInfo = await ctx.model.Role._findOne({ id: role }) || {};
      const curUserRole = (roleInfo.name === Enum.ROLE.ADMIN) ? 'admin' : 'member';

      if (_.isEmpty(existsYapiUserInfo)) {
        const createData = {
          username,
          email: email || `${username}@cloudwise.com`,
          password: DEFAULT_PASSWORD,
          isAdmin: curUserRole === 'admin',
        };
        const yapiUserInfo = await ctx.http.post(baseURL + '/api/user/reg', createData).then(ctx.helper.handlerYapi);
        yapiUser = yapiUserInfo;
      } else {
        // 更新role
        if (yapiUser.role !== curUserRole) {
          try {
            const payLoad = {
              username: userInfo.username,
            };
            const authorizationToken = jwt.sign(payLoad, tokenEncryptionKey, { expiresIn: '1h' });
            // 同步yapi
            await ctx.http.post(
              `${baseURL}/api/user/change_role`,
              {
                authorizationToken,
                uid: yapiUser.uid,
                role: curUserRole,
              }
            );
          } catch (error) {
            logger.error(`${yapiUser.id} info update error: ${JSON.stringify(error)}`);
          }
        }
      }
      logger.info('yapi user login success: ' + username);
    } catch (error) {
      logger.error('yapi user login success: ' + username);
    }

    return yapiUser;
  }
}
module.exports = UserDoucService;
