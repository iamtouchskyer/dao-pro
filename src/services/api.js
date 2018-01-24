import { stringify } from 'qs';
import request from '../utils/request';
import _ from 'lodash';
import { request as graphqlRequest } from 'graphql-request';
import moment from 'moment';
import { message } from 'antd';

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

// const serviceUrl = "http://zlike-mac0.guest.corp.microsoft.com:4000/graphql";
const serviceUrl = "http://localhost:3030/popular";

export async function queryCIBNHotFilter(params) {
  // return graphqlRequest(`/api/cibn/hot/filter?${stringify(params)}`);
  return graphqlRequest(
    serviceUrl,
    `{\n  filters(videotype: \"${params.kind}\") {\n    languages\n    areas\n    categories\n  }\n  \n}`
  ).then((d) => { return d.filters })
  .catch(() => { message.error('请求失败') })
}

function format(date) {
  return moment(date).format('YYYY-MM-DD');
}

function defaultCategory(kind) {
  switch (kind) {
  case 'movie':
    return '喜剧';
  case 'tv':
    return '都市';
  case 'music':
    return 'MV';
  case 'children':
    return '益智';
  case 'dhyana':
    return '讲座';
  }
  return '都市';
}
export async function queryCIBNHotPlayCount(params) {
  // return request(`/api/cibn/hot/playcount?${stringify(_.omit(params, _.isNil))}`);
  // Too slow, use default filter to mock for now
  const requestParams = [
    params.kind ? `videotype: \"${params.kind}\"` : 'videotype: "tv"',
    params.language ? `language: \"${params.language}\"` : 'language: "汉语"',
    params.category ? `category: \"${params.category}\"` : null, //`category: "${defaultCategory(params.kind)}"`,
    params.area ? `area: \"${params.area}\"` : null,
    params.areaId ? `provinceID: ${params.areaId}` : null,
    params.startDate ? `startDate: \"${format(params.startDate)}\"` : 'startDate: "2018-01-01"',
    params.endDate ? `endDate: \"${format(params.endDate)}\"` : null,
    params.hourOfDay ? `hourOfDay: \"${params.hourOfDay}\"` : null,
  ].filter(i => i !== null).join(',');
  return graphqlRequest(
    serviceUrl,
    `{\n  playCount(${requestParams}) {\n      count(top: ${params.top || 10}) {\n        videoname,\n        play_count,\n        vid\n      }\n    }\n}`
  ).then((d) => { console.log('aaaaaaaaaa', d);  return d.playCount.count })
  .catch(() => { message.error('请求失败') })
}

