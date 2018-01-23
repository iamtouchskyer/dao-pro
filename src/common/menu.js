import { isUrl } from '../utils/utils';

const menuData = [{
  name: '数据运营',
  icon: 'dashboard',
  path: 'dashboard',
  children: [{
    name: '总体监控',
    path: 'analysis',
  }, {
    name: '热点统计',
    path: 'hot',
  }, {
    name: '聚类划分',
    path: 'monitor',
  }, {
    name: '个性化用户',
    path: 'recommendation',
    // hideInMenu: true,
  }, {
    name: '特别考虑',
    path: 'recommendation',
    // hideInMenu: true,
  }],
}];

function formatter(data, parentPath = '', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
