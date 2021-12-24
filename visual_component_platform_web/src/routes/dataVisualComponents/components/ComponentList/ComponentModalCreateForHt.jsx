/**
 * Created by chencheng on 17-8-31.
 */
 import styles from "./ComponentModalCreate.scss";
 import PropTypes from 'prop-types';
 import T from 'utils/T';
 
 import BoxContent from 'templates/ToolComponents/BoxContent'
 
 import { Component } from 'react';
 import { Row, Col, Input, Button, Select, Modal } from 'antd';
 
 import { doGetAllCategories } from "../../action/categories";
 import { doGetOrgAll } from '../../action/organize';
 import { doGetComponentDetail, doAddComponent, doUpdateComponent } from "../../action/component";
 import * as sceneAPI from '../../webAPI/scene';
 import EnumComponentType from '../../../../constants/EnumComponentType';
 
 @T.decorator.propTypes({
     component_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]).isRequired,
     getComponentListCb: PropTypes.func.isRequired
 })
 export default class ComponentModalCreateForHt extends Component {
     static defaultProps = {
         component_id: false,
         getComponentListCb: () => {}
     }
 
     constructor() {
         super();
         this.state = {
             fetching: false,    // 获取数据过程状态
             saving: false,      // 保存数据过程状态
             visible: false,		// 是否显示modal
 
             name: null,            		// 名称
             component_mark: null, 		//组件标识
             categories_id: null,		//
             componentCategories: [],	// 组件分类
             organize: [],				// 组织
             org_id: null,				//
             sceneId:'',
             sceneDatas:[]
         };
     }
 
     componentDidMount() {
         this.setState({visible: true}, () => this.initData())
     }
 
     filterDataByAdmin=( data)=>{
         const { isAdmin } = T.auth.getLoginInfo() || {}
         return isAdmin ? data : data.filter((item)=>{
             return item.name !== '公共组件'
         })
     }
 
 
     initData() {
         const { component_id } = this.props;
         this.setState({fetching: true}, () => {
       //获取场景数据
       sceneAPI.queryAllScene().then((res)=>{
         if (res && res.msg=='success') {
           this.setState({
             ...this.state,
             sceneDatas:res.data.result
           })
         }
       })
             if (component_id) {
                 T.request.all(doGetOrgAll(), doGetAllCategories(),doGetComponentDetail(component_id)).then(resp => {
                     const [organizeResp, categoriesResp, componentResp] = resp;
                     let organizeRespData=this.filterDataByAdmin(organizeResp.data || [])
                     const {name, component_mark, categories_id, org_id} = componentResp.data;
                     this.setState({
                         fetching: false,
                         name,
                         component_mark,
                         categories_id,
                         componentCategories: categoriesResp.data,
                         organize: organizeRespData,
                         org_id,
                     });
                 }, resp => {
                     this.setState({fetching: false});
                     T.prompt.error(resp.msg);
                 })
             } else {
                 T.request.all(doGetOrgAll(),doGetAllCategories()).then(resp => {
                     const [organizeResp, categoriesResp] = resp;
                     let organizeRespData=this.filterDataByAdmin(organizeResp.data || [])
                     this.setState({
                         fetching: false,
                         componentCategories: categoriesResp.data,
                         categories_id: categoriesResp.data[0] ? categoriesResp.data[0].categories_id : undefined,
                         organize: organizeRespData,
                         org_id: organizeRespData[0] ? organizeRespData[0].org_id : undefined,
                     });
                 }, resp => {
                     this.setState({fetching: false});
                     T.prompt.error(resp.msg);
                 })
             }
         })
     }
 
     /**
      * 保存模型
      */
     saveComponent = () => {
         const { name, component_mark, categories_id, org_id,sceneId } = this.state;
         if (T.lodash.isEmpty(name)) {
             T.prompt.error("名称不能为空");
             return false;
         }
         if (T.lodash.isEmpty(component_mark)) {
                 T.prompt.error("组件标识不能为空");
                 return false;
         }
         if (!sceneId) {
             T.prompt.error("请选择一个场景");
             return false;
         }
         this.setState({ saving: true }, () => {
             const { component_id } = this.props;
             const isCreate = !component_id;
 
             const thenParams = [
                 () => {
                     this.setState({saving: false, visible: false});
                     this.props.getComponentListCb();
                     T.prompt.success(isCreate ? '创建成功' : '修改成功');
                 },
 
                 resp => {
                     this.setState({saving: false});
                     T.prompt.error(resp.msg);
                 }
             ];
 
             if (isCreate) {
                 doAddComponent({ name, component_mark, categories_id, org_id ,type:EnumComponentType.type_ht,typeId:this.state.sceneId}).then(...thenParams);
             }else {
                 doUpdateComponent({ name, categories_id, component_id }).then(...thenParams);
             }
         })
     }
 
     render() {
         const { component_id } = this.props;
         const { fetching, saving, visible } = this.state;
 
         return (
             <Modal
                 wrapClassName={styles["v-component-modal-create"]}
                 title={!component_id ? "创建组件": "编辑组件"}
                 visible={visible}
                 onCancel={() => this.setState({visible: false})}
                 footer={[
                     <Button key="back" onClick={() => this.setState({visible: false})}>取消</Button>,
                     <Button key="submit" type="primary" loading={saving} onClick={this.saveComponent}>
                         保存
                     </Button>,
                 ]}
             >
                 <BoxContent loading={fetching}>
                     <Row className={styles["item-group"]} type="flex" align="middle">
                         <Col span={4} offset={4}><span>名称:</span></Col>
                         <Col span={10}><Input value={this.state.name} onChange={(e) => this.setState({ name: e.target.value.trim() })} /></Col>
                     </Row>
 
                     <Row className={styles["item-group"]} type="flex" align="middle">
                         <Col span={4} offset={4}><span>组件标识:</span></Col>
                         <Col span={10}><Input disabled={!!component_id} value={this.state.component_mark} onChange={(e) => this.setState({ component_mark: e.target.value.trim() })} /></Col>
                     </Row>
 
 
                     <Row className={styles["item-group"]} type="flex" align="middle">
                         <Col span={4} offset={4}><span>组织:</span></Col>
                         <Col span={10}>
                             <Select
                                 value={this.state.org_id}
                                 onChange={(org_id) => this.setState({org_id})}
                                 style={{width: '100%'}}
                             >
                                 {
                                     this.state.organize.map(item => <Select.Option key={item.org_id} value={item.org_id}>{item.name}</Select.Option>)
                                 }
                             </Select>
                         </Col>
                     </Row>
 
                     <Row className={styles["item-group"]} type="flex" align="middle">
                         <Col span={4} offset={4}><span>组件分类:</span></Col>
                         <Col span={10}>
                             <Select
                                 value={this.state.categories_id}
                                 onChange={(categories_id) => this.setState({categories_id})}
                                 style={{width: '100%'}}
                             >
                                 {
                                     this.state.componentCategories.map(item => <Select.Option key={item.categories_id} value={item.categories_id}>{item.name}</Select.Option>)
                                 }
                             </Select>
                         </Col>
                     </Row>
                     {
                       <Row className={styles["item-group"]} type="flex" align="middle">
                         <Col span={4} offset={4}><span>选择场景:</span></Col>
                         <Col span={10}>
                             <Select
                                 value={this.state.sceneId}
                                 onChange={(sceneId) => this.setState({sceneId})}
                 style={{width: '100%'}}
                             >
                                 {
                                     this.state.sceneDatas.map(item => <Select.Option key={item.sceneId} value={item.sceneId}>{item.sceneName}</Select.Option>)
                                 }
                             </Select>
                         </Col>
                     </Row>
                     }
                     
 
                 </BoxContent>
             </Modal>
         );
     }
 }
 
