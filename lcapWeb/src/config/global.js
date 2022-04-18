export const successCode = 0;
// 组件状态
export const EnumScreenStatus = {
    developing: {
        label: '开发中',
        value: 0
    },
    testing: {
        label: '测试中',
        value: 1
    },
    complete: {
        label: '已交付',
        value: 2
    }
};
// 组件类型
export const COMPONENT_TYPE = {
    COMMON: 'common', // 公共组件
    PROJECT: 'project', // 项目组件
  };
  
  // 组件开发状态
  export const COMPONENT_DEVELOP_STATUS = {
    DOING: 'doing', // 开发中
    ONLINE: 'online', // 已上线
  };
  
  // 可用状态
  export const COMMON_STATUS = {
    VALID: 'valid', // 可用的
    INVALID: 'invalid', // 不可用的
  };
  
  export const TAG_COLORS = [
    {
        id:'doing',
        color:'#f50'
      },{
        id:'testing',
        color:'#2db7f5'
      },{
        id:'delivered',
        color:'#87d068'
      },{
        id:'demo',
        color:'#BEBEBE'
      }
  ];
  export const APP_DEVELOP_STATUS = [
    {
        id:'doing',
        name:'开发中'
      },{
        id:'testing',
        name:'测试中'
      },{
        id:'delivered',
        name:'已交付'
      },{
        id:'demo',
        name:'Demo'
      }
  ];
  
  export const ROLE = {
    ADMIN: '管理员',
    MEMBER: '成员',
  };
export const formatDate = (datetime) => {
    var date = new Date(datetime);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var year = date.getFullYear(),
        month = ("0" + (date.getMonth() + 1)).slice(-2),
        sdate = ("0" + date.getDate()).slice(-2),
        hour = ("0" + date.getHours()).slice(-2),
        minute = ("0" + date.getMinutes()).slice(-2),
        second = ("0" + date.getSeconds()).slice(-2);
    var result = year + "." + month + "." + sdate + " " + hour + ":" + minute + ":" + second;
    return result;
};