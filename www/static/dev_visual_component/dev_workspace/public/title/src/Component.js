import ReactComponent from 'data-vi/ReactComponent';
import PropTypes from 'prop-types';
import Title from './Title';

export default class Component extends ReactComponent {
    static propTypes = {
        /**
         * @description 文本内容（支持HTML格式，支持XML格式写法）
         * @default: ""
         */
        text: PropTypes.string,
        /**
         * @description 是否开启跳转
         * @default: ""
         */
        isLink: PropTypes.bool,
        /**
         * @description 文本跳转地址
         * @default: ""
         */
        hrefUrl: PropTypes.string,
        /**
         * @description 
         * @default: auto
         */
        isNewWindow: PropTypes.bool,
        /**
         * @description 是否在新窗口打开
         * @default: true
         */
        color: PropTypes.string,
        /**
         * @description 文本大小
         * @default: 26
         */
        fontSize: PropTypes.number,
        /**
         * @description 文本字体
         * @default: default
         */
        fontFamily: PropTypes.string,
        /**
         * @description 文本粗细
         * @default: 400
         */
        fontWeight: PropTypes.string,
        /**
         * @description 水平排列
         * @default: flex-start
         */
        justifyContent: PropTypes.string,
        /**
         * @description 垂直排列
         * @default: flex-start
         */
        alignItems: PropTypes.string
    }
    static enableLoadCssFile = true;
    // 默认选项
    static defaultOptions = {
        text: '<div><div class="title">我的第一个参数：${data.title}</div><div class="text" style="color:red;">我的第二个参数：${data.text}</div></div>',
        isLink: false,
        hrefUrl: '',
        isNewWindow: true,
        color: '#fff',
        fontSize: 26,
        fontFamily: 'inherit',
        fontWeight: 400,
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    };

    getDefaultConfig() {
        return {
        "left": 534,
        "top": 200,
        "width": 450,
        "height": 280,
        "visible": true
        }
    }

    getDefaultData() {
        return {
            data: {
                title: "标题",
                text: 123
            }
        }
    }

    getReactComponent() {
        return Title
    }
}

