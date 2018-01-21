import _ from 'lodash';

/*

{
  name: operationData,
  data: [eveyDayData],
}

everyDayData
{
  date: date,
  categories: {
    newClients: provincesDataList,
    activeClients: provincesDataList,
    totalWatchedTime: provincesDataList,
    countOfWhatedMedia: provincesDataList,
  }
}


provinceDataList:
  [province1Data, province2Data, ...]

  provinceData {
    provinceId: ,
    provinceName: ,
    dimensions: {
      application: [
        {appId: x, total: y},
        ...
      ],
      channel: [
        {channelId: x, total: y},
        ...
      ],
    },
}

*/

/* 200 - 233 */


const provinces = ['安徽',
  '澳门',
  '北京',
  '重庆',
  '福建',
  '甘肃',
  '广东',
  '广西',
  '贵州',
  '海南',
  '河北',
  '黑龙江',
  '河南',
  '湖北',
  '湖南',
  '江苏',
  '江西',
  '吉林',
  '辽宁省',
  '内蒙古',
  '宁夏',
  '青海', '山东',
  '上海', '陕西', '山西', '四川', '台湾', '天津', '香港', '新疆', '西藏', '云南', '浙江'];

const appIds = [1000, 1005, 1008, 1031, 1012];
const channelIds = [10000, 10005, 10008, 10031, 10012];
const dates = (() => {
  return _.times(30, n => (new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * n))).toLocaleDateString());
})();

const getFakeProvincesData = () => {
  const provincesData = [];
  for (let i = 200; i <= 233; i++) {
    const provinceData = {
      provinceId: i,
      provinceName: provinces[i - 200],
      dimensions: {
        application: _.map(appIds, (appId) => { return { appId, total: Math.floor(Math.random() * 10000) }; }),
        channel: _.map(channelIds, (channelId) => { return { channelId, total: Math.floor(Math.random() * 10000) }; }),
      },
    };

    provinceData.total = _.sumBy(provinceData.dimensions.application, appId => appId.value);

    provincesData.push(provinceData);
  }

  return provincesData;
};

const realGetFakeOperationData = () => {
  return {
    name: 'operationData',
    data: _.map(dates, (date) => {
      return {
        date,
        categories: {
          newClients: getFakeProvincesData(),
          activeClients: getFakeProvincesData(),
          totalWatchedTime: getFakeProvincesData(),
          countOfWhatedMedia: getFakeProvincesData(),
        },
      };
    }),
  };
};

const getFakeOperationData = realGetFakeOperationData();

export default {
  getFakeOperationData,
};
