import _ from 'lodash';
import { 
  queryCIBNPersonalRecommendation,
  queryCIBNPersonalViewHistory,
  queryCIBNPersonalTags,
  queryCIBNPersonalRecommendationUserList,
} from '../services/api';

export default {
  namespace: 'recommendation',

  state: {
    users: [],
    tags: { data: [] },
    history: { data: [] },
    recommendation: {
      data: {
        fullList: [],
        listByTimeCategory: [],
      },
    },
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
        users: [],
        tags: { data: [] },
        history: { data: [] },
        recommendation: { 
          data: {
            fullList: [],
            listByTimeCategory: [],
          },
        },
      };
    },
  },
};
