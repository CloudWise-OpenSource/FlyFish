import React from 'react';
import { Icon,Input,message,Popconfirm,Popover } from 'antd';
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
  const [searchValue, setSearchValue] = useState('');

  const [addCateName, setAddCateName] = useState('');
  const [editName, setEditName] = useState('');
  const [addingCate, setAddingCate] = useState(false);
  useEffect(() => {
    if (treeData) {
      const data = _.cloneDeep(toJS(treeData));
      let rs = data.map(item=>{
        item.showBtn = false;
        item.expand = defaultExpandAll;
        item.focus = false;
        item.adding = false;
        item.editing = false;
        item.display = true;
        item.children?item.children.map(item=>{
          item.showBtn = false;
          item.editing = false;
          item.display = true;
          return item;
        }):null;
        return item;
      })
      setData(rs)
    }
  }, [treeData]);
  useEffect(() => {
    if (searchValue) {
      setData((state)=>{
        return state.map(item=>{
          item.display = item.name.includes(searchValue);
          if (item.children && item.children.length) {
            let has = false;
            item.children = item.children.map(item2=>{
              if (item2.name.includes(searchValue)) {
                has = true;
              }
              item2.display = item2.name.includes(searchValue);
              return item2;
            })
            if (has) {
              //有二级被搜到时，让一级也展示
              item.display = true;
            }
          }
          return item;
        })
      })
    }else{
      setData((state)=>{
        return state.map(item=>{
          item.display=true;
          if (item.children&& item.children.length) {
            item.children = item.children.map(item2=>{
              item2.display = true;
              return item2;
            })
          }
          return item;
        })
      })
    }
  }, [searchValue]);
  return <>
  <div className={styles.treeTitle}>
    组件列表
  </div>
  <div className={styles.searchWrap}>
    <Input placeholder='请输入搜索关键字' value={searchValue} suffix={<Icon type="search" />}
      onChange={(e)=>{
        setSearchValue(e.target.value);
      }}
    ></Input>
  </div>
  <div style={{position:'relative',height:'calc(100% - 105px)',overflowX:'hidden',overflowY:'auto'}}>
    {
      data.map((v,k)=>{
        return <div key={k+''}>
          <div 
            style={{display:v.display?'flex':'none'}}
            className={styles.firstLine+ ((selectedData.category===v.id && selectedData.subCategory==='')?(' '+styles.selected):'')}
            onMouseOver={()=>{
              setData(olddata=>{
                return olddata.map((v1,k1)=>{
                  v1.showBtn=(k1===k);
                  return v1;
                })
              })
            }}
            onMouseOut={()=>{
              setData(olddata=>{
                return olddata.map((v1,k1)=>{
                  v1.showBtn=false;
                  return v1;
                })
              })
            }}
            onClick={()=>{
              setCurPage(0);
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
                onClick={(e)=>{
                  e.stopPropagation()
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
              {
                v.editing?
                <Input
                  style={{height:28,marginLeft:0,width:120}}
                  ref={editInput}
                  className={styles.addingInput}
                  value={editName}
                  onChange={(e)=>{setEditName(e.target.value)}}
                  onBlur={(e)=>{
                    setData(olddata=>{
                      return olddata.map((v1,k1)=>{
                        if (k1===k) {
                          v1.editing=false;
                        }
                        return v1;
                      })
                    })
                  }}
                  onPressEnter={async (e)=>{
                    if (!editName) {
                      message.error('分类名称不能为空！')
                      return 
                    }
                    const datas = _.cloneDeep(toJS(treeData));
                    datas.map((v4,k4)=>{
                      if (k4===k) {
                        v4.name=editName
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
                      setEditName('');
                      message.success('修改成功！')
                    }else{
                      message.error(res.msg)
                    }
                    
                  }}
                >
                </Input>
                :<Popover content={v.name}>
                  <span className={styles.firstTitle}>{v.name}</span>
                </Popover>
              }
            </div>
            <div className={styles.firstBtnWrap} style={{display:v.editing?'none':'flex'}}>
              <Icon 
                type="plus-circle" 
                className={styles.addBtn}
                onClick={(e)=>{
                  e.stopPropagation()
                  setData(olddata=>{
                    return olddata.map((v1,k1)=>{
                      if (k1===k) {
                        v1.adding=true;
                      }
                      return v1;
                    })
                  })
                  setAddCateName('')
                  setTimeout(() => {
                    addinput.current.input.focus();
                  }, 0);
                }}
              />
              <Icon type="edit" style={{display:v.showBtn?'inline':'none'}}
                onClick={(e)=>{
                  e.stopPropagation()
                  setEditName(v.name)
                  setData(olddata=>{
                    return olddata.map((v1,k1)=>{
                      if (k1===k) {
                        v1.editing=true;
                      }
                      return v1;
                    })
                  })
                  setTimeout(() => {
                    editInput.current.input.focus();
                  }, 0);
                }}
              />
              <Popconfirm title='确定删除吗?'
                onClick={(e)=>{
                  e.stopPropagation()
                }}
                onCancel={(e)=>e.stopPropagation()}
                onConfirm={async (e)=>{
                  e.stopPropagation();
                  let has = false;
                  data.map((v3,k3)=>{
                    if (k3===k) {
                      const {children=[]}=v3;
                      if (children && children.length>0) {
                        has=true;
                      }
                    }
                    return v3;
                  })
                  if (has) {
                    message.warning('无法删除，该组件分类存在二级分类，请删除全部二级分类！')
                  }else{
                    const datas = treeData.filter((v3,k3)=>{
                      return k!==k3
                    })
                    const res = await updateTreeDataService({categories:datas});
                    if (res && res.code==0) {
                      getTreeData();
                      message.success('删除成功！')
                    }else{
                      message.error(res.msg)
                    }
                  }
                }}>
                <Icon type="delete"
                  style={{display:userInfo.isAdmin?(v.showBtn?'inline':'none'):'none'}}
                />
              </Popconfirm>
            </div>
          </div>
          {v.children?v.children.map((v2,k2)=>{
            return <div
              key={k+'-'+k2}
              className={styles.secondLine + ((selectedData.category===v.id && selectedData.subCategory===v2.id)?(' '+styles.selected):'')}
              style={{display:(v.expand&&v2.display)?'flex':'none'}}
              onMouseOver={()=>{
                setData(olddata=>{
                  return olddata.map((v1,k1)=>{
                    if (k1===k) {
                      v1.children.map((v3,k3)=>{
                        v3.showBtn=(k3===k2);
                        return v3;
                      })
                    }
                    return v1;
                  })
                })
              }}
              onMouseOut={()=>{
                setData(olddata=>{
                  return olddata.map((v1,k1)=>{
                    if (k1===k) {
                      v1.children.map((v3,k3)=>{
                        v3.showBtn=false;
                        return v3;
                      })
                    }
                    return v1;
                  })
                })
              }}
              onClick={()=>{
                setCurPage(0);
                setSelectedData({
                  category:v.id,
                  subCategory:v2.id
                })
              }}
            >
              <div style={{display:'flex'}}>
              {
                v2.editing?
                <Input
                  style={{height:28,marginLeft:0,width:120}}
                  ref={editInput}
                  className={styles.addingInput}
                  value={editName}
                  onChange={(e)=>{setEditName(e.target.value)}}
                  onBlur={(e)=>{
                    setData(olddata=>{
                      return olddata.map((v1,k1)=>{
                        if (k1===k) {
                          v1.children.map((v3,k3)=>{
                            if (k2===k3) {
                              v3.editing=false;
                            }
                          })
                        }
                        return v1;
                      })
                    })
                  }}
                  onPressEnter={async (e)=>{
                    if (!editName) {
                      message.error('分类名称不能为空！')
                      return 
                    }
                    const datas = _.cloneDeep(toJS(treeData));
                    datas.map((v4,k4)=>{
                      if (k4===k) {
                        v4.children.map((v5,k5)=>{
                          if (k5===k2) {
                            v5.name=editName
                          }
                        })
                      }
                      return v4;
                    })
                    const res = await updateTreeDataService({categories:datas});
                    if (res && res.code==0) {
                      setData(olddata=>{
                        return olddata.map((v1,k1)=>{
                          if (k1===k) {
                            v1.children.map((v3,k3)=>{
                              if (k2===k3) {
                                v3.editing=false;
                              }
                            })
                          }
                          return v1;
                        })
                      })
                      getTreeData();
                      setEditName('');
                      message.success('修改成功！')
                    }else{
                      message.error(res.msg)
                    }
                    
                  }}
                >
                </Input>
                :<Popover content={v2.name}>
                  <span className={styles.secondTitle}>{v2.name}</span>
                </Popover>
              }
              </div>
              <div className={styles.secondBtnWrap} style={{display:v2.editing?'none':'block'}}>
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
                <Popconfirm
                  title='确定要删除吗?'
                  onCancel={e=>e.stopPropagation()}
                  onConfirm={
                    async (e)=>{
                      e.stopPropagation()
                      const _treeData = _.cloneDeep(toJS(treeData));
                      const datas = _treeData.map((v3,k3)=>{
                        if (k3===k) {
                          v3.children = v3.children.filter((v4,k4)=>{
                            return k2!==k4;
                          })
                        }
                        return v3;
                      })
                      const res = await updateTreeDataService({categories:datas});
                      if (res && res.code==0) {
                        getTreeData();
                        message.success('删除成功!')
                      }else{
                        message.error(res.msg)
                      }
                    }
                  }
                >
                  <Icon type="delete" style={{display:userInfo.isAdmin?(v2.showBtn?'inline':'none'):'none'}}
                    onClick={(e)=>{
                      e.stopPropagation()
                    }}
                  />
                </Popconfirm>
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
                if (!addCateName) {
                  message.error('分类名称不能为空！')
                  return 
                }
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
                }else{
                  message.error(res.msg)
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
        if (!addCateName) {
          message.error('分类名称不能为空！')
          return 
        }
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
            message.success('添加成功!')
          }else{
            message.error(res.msg)
          }
        }
        
      }}
    ></Input>
  </div>
    <div className={styles.leftBigTitle}
      onClick={()=>{
        setAddingCate(true);
        setTimeout(() => {
          addCateRef.current.input.focus();
        }, 0);
      }}
    >
      <span style={{marginLeft:10}}>新增分类</span>
    </div>
  </>
})

export default HandleMenu;