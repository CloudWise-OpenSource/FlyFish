import React from 'react';
import { Icon,Input,message } from 'antd';
import { useState,useEffect,useRef } from 'react';
import styles from './style.less';
import { observer,toJS } from "@chaoswise/cw-mobx";
import store from "../../model/index";
import _ from "lodash";
import { updateTreeDataService } from '../../services';

const HandleMenu = observer((props)=>{
  const { defaultExpandAll=true } = props;
  const { 
    treeData,
    getTreeData,
    setSelectedData,
    selectedData,
    userInfo,
    setCurPage,
    setPageSize
  } = store;
  const [data, setData] = useState([]);
  const addinput = useRef();
  const editInput = useRef();
  const addCateRef = useRef();

  const [addCateName, setAddCateName] = useState('');
  const [editName, setEditName] = useState('');
  const [addingCate, setAddingCate] = useState(false);
  useEffect(() => {
    if (treeData) {
      const data = _.cloneDeep(toJS(treeData));
      setData(
        data.map(item=>{
          item.showBtn = false;
          item.expand = defaultExpandAll;
          item.focus = false;
          item.adding = false;
          item.editing = false;
          item.children?item.children.map(item=>{
            item.showBtn = false;
            item.editing = false;
            return item;
          }):null;
          return item;
        })
      )
    }
  }, [treeData]);
  return <>
  <div style={{position:'relative'}}>
    {
      data.map((v,k)=>{
        return <div key={k+''}>
          <div 
            className={styles.firstLine+ ((selectedData.category===v.id && selectedData.subCategory==='')?(' '+styles.selected):'')}
            onClick={()=>{
              setCurPage(1);
              setSelectedData({
                category:v.id,
                subCategory:''
              })
            }}
          >
            <div style={{display:'flex',alignItems:'center'}}>
              <Icon 
                className={styles.expandBtn}
                type={v.expand?'caret-down':'caret-right'} 
                onClick={()=>{
                  setData(olddata=>{
                    return olddata.map((v1,k1)=>{
                      if (k1===k) {
                        v1.expand=!v1.expand;
                      }
                      return v1;
                    })
                  })
                }}
              />
              <span className={styles.firstTitle}>{v.name}</span>
            </div>
           
          </div>
          {v.children?v.children.map((v2,k2)=>{
            return <div
              key={k+'-'+k2}
              className={styles.secondLine + ((selectedData.category===v.id && selectedData.subCategory===v2.id)?(' '+styles.selected):'')}
              style={{display:v.expand?'flex':'none'}}
              onClick={()=>{
                setCurPage(1);
                setSelectedData({
                  category:v.id,
                  subCategory:v2.id
                })
              }}
            >
              <div>
             <span>{v2.name}</span>
              </div>
              <div className={styles.secondBtnWrap}>
                <Icon type="form" style={{display:v2.showBtn?'inline':'none'}}
                  onClick={(e)=>{
                    e.stopPropagation()
                    setEditName(v2.name)
                    setData(olddata=>{
                      return olddata.map((v1,k1)=>{
                        if (k1===k) {
                          v1.children.map((v3,k3)=>{
                            if (k2===k3) {
                              v3.editing = true;
                            }
                          })
                        }
                        return v1;
                      })
                    })
                    setTimeout(() => {
                      editInput.current.input.focus();
                    }, 0);
                  }}
                />
                
              </div>
            </div>
          }):null}
          {
            v.adding?<Input 
              ref={addinput}
              className={styles.addingInput}
              value={addCateName}
              onChange={(e)=>{setAddCateName(e.target.value)}}
              onBlur={(e)=>{
                setData(olddata=>{
                  return olddata.map((v1,k1)=>{
                    if (k1===k) {
                      v1.adding=false;
                    }
                    return v1;
                  })
                })
              }}
              onPressEnter={async (e)=>{
                const datas = _.cloneDeep(toJS(treeData));
                datas.map((v4,k4)=>{
                  if (k4===k) {
                    v4.children.push({name:addCateName})
                  }
                  return v4;
                })
                const res = await updateTreeDataService({categories:datas});
                if (res && res.code==0) {
                  setData(olddata=>{
                    return olddata.map((v1,k1)=>{
                      if (k1===k) {
                        v1.adding=false;
                      }
                      return v1;
                    })
                  })
                  getTreeData();
                  setAddCateName('');
                  message.success('添加成功！')
                }
                
              }}
            />:null
          }
        </div>
      })
    }
    <Input 
      ref={addCateRef}
      style={{display:addingCate?'block':'none'}}
      value={addCateName}
      onChange={(e)=>{
        setAddCateName(e.target.value);
      }}
      onBlur={()=>{
        setAddingCate(false);
      }}
      onPressEnter={async ()=>{
        const datas = _.cloneDeep(toJS(treeData));
        let has = false;
        datas.map(item=>{
          if (item.name===addCateName) {
            has = true;
          }
          return item;
        });
        if (has) {
          message.error('组件分类名称已存在，请修改！');
        }else{
          datas.push({name:addCateName,children:[]});
          const res = await updateTreeDataService({categories:datas});
          if (res && res.code==0) {
            setAddingCate(false);
            getTreeData();
            setAddCateName('');
          }
        }
        
      }}
    ></Input>
  </div>
  </>
})

export default HandleMenu;