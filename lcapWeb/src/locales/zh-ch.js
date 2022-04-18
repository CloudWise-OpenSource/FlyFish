import { flattenMessages } from "./utils";

export default flattenMessages({
  common: {
    save: "保存",
    cancel: "取消",
    create: "添加",
    edit: "编辑",
    editDetail: "编辑信息",
    delete: "删除",
    ok: "确定",
    disable:'禁用',
    deactivate:'停用',
    recovery:'恢复',
    download: "下载",
    all: "全部",
    export: "导出",
    import: "导入",
    actions: "操作",
    pleaseInput: "请输入",
    pleaseUpload: "请上传",
    pleaseSelect: "请选择",
    saveError: "保存失败，请稍后重试！",
    saveSuccess: "保存成功！",
    disableSuccess: "禁用成功！",
    disableError: "禁用失败，请稍后重试！",
    recoverySuccess:'恢复成功！',
    recoveryError:'恢复失败，请稍后重试！',
    addError: "新增失败，请稍后重试！",
    addSuccess: "新增成功！",
    reductionSuccess:'还原成功！',
    reductionError: "还原失败，请稍后重试！",
    deleteError: "删除失败，请稍后重试！",
    deleteSuccess: "删除成功！",
    changeSuccess:'编辑成功！',
    changeError:"编辑失败，请稍后重试！",
    copySuccess:'复制成功!',
    useSuccess:'创建成功!',
    useError:"创建失败，请稍后重试！",
    copyError:"复制失败，请稍后重试！",
    exportError:"导出失败，请稍后重试！",
    loadDataError: "加载{name}失败，请稍后重试！",
    recommendSuccess:'推荐成功!',
    recommendError:'推荐失败,请稍后重试！',
    noRecommendSuccess:'取消推荐成功!',
    noRecommendError:'取消推荐失败,请稍后重试！'
  },
  business: {},
  components: {},
  pages: {
    apiManage:{
      create: "新建",
      edit:'编辑应用',
      createOne:'创建应用',
      searchInputName:'按名称搜索',
      searchInputAppkey:'按appKey搜索',
      searchInputTime:'按有效期搜素',
      changeTime:'编辑有效期',
    },
    projectManage: {
      create: "新增",
      edit: "编辑项目",
      goToProject: "进入项目",
      searchInputPlaceholder: "输入项目名称/行业/描述进行查询",
      searchInputTag:'选择标签进行查询'
    },
    applyDevelop: {
      create: "添加应用",
      reset:'还原应用',
      copy:'复制应用',
      edit: "编辑应用",
      use:'使用模板',
      goToProject: "进入应用",
      searchInputPlaceholder:'选择应用类型进行查询',
      searchInputDevelopmentState: "选择开发状态进行查询",
      searchSelectProgressName:'选择项目名称进行查询',
      searchInputAppName:'输入应用名称进行查询',
      searchInputApplyLabel:'选择应用标签进行查询'
    },
    projectDetailDevelop:{
      searchInputKey:'输入组件名称/描述查找组件',
      selectTags:'输入组件标签进行查询',
      search:'搜索'
    },
    applyTemplate:{ 
      trade:'选择行业进行查询',
      applyName:'选择应用名称进行查询',
      name:'输入组件名称/描述/查找组件',
      searchInputApplyLabel:'选择应用标签进行查询',
      searchtype:'选择组件类别进行查询'

    },
    userManage: {
      create: "添加用户",
      edit: "编辑用户",
      configurePermissions:"配置权限",
      searchInputUsername:"输入用户名进行查询",
      searchInputEmail: "输入邮箱进行查询",
      searchInputproject: "选择所属项目进行查询",
      searchInputstate:"选择状态进行查询"
    },
    roleManage:{
      create: "添加角色",
      edit: "编辑角色",
      member:"成员列表",
      role:'权限配置',
      searchInputRoleName:'选择角色名进行查询'
    }
  },
  columns: {
    projectManage: {},
  },
});
