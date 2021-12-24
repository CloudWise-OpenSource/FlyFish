/**
 * 枚举所有类型
 * @type {string}
 */
export const EnumAllType = 'all';


/**
 * Monaco Editor requirejs 配置
 * @type {{url: string, paths: {vs: string}}}
 */
export const EnumMonacoEditorRequireConf = {
    url: window.ENV.publicPath + '/require.min.js',
    paths: {
        'vs': window.ENV.publicPath + '/vs'
    }
}


