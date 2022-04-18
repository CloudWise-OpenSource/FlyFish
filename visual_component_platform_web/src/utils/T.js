/**
 * Created by chencheng on 2017/6/15.
 */
import lodash from 'lodash';
import cookies from 'js-cookie';
import onfire from 'onfire.js';
import queryString from 'query-string';
import helper from './core/helper';
import prompt from './core/prompt';
import Socket from './core/Socket';
import auth from './core/auth';
import { contextTypes, propTypes } from './core/decorator';

import { get, post, postJSON, upload, all, del, put, form, formatUrlParams, withAppId, download } from './core/request';
import { setStorage, getStorage, clearStorage, keepStorage, removeStorage } from './core/storage';


/**
 *
 * @type {{prompt: Prompt, Socket: Socket, apexSocket: Socket, helper: Helper, auth: Auth, decorator: {contextTypes: contextTypes, propTypes: propTypes}, request: {get: get, post: post, postJSON: postJSON, upload: upload, all: all, del: del, put: put, form: form, formatUrlParams: formatUrlParams, withAppId: withAppId}, storage: {setStorage: setStorage, getStorage: getStorage, clearStorage: clearStorage, keepStorage: keepStorage, removeStorage: removeStorage}, lodash, cookies: *, queryString, onfire: *}}
 */
const T = {
    prompt,

    Socket,

    helper,

    auth,

    decorator: { contextTypes, propTypes },

    request: { get, post, postJSON, upload, all, del, put, form, download, formatUrlParams, withAppId },

    storage: { setStorage, getStorage, clearStorage, keepStorage, removeStorage },

    // 说明文档:http://www.css88.com/doc/lodash/
    lodash: lodash,

    // 说明文档:https://github.com/js-cookie/js-cookie
    cookies: cookies,

    // 说明文档:https://github.com/sindresorhus/query-string
    queryString: queryString,

    // 说明文档: https://github.com/hustcc/onfire.js/blob/master/README_zh.md
    onfire: onfire,

};

export default T;

