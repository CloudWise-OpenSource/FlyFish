/**
 * Created by john on 2018/1/23.
 */
import {
    submit
} from '../../webAPI/pluginUpload'

/**
 * 上传插件
 * @param {Object} plugin 上传的文件
 * @param {String} pluginName
 * @param {String} pluginDescribe
 * @param {function} progressCallback 上传文件进度的回调
 */
export const doSubmit = (plugin, pluginName, pluginDescribe, progressCallback) => submit(plugin, pluginName, pluginDescribe, progressCallback)
