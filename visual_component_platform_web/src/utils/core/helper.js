/**
 * Created by chencheng on 2017/6/16.
 */
import moment from 'moment';
import _ from 'lodash';
import {render as reactDomRender, unmountComponentAtNode} from 'react-dom';

class Helper {

    /**
     * 渲染弹出窗Modal
     * @param component //reactElement react组件
     */
    renderModal(component) {
        const domId = 'tj-render-dom';
        if ($('#' + domId).length < 1) {
            $('<div />', {
                id: domId,
            }).appendTo('body');
        }

        const domObject = document.querySelector('#' + domId);

        unmountComponentAtNode(domObject);

        reactDomRender(component, domObject);
    }

    /**
     * 模拟request api数据
     * @param data
     * @param type "success" | "error"
     * @param time 延迟时间
     * @return {Promise<any>}
     */
    simulateData(data, type = 'success', time = 500) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (type == 'success') {
                    resolve({ code: window.ENV.apiSuccessCode, data, msg: "success" })
                }else {
                    reject({code: "error", data, msg: 'error'})
                }
            }, time);
        })
    }

    /**
     * 跳转页面
     * @param {String} url
     * @param {Mixed} timeout
     */
    redirect(url, timeout = 0) {
        if (_.isNumber(url) && typeof timeout === 'undefined') {
            timeout = url;
            url = null;
        }

        setTimeout(function () {
            location.href = url || location.href;
        }, timeout || 0);
    }

    /**
     * 获取包“immutability-helper”中的update内容
     * @param {String | Array}  keyPath "str1.str2..." //依点分割key 或 [key1,key2]
     * @param {Mixed} value
     * @param {String} updateType //可填写类型：$set,$push,$unshift,$splice,$unset,$merge,$apply
     * @return {{}}
     */
    getImmutabilityHelperContent(keyPath, value, updateType = '$set') {
        let keyArr = Array.isArray(keyPath) ? keyPath : keyPath.split('.');
        let keyLen = keyArr.length;
        let result = {};

        /* eslint no-eval:0 */
        /* eslint no-return-assign:0 */
        const getTmpRes = (keys, val = null) => {
            let res = 'result';
            keys.forEach(key => res += "['" + key + "']");
            res += '={}';
            eval(res);
            return eval(res.replace('={}', ''));
        };


        let usedKeys = [];
        keyArr.forEach((key, index) => {
            const currentLen = index + 1;
            usedKeys.push(key);

            if (currentLen === keyLen) {
                getTmpRes(usedKeys)[updateType] = value;
            } else {
                getTmpRes(usedKeys);
            }
        });

        return result;
    }

    /**
     * 将对象值中的唯一值字段作为key组成mapping
     * @param enumInfo
     * @param uniqueField
     * @returns {{}}
     *
     * usage:
     * enumInfo = {
     *     xx: {
     *          type: 1,
     *          ...
     *     }
     * }
     */
    unqiueTypeToInfoMap(enumInfo = {}, uniqueField = 'value') {
        let typeToInfoMap = {};
        Object.values(enumInfo).forEach(item => typeToInfoMap[item[uniqueField]] = item);
        return typeToInfoMap;
    }

    /**
     * 当值为undefined || null时返回'-',否则返回本身
     * @param {Mixed} defaultValue
     * @return {function(*=)}
     */
    identityVal(defaultValue = '-') {

        return (value) => {
            try {
                return _.isUndefined(value) || _.isNull(value) ? defaultValue : value;
            } catch (e) {
                return defaultValue;
            }
        };
    }

    /**
     * 浮点型保留小数
     * @param {Number} num
     * @param {Number} fixNum
     * @param {Mixed} defaultVal 格式化错误的默认值
     * @return {string}
     */
    toFixed(num, fixNum = 2, defaultVal = '-') {
        if (!this.isFloat(num)) return num;
        const result = Number(num).toFixed(fixNum);
        return _.isNaN(result) || result === 'NaN' ? defaultVal : result;
    }

    /**
     * 验证是否为浮点型
     * @param {Mixed} theFloat
     * @return {boolean}
     */
    isFloat(theFloat) {
        if (_.isNumber(theFloat)) theFloat = theFloat.toString();
        let len = theFloat.length;
        let dotNum = 0;

        if (len === 0) return false;

        for (let i = 0; i < len; i++) {
            let oneNum = theFloat.substring(i, i + 1);
            if (oneNum === '.') dotNum++;
            if ((oneNum < '0' || oneNum > '9') && oneNum !== '.') return false;
        }

        if (len > 1 && theFloat.substring(0, 1) === '0') {
            if (theFloat.substring(1, 2) !== '.') return false;
        }

        if (dotNum === 0 || dotNum > 1) return false;

        return true;
    }

    /**
     * 是否是一个真实的数值字符串
     * @param value
     */
    isRealNumeric(value) {
        return /^(\d+\.)?\d+$/.test(value);
    }

    /**
     * Mb转换成Gb
     * @param {Number} value
     * @param {Number} fixNum    保留小数的位数
     * @param {Mixed} defaultVal    格式化错误的默认值
     * @return {*}
     * @constructor
     */
    MbToGb(value, fixNum = 2, defaultVal = '-') {
        let result = value / 1024;
        return _.isNaN(result) || result === 'NaN' ? defaultVal : this.toFixed(result, fixNum, defaultVal);
    }

    /**
     * Kb转换成Mb
     * @param {Number} value
     * @param {Number} fixNum    保留小数的位数
     * @param {Mixed} defaultVal    格式化错误的默认值
     * @return {*}
     * @constructor
     */
    KbToGb(value, fixNum = 2, defaultVal = '-') {
        let result = value / 1024;
        return _.isNaN(result) || result === 'NaN' ? defaultVal : this.toFixed(result, fixNum, defaultVal);
    }

    /**
     * byte转换成 kb
     * @param {Number} value
     * @param {Number} fixNum    保留小数的位数
     * @param {Mixed} defaultVal    格式化错误的默认值
     * @return {*}
     * @constructor
     */
    byteToKb(value, fixNum = 2, defaultVal = '-') {
        let result = value / 1024;
        return _.isNaN(result) || result === 'NaN' ? defaultVal : this.toFixed(result, fixNum, defaultVal);
    }

    /**
     * 时间格式化
     * @param {Date|number|Moment} date
     * @param {string} template
     * @return {string}
     */
    dateFormat(date = _.now(), template = 'YYYY-MM-DD HH:mm:ss') {
        try {
            if (this.isRealNumeric(date)) {
                date = parseInt(date);
            }

            return moment(date).format(template);
        } catch (e) {
            return '-';
        }
    }

    /**
     * 回调一个函数,并应用context和一个参数数组
     * @param {function} func 函数
     * @param {?*=} context
     * @param {Array=} args
     * @return {*}
     */
    apply(func, context, args = []) {
        if (_.isFunction(func)) {
            return func.apply(context, args);
        }

        return null;
    }

    /**
     * 回调一个函数,并应用context和一个参数列表
     * @param {function} func 函数
     * @param {?*=} context
     * @param {...*} args
     * @return {*}
     */
    call(func, context, ...args) {
        return this.apply(func, context, args);
    }

    /**
     * 获取queryString
     *
     * @returns {Object}
     */
    getUrlParams() {
        let urlParams = {};
        const queryString = decodeURIComponent(window.location.search.substr(1));
        if (queryString) {
            _.each(queryString.split('&'), (paramString) => {
                const param = paramString.split('=');
                urlParams[param[0]] = param[1];
            });
        }

        return urlParams;
    }

    /**
     * 获取URL参数
     *
     * @param {string} name
     * @returns {string}
     */
    getUrlParam(name) {
        return this.getUrlParams()[name];
    }

    /**
     * 省去对象的字段
     * @param {Object} obj
     * @param {Array} fields 排除的字段
     * @return {{}}
     */
    omit(obj, fields = []) {
        const shallowCopy = {
            ...obj,
        };
        for (let i = 0; i < fields.length; i++) {
            const key = fields[i];
            delete shallowCopy[key];
        }
        return shallowCopy;
    }


    /**
     * 数字格式化
     * @param {number} number
     * @param {number=} decimals
     * @param {string=} decimalPoint
     * @param {string=} thousandsSep
     * @return {string}
     */
    numberFormat(number, decimals = 0, decimalPoint = '.', thousandsSep = ',') {

        number = _.toNumber(number);
        decimals = _.clamp(decimals, 0, 10);

        const origDec = (number.toString().split('.')[1] || '').length;
        const absNumber = Math.abs(number);

        let decimalComponent;
        let ret;

        if (decimals === -1) {

            decimals = Math.min(origDec, 20);

        } else if (!_.isNumber(decimals)) {

            decimals = 2;
        }

        const strinteger = String(parseInt(absNumber.toFixed(decimals), 10));

        // 需要几个千分位分隔符
        const thousands = strinteger.length > 3 ? strinteger.length % 3 : 0;

        // 负数
        ret = number < 0 ? '-' : '';

        ret += thousands ? strinteger.substr(0, thousands) + thousandsSep : '';

        // 在千分位加上分隔符
        ret += strinteger.substr(thousands).replace(/(\d{3})(?=\d)/g, `$1${thousandsSep}`);

        // 小数点
        if (decimals) {

            decimalComponent = Math.abs((absNumber - strinteger) + (Math.pow(10, -Math.max(decimals, origDec) - 1)));

            ret += decimalPoint + decimalComponent.toFixed(decimals).slice(2);
        }

        return ret;
    }

    /**
     * 生成uuid
     * @param {Number} len
     * @returns {string}
     */
    uuid(len = 16) {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        let uuid = [];
        let i;
        let radix = chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            // rfc4122, version 4 form
            let r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data. At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }

        return uuid.join('');
    }

    /**
     * antd组件的排序函数
     * @param nowObject  当前的对象
     * @param nextObject 下一个对象
     * @param sortProperty 排序的字段
     * @returns {number}
     */
    sortFunction(nowObject, nextObject, sortProperty) {
        return nowObject[sortProperty] > nextObject[sortProperty]
            ? 1
            : nowObject[sortProperty] === nextObject[sortProperty]
                ? 0
                : -1;
    }

    /**
     * 将字节根据大小自动转换成适应的单位大小
     * @param size 字节大小
     * @param w 保留小数位数
     * @returns {string}
     */
    autoToSize(size, w = 0) {
        // 以b字节输出
        if (size < Math.pow(1024, 1)) {
            return size + ' B';
        }
        // 以kb输出
        if (size < Math.pow(1024, 2)) {
            return (size / Math.pow(1024, 1)).toFixed(w) + ' KB';
        }
        // 以mb输出
        if (size < Math.pow(1024, 3)) {
            return (size / Math.pow(1024, 2)).toFixed(w) + ' MB';
        }
        // 以gb输出
        if (size < Math.pow(1024, 4)) {
            return (size / Math.pow(1024, 3)).toFixed(w) + ' GB';
        }
        // 以tb输出
        if (size < Math.pow(1024, 5)) {
            return (size / Math.pow(1024, 4)).toFixed(w) + ' GB';
        }
    }

}

const helper = new Helper();

export default helper;

