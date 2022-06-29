import { toMobx, toJS } from '@chaoswise/cw-mobx';
import _ from "lodash";
import {
  getImportConfigService,
  getProjectsService,
  getComponentClassifyTreeDataService,
  reqApplicationList,
  getListDataService,
  checkLastImportResourceService,
  importComOrAppService,
  importVersionValidateService,
} from '../services';
import { message } from "@chaoswise/ui";

const model = {
  namespace: 'BatchImportExport',
  state: {
    componentOrApp: 'component', //选择导出组件或是应用
    selectedComponents: [], //导出资源配置页签选中组件
    selectedApp: [], //导出资源配置页签选中应用
    exportCheckboxData: ['componentRelease'], //导出配置checkbox选中配置数组
    exportRadioData: 'appOnly', //导出配置radio选中配置数组
    uploadSuccess: false, //文件上传成功
    importSelectedNum: 0, //导入配置列表选中项数量，用于导入配置底部展示和点击导入时的判断
    projectsData: [], //导入配置所属项目数据
    componentClassifyTreeData: [], //获取导入配置组件分类数据
    applicationList: [], //应用列表
    listData: [], //组件列表
    isUseLastImportSource: false, //是否存在上一次未导入资源包
    lastExportIsEnd: true, //上一次导出是否完成，决定点击导出资源跳转页面
    uploadFileName: '', //导入资源包名称
    importTableData: [], //导入组件时的数据
    isComponent: true, //导入资源包是组件还是应用
    selectedRows: [], //导入配置列表选中组件或应用
    importSuccess: false, //是否导入成功
    importSourceList: [], //导入失败列表数据
    isAppHasComponent: false,//导入应用下是否有组件
    previouStepFlag:true,//导入应用时展示列表判断
    comsInAppTableData:[],//导入应用下有组件时组件列表数据
    importFailedMsg:''
  },
  effects: {
    //获取导入组件或应用解压后数据
    *getImportConfig(params = {}) {
      let options = {
        key: this.uploadFileName,
      };
      const res = yield getImportConfigService(options);
      if(res.code === 0){
        if (res.data.type === 'component') {
          res.data.components.map((item,index) => {
            item.versionFlag = '';
            item.versionValidateMes = '';
            item.versionEdit = false
            item.key = index;
            if(!(item.update && item.type === 'project' && !item.projects && !item.projectsName)){
              item.projects = [];
              item.projectsName = [];
            }
            if(!item.update){
              item.type = 'common'
              item.projects = [];
              item.projectsName = [];
            }
            if(item.subCategory == null || !item.updata){
              item.category = '19700101';
              item.categoryName = '待分类';
              item.subCategory = '197001010';
            }
          });
          this.setImportTableData(res.data.components);
          this.setIsComponent(true);
        } else {
          res.data.applications.map((appItem,index1) => {
            if(appItem.components != null){
              appItem.components.map((comItem,index2) => {
                comItem.versionFlag = '';
                comItem.versionValidateMes = '';
                comItem.versionEdit = false
                comItem.key = appItem.id + comItem.id;
                if(!(comItem.update && comItem.type === 'project' && !comItem.projects && !comItem.projectsName)){
                  comItem.projects = [];
                  comItem.projectsName = [];
                }
                if(!comItem.update){
                  comItem.type = 'common'
                  comItem.projects = [];
                  comItem.projectsName = [];
                }
                if(comItem.subCategory == null || !comItem.updata){
                  comItem.category = '19700101';
                  comItem.categoryName = '待分类';
                  comItem.subCategory = '197001010';
                }
              });
            }
          });
          this.setImportTableData(res.data.applications);
          this.setIsComponent(false);
          res.data.applications.forEach(item => {
            if(item.components !== null){
              this.setIsAppHasComponent(true);
            }
          });
        }
      } else {
        message.error(res.msg);
      }
    },

    //获取导入配置所属项目数据
    *getProjectsData() {
      const res = yield getProjectsService();
      if (res && res.data) {
        this.setProjectsData(res.data.list);
      }
    },
    //获取导入配置组件分类数据
    *getComponentClassifyTreeData() {
      const res = yield getComponentClassifyTreeDataService();
      this.setComponentClassifyTreeData(res.data);
    },
    // 获取项目列表数据
    *getApplicationList(params = {}) {
      // 处理参数
      let options = {
        ...params,
      };
      // 请求数据
      const res = yield reqApplicationList(options);
      this.setApplicationList(res);
    },
    //获取组件分类下组件列表
    *getListData(params = {}) {
      const param = {
        subCategory: params.subCategory,
        pageSize:params.pageSize,
      };
      const res = yield getListDataService(param);
      this.setListData(res.data.list);
    },
    //获取是否有上次导入未上传资源
    *checkLastImportResource() {
      const res = yield checkLastImportResourceService();
      this.setIsUseLastImportSource(res.data.exist);
      this.setUploadFileName(res.data.fileName.replace('.zip', ''));
    },
    //导入配置列表选中组件或应用
    *importComOrApp(params) {
      let importType;
      let param = {};
      if (this.isComponent) {
        importType = 'component';
        param = {
          key: this.uploadFileName,
          importType: importType,
          components: params,
        };
      } else {
        importType = 'application';
        param = {
          key: this.uploadFileName,
          importType: importType,
          applications: params,
        };
      }
      const res = yield importComOrAppService(param);
      this.setImportSuccess(res.msg);
      if(res.data){
        if ( res.data.type === 'component' && res.data.componentImportFailed.length > 0 ) {
          this.setImportSourceList(res.data.componentImportFailed);
        } else if ( res.data.type === 'application' && res.data.applicationImportFailed.length > 0 ) {
          this.setImportSourceList(res.data.applicationImportFailed);
        }
      } else {
        this.setImportFailedMsg(res.msg)
      }
    },
    *getVersionValidate(params) {
      let param = {};
      param = {
        id:params.id,
        version:params.version
      };
      const res = yield importVersionValidateService(param);
      if(res.code === 0){
        if(this.isComponent){
          if(res.data){
            let newData = _.cloneDeep(toJS(this.importTableData));
            newData.forEach(item => {
              if(item.id === param.id){
                item.versionFlag = 'error';
                item.versionValidateMes = '不可跟组件已有版本重复';
              }
            });
            this.setImportTableData(newData);
            if(this.selectedRows.some(item => item.id === param.id)){
              let selectedRowsCopy = _.cloneDeep(toJS(this.selectedRows));
              selectedRowsCopy.forEach(item => {
                if(item.id === param.id){
                  item.versionFlag = 'error';
                  item.versionValidateMes = '不可跟组件已有版本重复';
                }
              });
              this.setSelectedRows(selectedRowsCopy);
            }
          } else {
            let newData = _.cloneDeep(toJS(this.importTableData));
            newData.forEach(item => {
              if(item.id === param.id){
                item.versionFlag = '';
                item.version = params.version;
                item.versionValidateMes = '';
                item.versionEdit = true
              }
            });
            this.setImportTableData(newData);
            if(this.selectedRows.some(item => item.id === param.id)){
              let selectedRowsCopy = _.cloneDeep(toJS(this.selectedRows));
              selectedRowsCopy.forEach(item => {
                if(item.id === param.id){
                  item.versionFlag = '';
                  item.version = params.version;
                  item.versionValidateMes = '';
                  item.versionEdit = true
                }
              });
              this.setSelectedRows(selectedRowsCopy);
            }
          }
        } else {
          if(res.data){
            let newData = _.cloneDeep(toJS(this.importTableData))
            let newComsInAppTableData = _.cloneDeep(toJS(this.comsInAppTableData))
            newData.forEach(item => {
              item.components.forEach(element => {
                if(element.id === param.id){
                  element.versionFlag = 'error'
                  element.versionValidateMes = '不可跟组件已有版本重复'
                }
              });
            });
            newComsInAppTableData.forEach(item => {
              if(item.id === param.id){
                item.versionFlag = 'error'
                item.versionValidateMes = '不可跟组件已有版本重复'
              }
            });
              let selectedRowsCopy = _.cloneDeep(toJS(this.selectedRows));
              selectedRowsCopy.forEach(item => {
                item.components.forEach(element => {
                  if(element.id === param.id){
                    element.versionFlag = 'error'
                    element.versionValidateMes = '不可跟组件已有版本重复'
                  }
                });
              });
              this.setSelectedRows(selectedRowsCopy);
            this.setImportTableData(newData)
            this.setComsInAppTableData(newComsInAppTableData)
          } else {
            let newData = _.cloneDeep(toJS(this.importTableData))
            let newComsInAppTableData = _.cloneDeep(toJS(this.comsInAppTableData))
            newData.forEach(item => {
              item.components.forEach(element => {
                if(element.id === param.id){
                  element.versionFlag = ''
                  element.version = params.version
                  element.versionValidateMes = ''
                  element.versionEdit = true
                }
              });
            });
            newComsInAppTableData.forEach(item => {
              if(item.id === param.id){
                item.versionFlag = ''
                item.version = params.version
                item.versionValidateMes = ''
                item.versionEdit = true
              }
            });
            let selectedRowsCopy = _.cloneDeep(toJS(this.selectedRows));
            selectedRowsCopy.forEach(item => {
              item.components.forEach(element => {
                if(element.id === param.id){
                  element.versionFlag = ''
                  element.version = params.version
                  element.versionValidateMes = ''
                  element.versionEdit = true
                }
              });
            });
            this.setSelectedRows(selectedRowsCopy);
            this.setImportTableData(newData)
            this.setComsInAppTableData(newComsInAppTableData)
          }
        }
      }
    }
  },
  reducers: {
    setSelectedComponents(res) {
      this.selectedComponents = res;
    },
    setComponentOrApp(res) {
      this.componentOrApp = res;
    },
    setSelectedApp(res) {
      this.selectedApp = res;
    },
    setExportCheckboxData(res) {
      this.exportCheckboxData = res;
    },
    setExportRadioData(res) {
      this.exportRadioData = res;
    },
    setImportSelectedNum(res) {
      this.importSelectedNum = res;
    },
    setImportTableData(res) {
      this.importTableData = res;
    },
    setProjectsData(res) {
      this.projectsData = res;
    },
    setComponentClassifyTreeData(res) {
      this.componentClassifyTreeData = res;
    },
    setApplicationList(res) {
      this.applicationList = res.data.list;
    },
    setListData(res) {
      this.listData = res;
    },
    setIsUseLastImportSource(res) {
      this.isUseLastImportSource = res;
    },
    setLastExportIsEnd(res) {
      this.lastExportIsEnd = res;
    },
    setUploadFileName(res) {
      this.uploadFileName = res;
    },
    setIsComponent(res) {
      this.isComponent = res;
    },
    setUploadSuccess(res) {
      this.uploadSuccess = res;
    },
    setSelectedRows(res) {
      this.selectedRows = res;
    },
    setImportSuccess(res) {
      this.importSuccess = res;
    },
    setImportSourceList(res) {
      this.importSourceList = res;
    },
    setIsAppHasComponent(res) {
      this.isAppHasComponent = res;
    },
    setPreviouStepFlag(res) {
      this.previouStepFlag = res;
    },
    setComsInAppTableData(res) {
      this.comsInAppTableData = res;
    },
    setImportFailedMsg(res) {
      this.importFailedMsg = res;
    },
  },
};

export default toMobx(model);
