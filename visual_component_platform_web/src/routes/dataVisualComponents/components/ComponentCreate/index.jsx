/**
 * Created by chencheng on 17-8-31.
 */
import styles from "./index.scss";
import T from 'utils/T';
import BoxContent from 'templates/ToolComponents/BoxContent';
import CodeEditor from './CodeEditor';

import { Component } from 'react';
import { Button, Row, Col, Card } from 'antd';
import { MainHeader, MainContent } from 'templates/MainLayout';

import { doGetComponentDetail } from '../../action/component';
import { doGetOrgDetail } from '../../action/organize';

@T.decorator.contextTypes('router')
export default class ComponentCreate extends Component {
    constructor(){
        super();
        this.state = {
            loading: false,
            org_mark: null,
            component_mark: null,
            isCompilation: false,               // 是否处于编译过程中
            compilationErrorInfo: null,         // 编译后报错信息
        }
    }

    componentDidMount(){
        const component_id = this.getComponentId();
        this.setState({loading: true}, () => {
            doGetComponentDetail(component_id).then((componentResp) => {
                doGetOrgDetail(componentResp.data.org_id).then((orgResp) => {
                    this.setState({
                        loading: false,
                        component_mark: componentResp.data.component_mark,
                        org_mark: orgResp.data.org_mark,
                    })
                }, (resp) => T.prompt.error(resp.msg))
            }, (resp) => T.prompt.error(resp.msg))
        })
    }

    /**
     * 获取组件ID
     */
    getComponentId(){
        const { component_id } = T.queryString.parse(this.context.router.route.location.search);
        return component_id;
    }

    /**
     * code 编译状态回调
     * @param {Boolean} isCompilation
     * @param {String}  compilationErrorInfo
     */
    codeCompileStatusCb = (isCompilation, compilationErrorInfo = null) => {
        this.setState({isCompilation, compilationErrorInfo});
    }


    render() {
        const component_id = this.getComponentId();
        const { isCompilation, compilationErrorInfo } = this.state;   // 编辑器的高度
        return (
            <div className={styles["v-component-create"]}>
                <MainHeader title="组件创建" rightRender={
                    <Button
                        type="primary"
                        icon="rollback"
                        onClick={() => this.context && this.context.router && this.context.router.history && this.context.router.history.goBack()}
                    >返回</Button>
                } />

                <MainContent>
                    <BoxContent loading={this.state.loading}>
                        <CodeEditor component_id={parseInt(component_id)} component_mark={this.state.component_mark} org_mark={this.state.org_mark} codeCompileStatusCb={this.codeCompileStatusCb} />

                        <Card title="可视化区" bodyStyle={{padding: 0}}>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <BoxContent loading={isCompilation}>
                                        {
                                            compilationErrorInfo ?
                                                <span style={{color: '#ff6666'}}>{compilationErrorInfo}</span>
                                                :
                                                <iframe id="iframe-screen"
                                                         src={window.ENV.visualComponent.getDevVisualUrl(this.state.org_mark, this.state.component_mark)}
                                                         style={{
                                                             width:"100%",
                                                             height: "800px",
                                                             border: 0
                                                         }}
                                                />
                                        }

                                    </BoxContent>
                                </Col>
                            </Row>
                        </Card>
                    </BoxContent>
                </MainContent>
            </div>
        );
    }
}
