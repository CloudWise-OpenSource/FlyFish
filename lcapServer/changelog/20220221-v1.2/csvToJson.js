'use strict';

const fs = require('fs');
const _ = require('lodash');

const path = process.argv[2];
const paths = path.split('/');
const fileName = paths[paths.length - 1];
const args = fileName.split('.');
const modelName = args[0];
const savePath = `./20220221-v1.2/json/${modelName}.json`;

const exportJson = {
  id: `${modelName}_metric`,
  param: [],
  content: [
    {
      modelId: `${modelName}-node`,
      name: `${modelName}-install`,
      type: '2D',
    },
  ],
};

const metrics = [
  {
    componentId: '6220579b706a880c8d848c54',
    desc: '筛选框',
    key: [],
    name: '筛选框',
    unit: '-',
    location: {
      x: 32,
      y: 15,
      width: 1360,
      height: 60,
    },
    dataSource: {
      type: 'json',
      config: { mapping: {} },
      options: {
        customOptions: { a: 'b' },
      },
    },
  },
];

(async () => {
  try {
    let metricIndex = 1;
    let prevLocation = {};
    const csvStr = fs.readFileSync(path),
      WIDTH = 220,
      HEIGHT = 216,
      INTERVAL = 8,
      INIT_X = 32,
      INIT_Y = 90;

    for (const metric of csvStr.toString().split('\n')) {
      console.log(metric);
      const [ , metricKey, , , unit, , componentType, locationStr, , isCal ] = metric.split(',');
      if (!locationStr) continue;
      const { componentId, transferDataFunc, genMetricKey } = getComponentInfo(unit, isCal === '需计算', metricKey, modelName, componentType);
      if (_.isEmpty(componentId)) {
        console.log(`${componentType}未匹配到component!`);
      }
      metrics[0].key.push(metricKey);

      const isDouble = locationStr.split('、').length === 2;
      let curLocation = {};
      if (metricIndex === 1) {
        curLocation = {
          x: INIT_X,
          y: INIT_Y,
          width: isDouble ? 448 : WIDTH,
          height: HEIGHT,
          row: 1,
        };
      } else {
        const prevIsRowLast = (prevLocation.x + prevLocation.width) === 1392;
        const curRow = prevIsRowLast ? prevLocation.row + 1 : prevLocation.row;

        curLocation = {
          x: prevIsRowLast ? INIT_X : prevLocation.x + prevLocation.width + INTERVAL,
          y: (curRow - 1) === 0 ? INIT_Y : prevIsRowLast ? prevLocation.y + prevLocation.height + INTERVAL : prevLocation.y,
          width: isDouble ? (WIDTH + INTERVAL / 2) * 2 : WIDTH,
          height: HEIGHT,
          row: curRow,
        };
      }

      metrics.push({
        componentId,
        key: metricKey,
        name: metricKey,
        unit: unit !== '-天-小时-分' ? unit : '',
        location: {
          x: curLocation.x,
          y: curLocation.y,
          width: curLocation.width,
          height: curLocation.height,
        },
        dataSource: {
          type: `custom_${componentId}`,
          options: {
            json: '',
            customOptions: {
              dataInterface: 'check',
              method: 'POST',
              interval: 0,
              vars: genMetricKey,
              apiSuccessCode: 100000,
              apiSuccessCodeField: 'code',
              getDataField: 'data',
              transferDataFunc,
            },
          },
          config: { mapping: {} },
        },
      });

      prevLocation = curLocation;
      metricIndex++;
    }

    exportJson.content[0].width = 1424;
    exportJson.content[0].height = prevLocation.y + HEIGHT + 30;
    exportJson.content[0].metrics = metrics;
    fs.writeFileSync(savePath, JSON.stringify(exportJson));
  } catch (error) {
    console.log(error.stack || error);
  } finally {
    console.log('export success~~');
    process.exit(0);
  }
})();

