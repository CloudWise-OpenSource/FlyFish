/**
 * Created by chencheng on 17-10-11.
 */
import onfire from 'onfire.js';

const EnumEvent = {
    open: 'open',       // 当网络连接建立时触发该事件
    error: 'error',     // 当网络发生错误时触发该事件
    close: 'close',     // 当websocket被关闭时触发该事件
    message: 'message', // 当websocket接收到服务器发来的消息的时触发的事件
};

export default class Socket {

    /**
     *
     * @param wsConf
     * {
     *      isStart: true,                          // 是否开启etl websocket服务
            domain: 'ws://10.0.3.179:9091',         // etl websocket domain地址
            opts: {
                path: '/pubsub',                    //path
            }
     * }
     */
    constructor(wsConf) {
        /**
         * 实例化websocket
         */
        this.socket = (() => {
            if (!wsConf.isStart) return null;

            const url = wsConf.domain + wsConf.opts.path;

            if ('WebSocket' in window) {
                return new window.WebSocket(url);
            } else if ('MozWebSocket' in window) {
                return new window.MozWebSocket(url);
            } else {
                alert('当前浏览器不支持websocket!');
            }

            return null;
        })();

        this.initEvent();
    }

    /**
     * 初始化事件
     */
    initEvent() {
        if (this.socket) {
            this.socket.onopen = () => {
                onfire.fire(EnumEvent.open);
            };

            this.socket.onclose = () => {
                onfire.fire(EnumEvent.close);
            };

            this.socket.onerror = () => {
                onfire.fire(EnumEvent.error);
            };

            this.socket.onmessage = (msg) => {
                onfire.fire(EnumEvent.message, msg);
            };
        }
    }

    /**
     * 检查是否支持websocket
     * @return {boolean}
     */
    checkIsSupportWebSocket() {
        return this.socket ? true : false;
    }

    /**
     * socket实例是否存在
     * @return {boolean}
     */
    socketIsExist() {
        return this.socket ? true : false;
    }

    /**
     * 获取socket 实例
     * @return {*}
     */
    getSocket() {
        return this.socket;
    }

    /**
     * 发送数据
     * @param msg
     */
    send(msg) {
        return this.socket.send(msg);
    }

    /**
     * 关闭socket连接
     */
    close() {
        return this.socket.close();
    }

    /**
     * 订阅事件名称
     * @param eventName // EnumEvent
     * @param cb
     * @param context
     */
    on(eventName, cb, context) {
        if (Object.values(EnumEvent).indexOf(eventName) !== -1) {

            onfire.on(eventName, cb, context);
        } else {
            console.warn('websocket订阅事件' + eventName + '不存在');
        }
    }

    unon(eventName) {
        onfire.un(eventName);
    }

}
