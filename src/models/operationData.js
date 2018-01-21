import _ from 'lodash';
import { queryCIBNOperationData } from '../services/api';

const calculateProvinceTotal = (provinceData) => {
  return _.sumBy(provinceData.dimensions.application, eachApp => eachApp.total);
};

const calculateCountryTotal = (provincesData) => {
  return _.sumBy(provincesData, eachProvince => calculateProvinceTotal(eachProvince));
};

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

const generateDataForView = (operationData) => {
  const [newDeviceTrend, provinceND, provinceNDTop10] = generateTrendAndTop10(operationData, 'newClients');
  const [activeDeviceTrend, provinceAD, provinceADTop10] = generateTrendAndTop10(operationData, 'activeClients');
  const [totalWatchTimeTrend, provinceTWT, provinceTWTTop10] = generateTrendAndTop10(operationData, 'totalWatchedTime');
  const [totalNumberOfWatchedMediaTrend, provinceTNWM, provinceTNWMTop10] = generateTrendAndTop10(operationData, 'countOfWhatedMedia');

  const provinceAggregratedData = {
    newClients: provinceND,
    activeClients: provinceAD,
    totalWatchedTime: provinceTWT,
    countOfWhatedMedia: provinceTNWM,
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
      countOfWhatedMedia: [],
    },
    loading: false,
  },

  effects: {
    *fetchOperationData(_, { call, put }) {
      const operationData = yield call(queryCIBNOperationData);
      const operationDateForView = yield generateDataForView(operationData);
      yield put({
        type: 'save',
        payload: {
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
          countOfWhatedMedia: [],
        },
      };
    },
  },
};
