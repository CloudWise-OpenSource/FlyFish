module.exports = {
    rules: {
        // 验证参数是否是数组
        isArray: (value) => Array.isArray(value),
    },

    messages: {
        isArray: '{name}不是数组'
    }
}