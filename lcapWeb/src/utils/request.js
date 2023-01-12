/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2022-09-02 17:40:09
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-09-23 11:41:11
 */
import * as request from '@chaoswise/request';
import { message } from '@chaoswise/ui';
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
  mockPaths.keys().forEach((mockPath) => {
    const mockRes = require(`@/_MOCK_/${mockPath.replace(/\.\//, '')}`).default;

    // 非约定式不处理（自定义参数等）
    if (!mockRes || typeof mockRes !== 'object') {
      return;
    }

    // 处理约定式
    Object.entries(mockRes).forEach(([mockKey, mockValue]) => {
      const [_mockKey, mockUrl] = mockKey.split(' ');
      const method = `on${_mockKey.charAt(0).toUpperCase()}${_mockKey
        .slice(1)
        .toLocaleLowerCase()}`;
      mockData.push({
        method,
        url: mockUrl,
        res: mockValue,
      });
    });
  });
  return mockData;
};

initRequest({
  config: {
    // 请求错误码回调
    statusCallback: {
      1001: (res) => {},
      401: (res) => {
        window.location.replace('/#login');
      },
      404: (error) => {
        if (error) {
          message.error('接口未找到,请重试!');
        }
      },
    },
    // 是否启用mock数据 false 关闭 true 开启
    useMock: true,
    // mock延迟mm
    delayResponse: 500,
    handleResponse: (res, error) => {
      if (
        error &&
        error.response &&
        ![200, 401, 404].includes(error.response.status)
      ) {
        message.error(error.response?.data?.msg || '接口请求失败,请重试!');
      }
    },
    // 统一处理请求
    // eslint-disable-next-line no-unused-vars
    // 是否开启登陆验证 false 关闭 true 开启(统一处理401登出逻辑)
    checkLogin: false,
    // restapi: sso登出校验地址
    restapi: '', // 默认为 error.response.config.url 设置后以设置为准
  },
  // 请求头的配置文件
  defaults: {
    // 请求的基础域名
    baseURL: '',
  },
  // mock模拟请求接口数组
  mock: getMockData(),
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