function getComponentInfo(unit, isCal, metricKey, modelName, type) {
  const componentInfo = {};

  if (isCal) {
    componentInfo.genMetricKey = `{\n"endTime": 1745597554097,\n"metricInfos": [\n{\n"metricDimensions": [\n{\n"basicConditionConfig": [],\n"dimensionLogic": "AND"\n}\n],\n"metricAggregateFunction": "rate",\n"interval": 120000,\n"metricKey": "${metricKey}"\n}\n],\n"sorts": [],\n"startTime": 0 \n}`;
  } else {
    componentInfo.genMetricKey = `{\n"endTime": 1745597554097,\n"metricInfos": [\n{\n"metricDimensions": [\n{\n"basicConditionConfig": [],\n"dimensionLogic": "AND"\n}\n],\n"metricKey": "${metricKey}"\n}\n],\n"sorts": [],\n"startTime": 0 \n}`;
  }

  switch (type) {
    case '折线图':
      componentInfo.componentId = '621f50c0dcf05e50da3e2993';
      componentInfo.transferDataFunc = "function transferData(data) { \nif(data[0] && data[0].values && data[0].values.length && data[0].values[0].list && data[0].values[0].list.length){\nreturn {\ndatas:data[0].values.map(item=>{\nlet label = '';\nfor(var key in item.metricTags){\nlabel += '|'+key+':'+item.metricTags[key]\n}\nif(label.startsWith('|')){\nlabel = label.substring(1,label.length)\n}\nreturn {\nlatitudeKey: label, \nlatitudeValue: '', \nlist:item.list\n}\n})\n}\n}\nreturn { datas:[] }; \n}";
      break;
    case '折线面积图':
      componentInfo.componentId = '621f50b59a022d50d06a9b22';
      componentInfo.transferDataFunc = "function transferData(data) { \nif(data[0] && data[0].values && data[0].values.length && data[0].values[0].list && data[0].values[0].list.length){\nreturn {\ndatas:data[0].values.map(item=>{\nlet label = '';\nfor(var key in item.metricTags){\nlabel += '|'+key+':'+item.metricTags[key]\n}\nif(label.startsWith('|')){\nlabel = label.substring(1,label.length)\n}\nreturn {\nlatitudeKey: label, \nlatitudeValue: '', \nlist:item.list\n}\n})\n}\n}\nreturn { datas:[] }; \n}";
      break;
    case '仪表盘':
      componentInfo.componentId = '621f073c9e4dfc1d05272e47';
      componentInfo.transferDataFunc = 'function transferData(data) { \nif(data[0] && data[0].values && data[0].values.length && data[0].values[0].list && data[0].values[0].list.length){\nreturn {\nvalue:data[0].values[0].list[0][1]\n};\n}\nreturn {value:0};\n}';
      break;
    case '数字看板':
      componentInfo.componentId = '621f50991e459250c9cb36d3';
      if (modelName === 'elasticsearch' && metricKey === 'elasticsearch.cluster_status') {
        componentInfo.transferDataFunc = "function transferData(data) { \nif(data[0] && data[0].values && data[0].values.length && data[0].values[0].list && data[0].values[0].list.length){\nlet value = data[0].values[0].list[0][1];\nconst enums = {\n'0':'红色',\n'1':'黄色',\n'2':'绿色'\n};\nvalue = enums[value+''];\nreturn { value };\n}\nreturn {value:'--'};\n}";
      } else if (modelName === 'etcd' && metricKey === 'etcd.server.has_leader') {
        componentInfo.transferDataFunc = "function transferData(data) { \nif(data[0] && data[0].values && data[0].values.length && data[0].values[0].list && data[0].values[0].list.length){\nlet value = data[0].values[0].list[0][1];\nconst enums = {\n'0':'不存在',\n'1':'存在'\n};\nvalue = enums[value+''];\nreturn { value };\n}\nreturn {value:'--'};\n}";
      } else {
        if (unit === '-天-小时-分') {
          componentInfo.transferDataFunc = "function transferData(data) {\nif (data[0] && data[0].values && data[0].values.length && data[0].values[0].list && data[0].values[0].list.length) {\nconst val = data[0].values[0].list[0][1];\n  const days = Math.floor(val / 60 / 60 / 24);\n  const hours = Math.floor((val / 60 / 60) % 24);\n  const mins = Math.floor((val / 60) % 60);\n  const secounds = Math.floor(val % 60);\n  return {\nvalue: days + '天' + hours + '时' + mins + '分' + secounds + '秒'\n  };\n}\nreturn { value: 0 };\n  }";
        } else {
          componentInfo.transferDataFunc = "function transferData(data) { \nif(data[0] && data[0].values && data[0].values.length && data[0].values[0].list && data[0].values[0].list.length){\nconst val = data[0].values[0].list[0][1];\nreturn {\nvalue:val\n};\n// const days = Math.floor(val / 60 / 60 / 24);\n// const hours = Math.floor((val / 60 / 60) % 24);\n// const mins = Math.floor((val / 60) % 60);\n// const secounds = Math.floor(val % 60);\n// return {\n//     value:days+'天'+hours+'时'+mins+'分'+secounds+'秒';\n// }\n}\nreturn {value:0};\n}";
        }
      }
      break;
    case '水波球':
      componentInfo.componentId = '621f503d24711450b214c39d';
      componentInfo.transferDataFunc = 'function transferData(data) { \nif(data[0] && data[0].values && data[0].values.length && data[0].values[0].list && data[0].values[0].list.length){\nreturn {\nvalue:data[0].values[0].list[0][1]\n};\n}\nreturn {value:0};\n}';
      break;
    case '线图看板':
      componentInfo.componentId = '621f50a6e917ee50e1759f65';
      componentInfo.transferDataFunc = 'function transferData(data) { \nif(data[0] && data[0].values && data[0].values.length && data[0].values[0].list && data[0].values[0].list.length){\nreturn {\nvalue:data[0].values[0].list[0][1]\n};\n}\nreturn {value:0};\n}';
      break;
    default:
      break;
  }
  return componentInfo;
}
