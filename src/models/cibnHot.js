import _ from 'lodash';
import { queryCIBNHotFilter, queryCIBNHotPlayCount } from '../services/api';

export default {
  namespace: 'cibnHot',

  state: {
    loading: false,
  },

  effects: {
    *fetchFilter({ payload }, { call, put }) {
      const filter = yield call(queryCIBNHotFilter, payload);
      yield put({
        type: 'save',
        payload: {
          filter,
        },
      });
    },
    *fetchPlayCount({ payload }, { call, put }) {
      const playCount = yield call(queryCIBNHotPlayCount, payload);
      yield put({
        type: 'save',
        payload: {
          playCount,
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
