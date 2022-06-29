'use strict';
module.exports = () => `
'use strict';

import BaseComponent from "data-vi/Component";

export default class Component extends BaseComponent {
    // 默认配置
    static defaultConfig = {};
    // 默认选项
    static defaultOptions = {};
    // 系统事件
    static events = {};
    // 是否加载css文件 如当前组件没有样式文件，设置为false
    static enableLoadCssFile = false;

    // 获取默认选项
    getDefaultOptions() {
      return this.constructor.defaultOptions;
    }

    // 获取默认事件
    getDefaultData() {
      return [];
    }

    /**
     * 钩子方法 组件实例化时调用
     */
    _construct() {
      
    }

    /**
     * 钩子方法 组件mount挂载时调用
     */
    _mount() {
      const container = this.getContainer();
      container.html("Hello FlyFish !");
      container.css({color: "#FFF"});
    }

    /**
     * 钩子方法 组件渲染时调用
     */
    _render() {
        
    }

    /**
     * 钩子方法 组件更新时调用
     */
    _update() {
      // 默认调用render方法
      this._render();
    }

    /**
     * 钩子方法 渲染数据时调用
     */
    _draw() {
      
    }

    /**
     * 钩子方法 组件mount卸载时调用
     */
    _unMount() {}
}

`;
