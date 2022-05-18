/**
 * Created by Ethan.Du on 21/11/4
 */
'use strict';
const crypto = require('crypto');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const puppeteer = require('puppeteer');
const CODE = require('../lib/error');
const Enum = require('../lib/enum');

module.exports = {
  // yapi default data handler
  handlerYapi({ data, errcode, errmsg }) {
    if (errcode !== CODE.SUCCESS) {
      const errInfo = JSON.stringify({
        code: CODE.INTERNAL_ERR,
        msg: 'yapi server:' + errmsg,
        data: null,
      });
      throw new Error(errInfo);
    }
    return data;
  },

  createUUID() {
    const uuid = _.pad((new Date() - 0).toString(32), 24, 'x');

    const strings = [];
    /* eslint-disable no-bitwise */
    for (let i = 0; i < 24; i += 4) {
      strings.push(uuid.slice(i, i + 4).replace(/[xy]/g, s => {
        const random = Math.random() * 32 | 0;
        const value = s === 'x' ? random : ((random & 3) | 8);

        return value.toString(32);

      }).toUpperCase());

    }
    /* eslint-enable no-bitwise */
    return strings.join('-');
  },

  setCookie(cookieValue) {
    const { ctx, config, logger } = this;

    const opt = {
      domain: config.cookieConfig.domain,
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // Unit : second  default Max-Age is one week
      httpOnly: false,
      secure: false,
      signed: false,
    };

    let cookieValueToSet;
    try {
      cookieValueToSet = (typeof cookieValue === 'string' ? cookieValue : encryption(JSON.stringify(cookieValue), config.cookieConfig.encryptionKey));
    } catch (error) {
      logger.error(`set cookie error: ${error}`);
    }

    return ctx.cookies.set(config.cookieConfig.name, cookieValueToSet, opt);
  },

  getCookie() {
    const { ctx, config, logger } = this;

    const cookieValueToSet = ctx.cookies.get(config.cookieConfig.name, { signed: false });

    let userCookie = {};
    try {
      userCookie = JSON.parse(decryption(config.cookieConfig.encryptionKey, cookieValueToSet));
    } catch (error) {
      logger.error(`get cookie error: ${error}`);
    }

    return {
      userId: _.isNull(userCookie) || _.isUndefined(userCookie.userId) ? null : userCookie.userId,
      username: _.isNull(userCookie) || _.isUndefined(userCookie.username) ? null : userCookie.username,
      role: _.isNull(userCookie) || _.isUndefined(userCookie.role) ? null : userCookie.role,
      phone: _.isNull(userCookie) || _.isUndefined(userCookie.phone) ? null : userCookie.phone,
      email: _.isNull(userCookie) || _.isUndefined(userCookie.email) ? null : userCookie.email,
    };
  },

  clearCookie() {
    const { ctx, config: { cookieConfig: { name }, yapiCookieConfig: { name1, name2 } } } = this;
    ctx.cookies.set(name, null);
    ctx.cookies.set(name1, null);
    ctx.cookies.set(name2, null);

    return;
  },

  async isAdmin() {
    const { ctx } = this;
    const { role } = ctx.userInfo;
    const roleInfo = await ctx.model.Role._findOne({ id: role });

    return roleInfo.name === Enum.ROLE.ADMIN;
  },

  async screenshot(url, savePath, options = {}) {
    const { ctx, logger, config: { docpCookieConfig: { name: docpCookieName, domain: docpCookieDomain }, cookieConfig: { name: cookieName, domain: cookieDomain } } } = this;
    let browser,
      page;

    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '–disable-gpu',
          '–disable-dev-shm-usage',
          '–disable-setuid-sandbox',
          '–no-first-run',
          '–no-zygote',
          '–single-process',
        ],
      });

      page = await browser.newPage();
      const cookieValue = ctx.cookies.get(cookieName, { signed: false });
      const docpCookieValue = ctx.cookies.get(docpCookieName, { signed: false });

      const cookie = {
        path: '/',
        expires: Date.now() + 3600 * 1000,
        maxAge: 1000 * 60 * 60 * 24, // Unit : second  default Max-Age is one week
      };
      if (docpCookieValue) {
        Object.assign(cookie, {
          name: docpCookieName,
          value: docpCookieValue,
          domain: docpCookieDomain,
        });

        const { userid, username } = ctx.headers;
        if (userid && username) await page.setExtraHTTPHeaders({ userid, username });
      } else if (cookieValue) {
        Object.assign(cookie, {
          name: cookieName,
          value: cookieValue,
          url: cookieDomain,
        });
      }

      if (!_.isEmpty(cookie.value)) await page.setCookie(cookie); // 设置cookie
      await page.setViewport({ width: +options.width || 1920, height: +options.height || 1080 });
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

      const fullPagePng = await page.screenshot({ type: 'jpeg', quality: 40, fullPage: true });
      fs.writeFileSync(savePath, fullPagePng);
      await page.close();
      await browser.close();

      page = null; browser = null;
      return 'success';
    } catch (error) {

      if (page) await page.close();
      if (browser) await browser.close();
      page = null; browser = null;

      throw new Error(error);
    }
  },

  /**
   * 复制文件夹并全局替换字符串
   * @param {String} src 原始文件夹
   * @param {String} dest 目标文件夹
   * @param {Array} ignores 需要忽略的文件或文件夹
   * @param {Object} options 替换内容
   * @param {String} options.from 匹配字符串
   * @param {String} options.to 替换字符串
   */
  async copyAndReplace(src, dest, ignores, options) {
    await fsExtra.copy(src, dest, {
      filter: src => {
        const basename = path.basename(src);
        return !ignores.some(item => basename === item);
      },
    });

    await replaceFiles(dest, options);
  },
};

