/**
 * Created by chencheng on 2017/6/16.
 */
import moment from 'moment';
import _ from 'lodash';
import { render as reactDomRender, unmountComponentAtNode } from 'react-dom';

class Helper {

    /**
	 * 渲染弹出窗Modal
     * @param component //reactElement react组件
     */
	renderModal(component) {
		const domId = 'tj-render-dom';

        let domObject = document.querySelector('#' + domId);
        if(!domObject){
            const el = document.createElement('div');
            el.setAttribute('id', domId);
            document.querySelector('body').appendChild(el);
            domObject = el;
        }

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
	 * @param url
	 * @param timeout
	 */
	redirect(url, timeout) {
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
	 * 浮点型保留小数
     * @param {Number} num
     * @param {Number} fixNum
     * @param {Mixed} defaultVal 格式化错误的默认值
     * @return {string}
     */
	toFixed(num, fixNum = 2, defaultVal = '-') {
		let result =  Number(num).toFixed(fixNum);
		return _.isNaN(result) || result === 'NaN' ? defaultVal : result;
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
     * @param {Number} fixNum	保留小数的位数
     * @param {Mixed} defaultVal	格式化错误的默认值
     * @return {*}
     * @constructor
     */
	MbToGb(value, fixNum = 2, defaultVal = '-') {
		let result = value / 1024;
		return fixNum ? (_.isNaN(result) || result === 'NaN' ? defaultVal : result) : this.toFixed(result, fixNum, defaultVal);
	}


    /**
     * 时间格式化
     * @param {Date|number|Moment} date
     * @param {string} template
     * @return {string}
     */
    dateFormat(date = _.now(), template = 'YYYY-MM-DD HH:mm:ss') {
        if (this.isRealNumeric(date)) {
            date = parseInt(date);
        }

        return moment(date).format(template);
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
     * 生成class
     * @param {...*=} args
     */
    classNames(...args) {

		const classList = [];

		_.each(args, (arg) => {

			if (_.isString(arg)) {

				classList.push(arg);

			} else if (_.isObject(arg)) {

				_.each(arg, (value, key) => {
					if (value) {
						classList.push(key);
					}
				});
			}
		});

		return _.uniq(classList).join(' ');
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

		/* eslint-disable no-param-reassign */

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

			/* eslint-disable no-restricted-properties */
			decimalComponent = Math.abs((absNumber - strinteger) + (Math.pow(10, -Math.max(decimals, origDec) - 1)));
			/* eslint-enable no-restricted-properties */

			ret += decimalPoint + decimalComponent.toFixed(decimals).slice(2);
		}

		/* eslint-enable no-param-reassign */
		return ret;
	}

}

export default new Helper();

