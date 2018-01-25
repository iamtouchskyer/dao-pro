import _ from 'lodash';
import { 
  queryCIBNPersonalRecommendation,
  queryCIBNPersonalViewHistory,
  queryCIBNPersonalTags,
  queryCIBNPersonalRecommendationUserList,
} from '../services/api';

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
  namespace: 'recommendation',

  state: {
    users: [],
    tags: { data: []},
    history: { data: []},
    recommendation: { data: []},
    loading: false,
  },

  effects: {
    *fetchPersonalTag({ payload }, { call, put }) {
      const tags = yield call(queryCIBNPersonalTags, payload.hid);
      yield put({
        type: 'save',
        payload: { tags },
      });
    },

    *fetchPersonalViewHistory({ payload }, { call, put }) {
      const history = yield call(queryCIBNPersonalViewHistory, payload.hid);
      yield put({
        type: 'save',
        payload: { history },
      });
    },

    *fetchUsers(_, { call, put }) {
      const users = yield call(queryCIBNPersonalRecommendationUserList);
      yield put({
        type: 'save',
        payload: { users },
      });
    },
  
    *fetchPersonalRecommendation({ payload }, { call, put }) {
      const recommendation = yield call(queryCIBNPersonalRecommendation, payload.hid);
      yield put({
        type: 'save',
        payload: { recommendation },
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
        user: [],
      };
    },
  },
};
