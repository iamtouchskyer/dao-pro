import _ from 'lodash';
import { queryCIBNHotFilter, queryCIBNHotPlayCount } from '../services/api';

export default {
  namespace: 'cibnHot',

  state: {
    loading: false,
  },

  effects: {
    *fetchFilter(_, { call, put }) {
      const filter = yield call(queryCIBNHotFilter);
      yield put({
        type: 'save',
        payload: {
          ...filter,
        },
      });
    },
    *fetchPlayCount(_, { call, put }) {
      const playCount = yield call(queryCIBNHotPlayCount);
      yield put({
        type: 'save',
        payload: {
          ...playCount,
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
      };
    },
  },
};
