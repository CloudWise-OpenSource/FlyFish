/**
 * Created by john on 2018/1/26.
 */
import T from 'utils/T'
import EnumAPI from 'constants/EnumAPI'

/**
 * 上传插件
 * @param {Object} plugin 上传的文件
 * @param {String} pluginName
 * @param {String} pluginDescribe
 * @param {function} progressCallback 上传文件进度的回调
 * @return {Promise}
 */
export const submit = (plugin, pluginName, pluginDescribe, progressCallback) => T.request.upload(EnumAPI.uploadPlugin, {plugin, pluginName, pluginDescribe}, progressCallback)
