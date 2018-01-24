import _ from 'lodash';
import moment from 'moment';
import { queryCIBNOperationData } from '../services/api';

const allChannels = [
  '10000',
  '10022',
  '20000',
  '20001',
  '20002',
  '20003',
  '20004',
  '20005',
  '20006',
  '20007',
  '20011',
  '20014',
  '20015',
  '20016',
  '20017',
  '20018',
  '20019',
  '20020',
  '20021',
  '20026',
  '20028',
  '20029',
  '20032',
  '20033',
  '20037',
  '20040',
  '20041',
  '20042',
  '20043',
  '20044',
  '20045',
  '20050',
  '20052',
  '20053',
  '20054',
  '20055',
  '20056',
  '20057',
  '20058',
  '20061',
  '20063',
  '20066',
  '20067',
  '20069',
  '20071',
  '20074',
  '20076',
  '20077',
  '20079',
  '20083',
  '20084',
  '20087',
  '20088',
  '20092',
  '20093',
  '20094',
  '20095',
  '20096',
  '20110',
  '20111',
  '20112',
  '20115',
  '20116',
  '20118',
  '20121',
  '20126',
  '20128',
  '20132',
  '20133',
  '20134',
];

const allAppIds = ['1000', '1008', '1012', '1015'];

const calculateProvinceTotal = (provinceData, filterBy = 'channel', filter = null) => {
  return _.sumBy(provinceData.dimensions[filterBy], (eachApp) => {
    if (!_.isNull(filter) && (Number(filter.filterValue) > 0 && Number(filter.filterValue) !== Number(filterBy === 'application' ? eachApp.appId : eachApp.channelId))) {
      return 0;
    }

    return eachApp.total;
  });
};

const calculateCountryTotal = (provincesData) => {
  return _.sumBy(provincesData, eachProvince => calculateProvinceTotal(eachProvince));
};

const getProvinceMapData = (rawData, provinceFilter) => _.reduce(rawData, (memo, everyDayData) => {
  // const currentDataDate = new Date(everyDayData.date);

  // if (currentDataDate < provinceFilter.dateRange[0] || currentDataDate > provinceFilter.dateRange[1]) {
  //   return memo;
  // }

  if (!provinceFilter.date.isSame(everyDayData.date, 'day')) {
    return memo;
  }

  _.each(everyDayData.categories.newClients, (eachProvince) => {
    const memoItem = _.find(memo, provinceMemo => provinceMemo.title === eachProvince.provinceName);

    if (memoItem) {
      memoItem.total += calculateProvinceTotal(eachProvince, provinceFilter.filterBy === 'app' ? 'application' : 'channel', provinceFilter);
    } else {
      const theTotal = calculateProvinceTotal(eachProvince, provinceFilter.filterBy === 'app' ? 'application' : 'channel', provinceFilter);
      memo.push({ title: eachProvince.provinceName, name: eachProvince.provinceName, total: theTotal, value: theTotal });
    }
  });

  return memo;
}, []);

const generateTrendAndTop10 = (operationData, categoryName) => {
  const theTrend = _.map(operationData.data, (everyDayData) => {
    return {
      x: everyDayData.date,
      y: calculateCountryTotal(everyDayData.categories[categoryName]),
    };
  });

  const theProvince = _.reduce(operationData.data, (memo, everyDayData) => {
    _.each(everyDayData.categories[categoryName], (eachProvince) => {
      const memoItem = _.find(memo, provinceMemo => provinceMemo.title === eachProvince.provinceName);
      if (memoItem) {
        memoItem.total += calculateProvinceTotal(eachProvince);
      } else {
        const theTotal = calculateProvinceTotal(eachProvince);
        memo.push({ title: eachProvince.provinceName, name: eachProvince.provinceName, total: theTotal, value: theTotal });
      }
    });

    return memo;
  }, []);

  const theProvinceTop10 = _.chain(theProvince).sortBy(province => -province.total).slice(0, 10).value();

  return [theTrend, theProvince, theProvinceTop10];
};

const defaultProvinceFilter =  {
  allAppIds,
  allChannels,
  filterBy: 'app',
  filterValue: '0',
  date: moment(),
  disabledDate: () => true,
};

const generateDataForView = (operationData) => {
  const [newDeviceTrend, provinceND, provinceNDTop10] = generateTrendAndTop10(operationData, 'newClients');
  const [activeDeviceTrend, provinceAD, provinceADTop10] = generateTrendAndTop10(operationData, 'activeClients');
  const [totalWatchTimeTrend, provinceTWT, provinceTWTTop10] = generateTrendAndTop10(operationData, 'totalWatchedTime');
  const [totalNumberOfWatchedMediaTrend, provinceTNWM, provinceTNWMTop10] = generateTrendAndTop10(operationData, 'countOfWhatchedMedia');

  const provinceAggregratedData = {
    newClients: provinceND,
    activeClients: provinceAD,
    totalWatchedTime: provinceTWT,
    countOfWhatchedMedia: provinceTNWM,
  };

  return {
    newDeviceTrend,
    provinceNDTop10,
    activeDeviceTrend,
    provinceADTop10,
    totalWatchTimeTrend,
    provinceTWTTop10,
    totalNumberOfWatchedMediaTrend,
    provinceTNWMTop10,
    provinceAggregratedData,
  };
};

export default {
  namespace: 'operationData',

  state: {
    newDeviceTrend: [],
    provinceNDTop10: [],
    activeDeviceTrend: [],
    provinceADTop10: [],
    totalWatchTimeTrend: [],
    provinceTWTTop10: [],
    totalNumberOfWatchedMediaTrend: [],
    provinceTNWMTop10: [],
    provinceAggregratedData: {
      newClient: [],
      activeClient: [],
      totalWatchedTime: [],
      countOfWhatchedMedia: [],
    },
    loading: false,
    provinceMapData: [],
    provinceFilter: defaultProvinceFilter,
  },

  effects: {
    *fetchOperationData(_, { call, put }) {
      const operationData = yield call(queryCIBNOperationData);
      const operationDateForView = yield generateDataForView(operationData);

      yield put({
        type: 'save',
        payload: {
          rawData: operationData.data,
          provinceMapData: getProvinceMapData(operationData.data, defaultProvinceFilter),
          ...operationDateForView,
        },
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
        provinceFilter: {
          ...state.provinceFilter,
          disabledDate: (currentDate) => {
            return _.findIndex(payload.rawData, (data) => {
              return currentDate.isSame(data.date, 'day');
            }) === -1;
          },
        },
      };
    },
    updateProvinceFilter(state, { payload }) {
      const provinceFilter = {
        ...state.provinceFilter,
        ...payload,
      };

      const provinceMapData = getProvinceMapData(state.rawData, provinceFilter);

      return {
        ...state,
        provinceFilter,
        provinceMapData,
      };
    },
    clear() {
      return {
        newDeviceTrend: [],
        provinceNDTop10: [],
        activeDeviceTrend: [],
        provinceADTop10: [],
        totalWatchTimeTrend: [],
        provinceTWTTop10: [],
        totalNumberOfWatchedMediaTrend: [],
        provinceTNWMTop10: [],
        provinceAggregratedData: {
          newClient: [],
          activeClient: [],
          totalWatchedTime: [],
          countOfWhatchedMedia: [],
        },
        provinceMapData: [],
        provinceFilter: defaultProvinceFilter,
      };
    },
  },
};
