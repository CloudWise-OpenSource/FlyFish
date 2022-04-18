//使用 https://github.com/AlloyTeam/eslint-config-alloy
module.exports = {
    extends: [
        'eslint-config-alloy/react',
    ],
    globals: {
        // 这里填入你的项目需要的全局变量
        // 这里值为 false 表示这个全局变量不允许被重新赋值，比如：
        //
        React: false,
        jQuery: false,
        $: false
    },
    rules: {
        'no-tabs': 'off',
        'no-mixed-spaces-and-tabs': 'off',
        'no-param-reassign': 'off',
        'radix': 'off',
        // 回调函数嵌套禁止超过 3 层，多了请用 async await 替代
        'max-nested-callbacks': [
            'error',
            6
        ],
        'indent':'off'

    }
};
