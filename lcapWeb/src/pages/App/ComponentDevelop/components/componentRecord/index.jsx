import React, { useEffect } from 'react';
import styles from './style.less';
import { Table,Button } from 'antd';
import { useState } from 'react';
import store from "../../model/index";
import { observer } from "@chaoswise/cw-mobx";
import { getRecordService,getDiffRecordService } from '../../services';
import moment from 'moment';

const ComponentRecord = observer((props)=>{
  const columns = [
    {
      title: 'hash',
      dataIndex: 'hash'
    },
    {
      title: '提交摘要',
      dataIndex: 'message',
    },
    {
      title: '提交时间',
      dataIndex: 'time',
      render:(text)=>{
        return moment(Number(text)).format('YYYY.MM.DD HH:mm:ss')
      }
    },{
      title:'操作',
      dataIndex:'handle',
      render:(text,record)=>{
        return <Button type='primary'
          onClick={()=>{
            viewDiffClick(record.hash);
          }}
        >查看提交diff</Button>
      }
    }
  ];
  const { 
    developingData,
    showRecord,
    setShowRecord 
  } = store;

  const [data, setData] = useState([]);
  const [curPage, setCurPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [showDiff, setShowDiff] = useState(false);


  const viewDiffClick = async (hash)=>{
    const res = await getDiffRecordService(developingData.id,hash);
    // setDiffData(res);
    setShowDiff(true);
    addIframe(res)
  }
  const addIframe = (resp) =>{
    const iframeWindow = window.frames['iframeResult'].document;
    if(iframeWindow.head){
        const highlightCss = createLink('/diff/highlight.css');
        const diff2htmlCss = createLink('/diff/diff2html.css');
        const diff2htmlScripts = createScripts('/diff/diff2html-ui.min.js');
        iframeWindow.head.appendChild(highlightCss); 
        iframeWindow.head.appendChild(diff2htmlCss); 
        iframeWindow.head.appendChild(diff2htmlScripts);
    }
    if(iframeWindow.body) iframeWindow.body.innerHTML = resp; 
  }
  const createLink = (href = '')=>{
    const linkTag = document.createElement('link');
    linkTag.setAttribute('href', href);
    linkTag.setAttribute('rel', 'stylesheet');
    linkTag.setAttribute('media', 'all');
    linkTag.setAttribute('type', 'text/css');
    return linkTag;
}
const createScripts = (src = '')=>{
  const scriptsTag  = document.createElement('script');
  scriptsTag.setAttribute('type', 'text/javascript');
  scriptsTag.setAttribute('src', src);
  return scriptsTag;
}
  useEffect(() => {
    if (showRecord) {
      getData();
    }
  }, [showRecord]);
  useEffect(() => {
    getData()
  }, [curPage,pageSize]);
  const getData = async ()=>{
    const res = await getRecordService({id:developingData.id,curPage,pageSize});
    if (res && res.data) {
      setData(res.data.list);
      setTotal(res.data.total)
    }
  }
  
  return <div className={styles.wrap}>
    {
      showDiff?
      <div className={styles.iframeWrap}>
        <div className={styles.titleWrap}>
          <span>组件开发diff列表</span>
          <Button
            onClick={()=>{
              setShowDiff(false)
            }}
          >返回</Button>
        </div>
        <iframe
          id="iframeResult"
          name="iframeResult"
          title="resg"
          style={{ width: '100%', border: '0px', height: '100%', overflow:'visible'}}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          scrolling="auto"
          height='100%'
      />
      </div>
      :<div>
        <div className={styles.titleWrap}>
          <span>组件开发记录列表</span>
          <Button
            onClick={()=>{
              setShowRecord(false)
              // props.history.push({pathname:`/app/${developingData.id}/code-develop`,state:{name:developingData.name}});
            }}
          >返回</Button>
        </div>
        <Table
        columns={columns}
        dataSource={data}
        pagination={{
          // showQuickJumper:true,
          showSizeChanger:true,
          pageSize:pageSize,
          current:curPage+1,
          total:total,
          showTotal:(total)=>{
            return `共${total}条记录`;
          },
          onShowSizeChange:(curPage,size)=>{
            setPageSize(size)
          },
          onChange:(curPage,size)=>{
            setCurPage(curPage-1);
          }
        }}
        footer={null}
        rowKey='hash'
      />
      </div>
    }
  </div>
})

export default ComponentRecord;