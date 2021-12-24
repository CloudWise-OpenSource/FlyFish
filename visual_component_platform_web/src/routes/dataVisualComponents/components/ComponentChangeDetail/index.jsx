/**
 * Created by chencheng on 17-8-31.
 */
import T from 'utils/T';
import { PureComponent, Fragment } from 'react';
import { Button } from 'antd';
import { MainHeader } from 'templates/MainLayout';

import { doGetComponentChangeDetailAction } from '../../action/componentChange';

@T.decorator.contextTypes('store','router')
export default class ComponentChangeDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            iFrameHeight: '0px'
        }
    }

    componentDidMount() {
        doGetComponentChangeDetailAction(this.getComponentId(), this.getComponentHash()).then((resp) => {
            this.addIframe(resp);
        }, () => T.prompt.error('get diff html fail'));
    }

    componentWillUnmount() {
        const iframeWindow = window.frames['iframeResult'].document;
        iframeWindow.removeEventListener("onload", this.setIframeHeight());
	}

    createLink = (href = '')=>{
        const linkTag = document.createElement('link');
        linkTag.setAttribute('href', href);
        linkTag.setAttribute('rel', 'stylesheet');
        linkTag.setAttribute('media', 'all');
        linkTag.setAttribute('type', 'text/css');
        return linkTag;
    }

    createScripts = (src = '')=>{
        const scriptsTag  = document.createElement('script');
        scriptsTag.setAttribute('type', 'text/javascript');
        scriptsTag.setAttribute('src', src);
        return scriptsTag;
    }

    /**
     * 添加iframe
     */
    addIframe = (resp) =>{
        const iframeWindow = window.frames['iframeResult'].document;
        iframeWindow.addEventListener("onload", this.setIframeHeight());
        if(iframeWindow.head){
            const highlightCss = this.createLink(process.assetsPath + '/diff/highlight.css');
            const diff2htmlCss = this.createLink(process.assetsPath + '/diff/diff2html.css');
            const diff2htmlScripts = this.createScripts(process.assetsPath + '/diff/diff2html-ui.min.js');
            iframeWindow.head.appendChild(highlightCss); iframeWindow.head.appendChild(diff2htmlCss); iframeWindow.head.appendChild(diff2htmlScripts);
        }
        if(iframeWindow.body) iframeWindow.body.innerHTML = resp; 
    }

    /**
     * 获取组件ID
     */
     getComponentId(){
        const { component_id } = T.queryString.parse(this.context.router.route.location.search);
        return component_id;
    }

    /**
     * 获取组件hash
     */
     getComponentHash(){
        const { hash } = T.queryString.parse(this.context.router.route.location.search);
        return hash;
    }

    setIframeHeight(){
        let h = document.documentElement.clientHeight - 120;
        this.setState({
            "iFrameHeight": h + 'px'
        });
    }

    render() {
        return (
            <div>
                <MainHeader title="组件开发记录详情" rightRender={
                    <Fragment>
                        <Button
                            type="primary"
                            icon="rollback"
                            onClick={() => this.context && this.context.router && this.context.router.history && this.context.router.history.goBack()}
                        >返回</Button>
                    </Fragment>
                } 
                />

                <iframe
                    id="iframeResult"
                    name="iframeResult"
                    title="resg"
                    style={{ width: '100%', border: '0px', height: this.state.iFrameHeight, overflow:'visible'}}
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    scrolling="auto"
                    height={this.state.iFrameHeight}
                />
            </div>
        );
    }
}
