/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { CWTable, Input, Button, message } from "@chaoswise/ui";
import { observer, loadingStore, toJS } from "@chaoswise/cw-mobx";
import store from "./model/index";
import AssemblyList from "./components/ComponentDevelop";
import ApplyList from './components/ApplyList';
import { FormattedMessage, useIntl } from "react-intl";
import { Menu } from 'antd';
import styles from "./assets/style.less";
const ProjectDetail = observer((props) => {
  const intl = useIntl();
  const { setCheckPageFLag
  } = store;
  const { checkPageFLag, hasMore, templateapplicationList,templateapplicationCurPage,
    total, activeProject, type, applicationList, industryList,templateapplicationTotal,
    templateapplicationPageSize,
    applicationLength, isAddModalVisible, pageSize, curPage, isisLibModallVisible } =
    store;
  const nowProgressId = props.match.params.id;
  return (
    <React.Fragment>
      <Menu onClick={setCheckPageFLag} mode="horizontal" selectedKeys={[checkPageFLag]} >
        <Menu.Item key="applyList" >
          项目应用列表
        </Menu.Item>
        <Menu.Item key="assemblyList" >
          项目组件列表
        </Menu.Item>
      </Menu>
      {/* 渲染应用或者组件 */}
      {
        checkPageFLag === 'applyList' ?
          <ApplyList ProgressId={nowProgressId}
            templateapplicationList={templateapplicationList}
            hasMore={hasMore} total={total}
            activeProject={activeProject}
            pageSize={pageSize}
            curPage={curPage}
            templateapplicationPageSize={templateapplicationPageSize}
            templateapplicationCurPage={templateapplicationCurPage}
            templateapplicationTotal={templateapplicationTotal}
            isAddModalVisible={isAddModalVisible}
            applicationList={applicationList}
            industryList={industryList}
            isisLibModallVisible={isisLibModallVisible}
            applicationLength={applicationLength}
            type={type} />
          :
          <AssemblyList

            ProgressId={nowProgressId} />
      }
    </React.Fragment>
  );
});
export default ProjectDetail;
