import { stringify } from 'qs';
import request from '../utils/request';
import _ from 'lodash';
import { request as graphqlRequest } from 'graphql-request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function queryCIBNOperationData() {
  return request('/api/cibn/operationdata');
}

export async function queryCIBNPersonalRecommendation() {
  return request('/api/cibn/operationdata');
}

export async function queryCIBNPersonalTags() {
  return request('/api/cibn/personal/tags');
}

export async function queryCIBNHotFilter(params) {
  // return graphqlRequest(`/api/cibn/hot/filter?${stringify(params)}`);
  return graphqlRequest(
    'http://zlike-mac0.guest.corp.microsoft.com:4000/graphql',
    `{\n  filters(videotype: \"${params.kind}\") {\n    languages\n    areas\n    categories\n  }\n  \n}`
  ).then((d) => { return d.filters })
}

export async function queryCIBNHotPlayCount(params) {
  // return request(`/api/cibn/hot/playcount?${stringify(_.omit(params, _.isNil))}`);
  const requestParams = [
    params.kind ? `videotype: \"${params.kind}\"` : 'videotype: "tv"',
    params.language ? `language: \"${params.language}\"` : 'language: "汉语"',
    params.category ? `category: \"${params.category}\"` : 'category: "家庭"',
    params.area ? `area: \"${params.area}\"` : null,
    params.provinceID ? `provinceID: \"${params.areaId}\"` : null,
    params.startDate ? `startDate: \"${params.startDate.toISOString()}\"` : 'startDate: "2018-01-01"',
    params.endDate ? `endDate: \"${params.endDate.toISOString()}\"` : null,
    params.hourOfDay ? `hourOfDay: \"${params.hourOfDay}\"` : null,
  ].filter(i => i !== null).join(',');
  return graphqlRequest(
    'http://zlike-mac0.guest.corp.microsoft.com:4000/graphql',
    `{\n  playCount(${requestParams}) {\n      count(top: ${params.top || 20}) {\n        videoname,\n        play_count,\n        vid\n      }\n    }\n}`
  ).then((d) => { console.log('aaaaaaaaaa', d);  return d.playCount.count })
}

