import React from "react";
import { Drawer, List, Avatar, Divider, Col, Row, Collapse, Table } from 'antd';
import { useIntl } from "react-intl";
import stylus from './index.less';
import AceEditor from "react-ace";
import { CWTable, Input, Button, message, Popconfirm } from "@chaoswise/ui";
const { Panel } = Collapse;
import moment from 'moment';

import { observer, toJS } from '@chaoswise/cw-mobx';
import ReactMarkdown from 'react-markdown';


export default function BasicDrawer({ assemly = {}, setDrawerVisible}) {
  const intl = useIntl();
  const assemlyData = toJS(assemly);
  const pStyle = {
    fontSize: 16,
    color: 'rgba(0,0,0,0.85)',
    lineHeight: '24px',
    display: 'block',
    marginBottom: 16,
  };
  const childTableData = assemly.dataConfig && assemly.dataConfig.optionsChilds&&assemly.dataConfig.optionsChilds[0] ? [...assemly.dataConfig.optionsChilds[0].datas] : [];

  let state = { visible: true };

  const onClose = () => {
    setDrawerVisible(false);
    state.visible = false;
  };
  const eventColumns = [
    {
      title: '事件名称',
      dataIndex: 'name',
      align: 'center'
    },
    {
      title: '参数',
      align: 'center',
      dataIndex: 'param',
    },
    {
      title: '描述',
      dataIndex: 'desc',
      align: 'center',
    }
  ];
  const columns1 = [
    {
      title: "属性名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "描述",
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",

    }, {
      title: "默认值",
      dataIndex: "defaultValue",
      key: "defaultValue",

    }];
  const columns = [
    {
      title: '版本',
      dataIndex: 'no',
      key: 'no',
      align: 'center'
    },
    {
      title: '描述',
      align: 'center',
      dataIndex: 'desc',
      key: 'desc',
    },
    {
      title: '更新时间',
      dataIndex: 'time',
      render: (text) => {
        return moment(Number(text)).format('YYYY-MM-DD HH:mm:ss');
      }
    }
  ];
  const showTrades = (arr) => {
    if (arr && arr.length > 0) {
      return arr.map((item, index) => {
        if (index !== arr.length - 1) {
          return item.name + ',';
        } else {
          return item.name;
        }
      });
    } else {
      return '暂无';
    }

  };
  return (
    <div >
      <Drawer
        width={640}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={state.visible}
        className={stylus.drawerContainer}
      >
        <p className={stylus.title}>组件预览</p>
        <div className={stylus.firstTitle}>组件名称:
          <span>{assemlyData.name}</span>
        </div>
        <div className={stylus.firstTitle}>组件编号:
          <span>{assemlyData.id}</span>
        </div>
        <div className={stylus.firstTitle}>行业:
          <span>{assemly.trades ? showTrades(assemly.trades) : '暂无'}</span>
        </div>
        <div className={stylus.firstTitle}>标签:
          <span>{assemly.tags ? showTrades(assemly.tags) : '暂无'}</span>
        </div>
        <div className={stylus.firstTitle}>描述:
          <span>{assemlyData.desc||'暂无'}</span>
        </div>
        <div className={stylus.firstTitle}>开发状态:
          <span>{assemlyData.developStatus === 'doing' ? '开发中' : '已交付'}</span>
        </div>
        <div className={stylus.firstTitle}>创建者信息:
          <span>{assemlyData.creatorInfo && assemlyData.creatorInfo.username||'暂无'}</span>
        </div>
        <Row className={stylus.effectTitle}>
          <Col span={6}>
            <span>效果演示</span>
            {/* <DescriptionItem title="效果演示" content="Programmer" /> */}
          </Col>
          <Col span={18}>
            <span>提供组件标识：<span className={stylus.identification}>{assemlyData.id}</span></span>
          </Col>
        </Row>
        {/* 实时面板 */}
        <div style={{backgroundColor:'#eee',height:300,backgroundSize:'cover'}}>
          <iframe 
            width='100%'
            height='100%'
            name='detailPreview' 
            src={`${window.LCAP_CONFIG.wwwAddress}/components/${assemlyData.id}/v-current/index.html`} 
            frameBorder={0}
          >
          </iframe>
          </div>
        {/* 版本 表格 */}
        <div className={stylus.table}>
          <Collapse defaultActiveKey={[]} >
            <Panel header="版本更新历史" key="1">
              <Table rowKey="id" pagination={false} size='small' bordered={true} columns={columns} dataSource={assemly.versions} />
            </Panel>
          </Collapse>
        </div>
        {/* 数据格式表格 */}
        <div style={{ fontWeight: 800 }}>数据格式</div>
        <div>
          <div style={{ fontWeight: 800, padding: '10px 0' }}>注释：</div>
          <Input disabled
            value={assemlyData.dataConfig && assemlyData.dataConfig.annotationValue}
          ></Input>
        </div>
        <div>
          <div style={{ fontWeight: 800, margin: '10px 0' }}>代码示例：</div>
          <AceEditor
            style={{ width: '100%', height: 200 }}
            mode="javascript"
            theme="monokai"
            showPrintMargin={false}
            value={assemlyData.dataConfig && assemlyData.dataConfig.codeValue}
            name="code"
            readOnly={true}
          />
        </div>
        <div>
          <div style={{ fontWeight: 800, padding: '10px 0' }}>配置：</div>
          <Table
            size='small'
            columns={columns1}
            dataSource={assemlyData.dataConfig && assemlyData.dataConfig.options}
            bordered
            pagination={false}
            footer={null}
            rowKey={(record) => record.name}
          />
        </div>
        <div>
          <div style={{ fontWeight: 800, padding: '10px 0' }}>option.item：</div>
          <Table
            size='small'
            columns={columns1}
            dataSource={childTableData}
            bordered
            pagination={false}
            footer={null}
            rowKey={(record) => record.name}
          />
        </div>
        <div>
          <div style={{ fontWeight: 800, padding: '10px 0' }}>事件：</div>
          <Table
            size='small'
            columns={eventColumns}
            dataSource={assemlyData.dataConfig && assemlyData.dataConfig.events}
            bordered
            pagination={false}
            footer={null}
            rowKey={(record) => record.name}
          />
        </div>
        <div>
          <div style={{ fontWeight: 800, padding: '10px 0' }}>监听：</div>
          <Table
            size='small'
            columns={eventColumns}
            dataSource={assemlyData.dataConfig && assemlyData.dataConfig.listeners}
            bordered
            pagination={false}
            footer={null}
            rowKey={(record) => record.name}
          />
        </div>
        <div>
          <div style={{ fontWeight: 800, padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>更多信息：</span>
          </div>
          <div style={{ padding: 20, border: '1px solid #eee', backgroundColor: '#eee' }}>
            <ReactMarkdown >{assemlyData.dataConfig && assemlyData.dataConfig.markValue}</ReactMarkdown>
          </div>
        </div>
      </Drawer>

    </div>
  );
}
