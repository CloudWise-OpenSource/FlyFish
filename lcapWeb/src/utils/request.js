import * as request from '@chaoswise/request';

const {
  initRequest,
  fetchGet,
  fetchPut,
  fetchDelete,
  fetchPost,
  upload,
  downloadFile,
  formateResponse,
} = request;

// 初始化mock数据
const getMockData = () => {
  const mockData = [];
  const mockPaths = require.context('@/_MOCK_', true, /\.js$/);
  mockPaths.keys().forEach(mockPath => {
    const mockRes = require(`@/_MOCK_/${mockPath.replace(/\.\//, '')}`).default;

    // 非约定式不处理（自定义参数等）
    if (!mockRes || typeof mockRes !== 'object') {
      return;
    }

    // 处理约定式
    Object.entries(mockRes).forEach(([mockKey, mockValue]) => {
      const [_mockKey, mockUrl] = mockKey.split(' ');
      const method = `on${_mockKey.charAt(0).toUpperCase()}${_mockKey.slice(1).toLocaleLowerCase()}`;
      mockData.push({
        method,
        url: mockUrl,
        res: mockValue
      });
    });

  });
  return mockData;
};

initRequest({
  config: {
    // 请求错误码回调
    statusCallback: {
      '1001': (res) => {
        console.log('符合u好',res);
      },
      '403': () => {

      }
    },
    // 是否启用mock数据 false 关闭 true 开启
    useMock: true,
    // mock延迟mm
    delayResponse: 500,
    // 统一处理请求
    // eslint-disable-next-line no-unused-vars
    handleResponse: (res, error) => {
      if (error) {
        if (error.response) {
          console.log('error.response====',error.response);
          window.location.href = error.response.headers.location;
        }
      } else {
        // 响应处理
      }
    },
    // 是否开启登陆验证 false 关闭 true 开启(统一处理401登出逻辑)
    checkLogin: false,
    // restapi: sso登出校验地址
    restapi: '', // 默认为 error.response.config.url 设置后以设置为准
  },
  // 请求头的配置文件
  defaults: {
    // 请求的基础域名
    baseURL: "",
  },
  // mock模拟请求接口数组
  mock: getMockData()
});

export default request;

export {
  fetchGet,
  fetchPut,
  fetchDelete,
  fetchPost,
  upload,
  downloadFile,
  formateResponse,
};
