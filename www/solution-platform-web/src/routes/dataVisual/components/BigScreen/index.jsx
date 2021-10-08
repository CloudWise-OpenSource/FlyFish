/**
 * Created by chencheng on 17-8-31.
 */
 import styles from './index.scss';
 import defaultCoverSrc from './img/default.png';
 import PropTypes from 'prop-types';
 import T from 'utils/T';
 import BoxContent from 'templates/ToolComponents/BoxContent';
 import CreateScreenModal from './CreateScreenModal';

 import { PureComponent } from 'react';
 import { Card, List, Icon, Button, Input, Pagination, Tooltip, Tag, Select } from 'antd';
 import { MainHeader, MainContent } from 'templates/MainLayout';
 import {
     getScreenPageListAction, doDelScreen, delScreenAction, doUnlockScreen, doDownloadScreen
 } from '../../action/bigScreen';

 import DeletedScreenModal from './DeletedScreenModal';
 import { EnumScreenStatus } from '../../../../constants/app/dataVisual/bigScreen';

 @T.decorator.contextTypes('store')
 export default class BigScreen extends PureComponent {
     constructor(props) {
         super(props);
         this.search = {};
     }

     componentDidMount() {
         this.getScreenList();
     }

     /**
      * 获取大屏列表
      * @param {Number} page
      * @param {Object} [search]
      */
     getScreenList(page = 1, search = {}) {
         this.search = Object.assign({}, this.search, search || {});
         this.context.store.dispatch(getScreenPageListAction(page, this.search));
     }

     /**
      * 添加和编辑大屏
      * @param {String} screen_id
      */
     addOrEditOrCopyScreen = (screen_title, screen_id = null) => T.helper.renderModal(<CreateScreenModal
         screen_id={screen_id}
         screen_title={screen_title}
         create_user_id={screen_title}
         getScreenList={() => this.getScreenList(1)}
     />);

     /**
      * 删除大屏
      * @param {Array | number}screen_ids
      */
     delScreen(screen_ids, user_id) {
         screen_ids = !Array.isArray(screen_ids) ? [screen_ids] : screen_ids;
         const { user, isAdmin } = T.auth.getLoginInfo() || {};
         if (isAdmin || user_id === user.user_id) {
             T.prompt.confirm(() => {
                 return doDelScreen(screen_ids).then(() => {
                     this.context.store.dispatch(delScreenAction(screen_ids));
                     this.getScreenList();
                     T.prompt.success('删除成功');
                 }, (resp) => {
                     T.prompt.error(resp.msg);
                 });
             }, { title: '确定删除？（删除后可在已删除大屏列表还原）' });
         } else {
             T.prompt.error('只有管理员或者当前大屏创建者才能删除');
         }

     }
     /**
      * 下载大屏构建完成的部署包
      * @param {Array | number}screen_id
      */
     downloadScreen(screen_id) {
         T.prompt.confirm(() => {
             return doDownloadScreen(screen_id).then(() => {

             }, (resp) => {
                 T.prompt.error(resp.msg);
             });
         }, { title: '确定下载大屏部署包？' });
     }

     /**
      * 解锁大屏
      * @param {Array | number}screen_ids
      */
     unlockScreen(screen_id) {
         T.prompt.confirm(() => {
             return doUnlockScreen(screen_id).then(() => {
                 this.getScreenList();
                 T.prompt.success('解锁成功');
             }, (resp) => {
                 T.prompt.error(resp.msg);
             });
         }, { title: '确定解锁大屏？' });
     }

     historyDelScreenList = () => T.helper.renderModal(<DeletedScreenModal></DeletedScreenModal>)

     render() {
         const { loading, screenList, delScreenList } = this.props.screenListReducer;
         const { count, pageSize, currentPage, data } = screenList;
         return (
             <div className={styles['visual-big-screen']}>
                 <ScreenHeader
                     historyDelScreenList={() => this.historyDelScreenList()}
                     addOrEditOrCopyScreen={() => this.addOrEditOrCopyScreen('add')}
                     getScreenList={(page = 1, search = {}) => {
                         this.search = search;
                         this.getScreenList(page, search);
                     }}
                 />

                 <ScreenList
                     loading={loading}
                     data={data}
                     addOrEditOrCopyScreen={(screen_title, screen_id) => this.addOrEditOrCopyScreen(screen_title, screen_id)}
                     delScreen={(screen_ids, user_id) => this.delScreen(screen_ids, user_id)}
                     downloadScreen={(screen_id) => this.downloadScreen(screen_id)}
                     unlockScreen={(screen_id) => this.unlockScreen(screen_id)}
                 />
                 <div className={styles['visual-big-screen-page']}>
                     <Pagination current={currentPage} pageSize={pageSize || 15} onChange={(pageNum) => this.getScreenList(pageNum)} total={count} />
                 </div>
             </div>
         );
     }
 }

 /**
  * 大屏Header
  */
 @T.decorator.propTypes({
     addOrEditOrCopyScreen: PropTypes.func.isRequired,
     getScreenList: PropTypes.func.isRequired,
     historyDelScreenList: PropTypes.func.isRequired,
 })
 class ScreenHeader extends PureComponent {
     state = {
         name: null,
         status: 'all',
         tagList: null
     }

     doSearch = () => {
         const { getScreenList } = this.props;
         const cloneState = T.lodash.clone(this.state);
         if (T.lodash.isEmpty(cloneState.name)) delete cloneState.name;
         if (T.lodash.isEmpty(cloneState.tagList)) { delete cloneState.tagList } else {
             cloneState.tagList = cloneState.tagList.join(',');
         }
         if (cloneState.status === 'all') delete cloneState.status;
         getScreenList(1, cloneState);
     }


     render() {
         const { addOrEditOrCopyScreen, historyDelScreenList } = this.props;

         return (
             <MainHeader title="作品集" leftRender={[
                 <a key={3} title="已删除大屏" onClick={() => historyDelScreenList()}><Icon type="delete" style={{ marginLeft: 10 }} /></a>
                 ]} rightRender={[
                     <Select
                         key={4}
                         placeholder="请选择"
                         value={this.state.status}
                         onChange={(e) => {
                             this.setState({ status: e }, () => this.doSearch()); }}
                         style={{ width: 150 }}
                     >
                         <Select.Option value="all" key="all">全部</Select.Option>
                         {
                             Object.values(EnumScreenStatus).map(({ label, value }) => (
                                 <Select.Option value={value} key={value}>{label}</Select.Option>
                             ))
                         }
                     </Select>,
                     <Input
                         key={1}
                         placeholder="按大屏名称搜索" style={{ width: 150, marginLeft: '10px' }}
                         value={this.state.name}
                         onChange={(e) => this.setState({ name: e.target.value.trim() })}
                         onBlur={() => this.doSearch()}
                         onKeyDown={(e) => e.keyCode === 13 && this.doSearch()}
                     />,
                     <Button key={3} type="primary" icon="plus" style={{ marginLeft: 10 }} onClick={() => addOrEditOrCopyScreen('add')}>添加大屏</Button>
                 ]}
             />
         );
     }
 }

 const TagColorMap = {
     0: '#f50',
     1: '#2db7f5',
     2: '#87d068'
 };

 const computedTagWordByStatus = (status) => {
     const statusItem = Object.entries(EnumScreenStatus).find(([key, { label, value }]) => value === status);
     return statusItem ? statusItem[1].label : EnumScreenStatus.developing.label;
 };

 const CoverImage = ({
     url, cover, status
 }) => {
     let WrapperElement = React.Fragment;
     if (url) {
         WrapperElement = ({ children }) => <a href={url} target="_blank">{children}</a>;
     }
     const finalCover = T.lodash.isEmpty(cover) ? defaultCoverSrc : window.ENV.visualScreen.coverBasePath + '/' + cover + '?v=' + new Date().getTime();
     return (
         <WrapperElement>
             <Tag className={styles.tag} color={TagColorMap[status]}>{computedTagWordByStatus(status)}</Tag>
             <img
                 className={styles.cover}
                 src={finalCover}
             />
         </WrapperElement>
     );
 };

 /**
  * 大屏列表
  * @param loading
  * @param data
  * @param addOrEditScreen
  * @param delScreen
  * @param unlockScreen
  * @return {*}
  * @constructor
  */
 const ScreenList = ({ loading, data, addOrEditOrCopyScreen, delScreen, unlockScreen, downloadScreen }) => (
     <MainContent>
         <BoxContent loading={loading}>
             <List
                 grid={{ gutter: 16, column: 3 }}
                 dataSource={data}
                 renderItem={item => (
                     <List.Item>
                         <Card
                             className={styles['card-item']}
                             bordered={false}
                             cover={
                                 <CoverImage
                                     url={item.url}
                                     cover={item.cover}
                                     status={item.status}
                                 />
                             }
                             actions={(() => {
                                 const actions = [
                                     <Tooltip key="setting" title="设置">
                                         <a title="设置"><Icon type="setting" onClick={() => addOrEditOrCopyScreen('edit', item.screen_id)} /></a>
                                     </Tooltip>,
                                     <Tooltip key="copy" title="复制">
                                         <a title="复制"><Icon type="copy" onClick={() => addOrEditOrCopyScreen('copy', item.screen_id)} /></a>
                                     </Tooltip>,
                                     <Tooltip key="design" title="设计大屏">
                                         <a title="设计大屏" target="_blank" href={window.ENV.visualScreen.editBigScreen + '?id=' + item.screen_id}><Icon type="area-chart" /></a>
                                     </Tooltip>,
                                     <Tooltip key="lookup" title="查看">
                                         <a title="查看" target="_blank" href={window.ENV.visualScreen.showBigScreen + '?id=' + item.screen_id}><Icon type="eye-o" /></a>
                                     </Tooltip>,
                                     <Tooltip key="download" title="下载">
                                         <a title="下载" target="_blank" onClick={() => downloadScreen(item.screen_id)}><Icon type="download" /></a>
                                     </Tooltip>,
                                     <Tooltip key="delete" title="删除">
                                         <a title="删除"><Icon type="delete" style={{ color: 'red' }} onClick={() => delScreen(item.screen_id, item.create_user_id)} /></a>
                                     </Tooltip>
                                 ];

                                 if (!item.is_lock) actions.push(<a title="解锁大屏" onClick={() => unlockScreen(item.screen_id)}><Icon type="unlock" /></a>);
                                 return actions;
                             })()}
                         >
                             <Card.Meta
                                 title={<span title={item.name}>{item.name}</span>}
                                 description={<div>
                                     <p title={item.developing_user_name}>当前开发人：{item.developing_user_name || '暂无'}</p>
                                     <p title={item.create_user_name}>创建人：{item.create_user_name || '暂无'}</p>
                                 </div>}
                             />
                         </Card>
                     </List.Item>
                 )}
             >
             </List>
         </BoxContent>
     </MainContent>
 );
 ScreenList.propTypes = {
     loading: PropTypes.bool.isRequired,
     data: PropTypes.array.isRequired,
     addOrEditOrCopyScreen: PropTypes.func.isRequired,
     delScreen: PropTypes.func.isRequired,
     unlockScreen: PropTypes.func.isRequired,
 };