async function replaceFiles(dir, options) {
  const files = await fsExtra.readdir(dir);

  files.forEach(async filename => {
    const thisPath = path.join(dir, filename);
    const imgMatch = /\.(jpe?g|gif|png|ttf|eot|svg|woff(2)?|wav|mp3|mp4)(\?[a-z0-9=&.]+)?$/.test(filename);
    if (imgMatch) return;
    const thisStat = await fsExtra.stat(thisPath);
    const isFile = thisStat.isFile();
    if (isFile) {
      const thisStr = await fsExtra.readFile(thisPath, { encoding: 'utf8' });
      const reg = new RegExp(options.from, 'g');
      const newStr = thisStr.replace(reg, options.to);
      await fsExtra.writeFile(thisPath, newStr, { encoding: 'utf8' });
    } else {
      await replaceFiles(thisPath, options);
    }
  });
}

/**
 * 加密cookie
 * @param {*} data
 * @param {*} encryptionKey
 * @return
 */
function encryption(data, encryptionKey) {
  const alg = 'aes-256-cbc';
  const iv = 'cxZhhYhet2X4OOMq'; // 某些加密算法需要最小长度，当data不足最小长度时的补充字符串
  const clearEncoding = 'utf8';
  const cipherEncoding = 'base64';
  const cipherChunks = [];
  const cipher = crypto.createCipheriv(alg, encryptionKey, iv);
  cipher.setAutoPadding(true);

  cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
  cipherChunks.push(cipher.final(cipherEncoding));

  return cipherChunks.join('');
}

/**
 * 解密cookie
 * @param {*} encryptionKey
 * @param {*} data
 * @return
 */
function decryption(encryptionKey, data) {
  const alg = 'aes-256-cbc';
  const iv = 'cxZhhYhet2X4OOMq';
  const clearEncoding = 'utf8';
  const cipherEncoding = 'base64';
  const cipherChunks = [];
  const decipher = crypto.createDecipheriv(alg, encryptionKey, iv);
  decipher.setAutoPadding(true);

  cipherChunks.push(decipher.update(data, cipherEncoding, clearEncoding));
  cipherChunks.push(decipher.final(clearEncoding));

  return cipherChunks.join('');
}
