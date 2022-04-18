/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-06-11 14:25:25
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-09-02 18:11:56
 */
module.exports = (component_mark,sceneInfo) => `
import Component from "data-vi/Component";

export default class ${component_mark} extends Component {
    // 默认配置
    static defaultConfig = {};
    // 默认选项
    static defaultOptions = {};
    // 系统事件
    static events = {
      resized() {
        if (this.graph3dView) {
            this.graph3dView.invalidate();
        }
      }
    };
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
    _construct() {}

    /**
     * 钩子方法 组件mount挂载时调用
     */
    _mount() {
      ${(function(){
        const {fileName,dirPath} = sceneInfo;
        const jsonName = fileName.split('.')[0];
        return `const container = this.getContainer()[0];
      this.frame = document.createElement('iframe');
      this.frame.style.border='none';
      this.frame.width='100%';
      this.frame.height='100%';
      container.appendChild(this.frame);
      this.frame.contentWindow.myComponent = this;
      const scriptTag = document.createElement('script');
      scriptTag.innerHTML=\`
        const init3d = function(plugins){
          const init3dObjects = function(){
            const dataModel = new ht.DataModel();
            const graph3dView = new ht.graph3d.Graph3dView(dataModel);
            graph3dView.addToDOM();
            /*convertURL start*/ht.Default.convertURL = (url) => {return "\${window.location.origin}${dirPath}/storage/"+url;};/*convertURL end*/
            graph3dView.deserialize("scenes/${jsonName}.json",()=>{
              window.myComponent.initObjs3d(ht,graph3dView,dataModel);
            });
          }
          if(plugins && plugins.length){
            plugins.forEach(item=>{
              const scriptElement = document.createElement("script");
              /*pluginSrc start*/scriptElement.src = item;/*pluginSrc end*/
              document.body.appendChild(scriptElement);
              scriptElement.onload = () => {
                this.pluginLoadNum++;
                if(this.pluginLoadNum==plugins.length){
                  init3dObjects.call(this);
                }
              }
            })
          }else{
            init3dObjects.call(this);
          }
        }
        /*framejs start*/
        this.pluginLoadNum = 0;
        const ht_main = document.createElement("script");
        /*ht_main start*/ht_main.src = 'public/ht/k5o4stdqy93D.js';/*ht_main end*/
        document.body.appendChild(ht_main);
        ht_main.onload = () => {
          const ht_valid = document.createElement("script");
          /*ht_valid start*/ht_valid.src = 'public/ht/Xsy4zRvefN8W.js';/*ht_valid end*/
          document.body.appendChild(ht_valid);
          ht_valid.onload = () => {
            const ht_script = document.createElement("script");
            /*ht_script start*/ht_script.src = 'public/ht/ht.js';/*ht_script end*/
            document.body.appendChild(ht_script);
            ht_script.onload = () => {
              const ht_buck = document.createElement("script");
              /*ht_buck start*/ht_buck.src = 'public/ht/buckle.js';/*ht_buck end*/
              document.body.appendChild(ht_buck);
              ht_buck.onload = () => {
                  const plugins = [
                  'public/ht/ht-modeling.js'
                  ];
                  init3d.call(this,plugins);
              }
            }
          }
        }
        
        \`;
        this.frame.contentDocument.body.appendChild(scriptTag);
        this.frame.contentDocument.onclick=()=>{
          container.click();
        }
        `
      })()}
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
    
    /**
     * 对组件暴露3d对象，以便操作
     */
    initObjs3d(ht,g3d,dm){
      this.ht = ht;
      this.g3d = g3d;
      this.dm = dm;
    }
}

`;
