import _ from 'lodash';

const areaMetadata = [{
  label: '中国',
  value: 1,
  children: [{
    label: '华北',
    children: [{
      label: '北京',
      value: 202
    }, {
      label: '天津',
      value: 228
    }, {
      label: '河北',
      value: 210
    }, {
      label: '山西',
      value: 223
    }, {
      label: '内蒙古',
      value: 219
    }]
  }, {
    label: '东北',
    children: [{
      label: '辽宁',
      value: 218
    }, {
      label: '吉林',
      value: 215
    }, {
      label: '黑龙江',
      value: 212
    }]
  }, {
    label: '华东',
    children: [{
      label: '上海',
      value: 225
    }, {
      label: '江苏',
      value: 216
    }, {
      label: '浙江',
      value: 233
    }, {
      label: '安徽',
      value: 200
    }, {
      label: '福建',
      value: 204
    }, {
      label: '江西',
      value: 217
    }, {
      label: '山东',
      value: 222
    }, {
      label: '台湾',
      value: 227
    }]
  }, {
    label: '中南',
    children: [{
      label: '河南',
      value: 211
    }, {
      label: '湖北',
      value: 213
    }, {
      label: '湖南',
      value: 214
    }, {
      label: '广东',
      value: 206
    }, {
      label: '广西',
      value: 207
    }, {
      label: '海南',
      value: 209
    }, {
      label: '香港',
      value: 230
    }, {
      label: '澳门',
      value: 201
    }]
  }, {
    label: '西南',
    children: [{
      label: '重庆',
      value: 203
    }, {
      label: '四川',
      value: 226
    }, {
      label: '贵州',
      value: 208
    }, {
      label: '云南',
      value: 232
    }, {
      label: '西藏',
      value: 229
    }]
  }, {
    label: '西北',
    children: [{
      label: '陕西',
      value: 224
    }, {
      label: '甘肃',
      value: 205
    }, {
      label: '青海',
      value: 221
    }, {
      label: '宁夏',
      value: 220
    }, {
      label: '新疆',
      value: 231
    }]
  }]
  // children: [{
  //   label: '安徽',
  //   value: 200
  // }, {
  //   label: '澳门',
  //   value: 201
  // }, {
  //   label: '北京',
  //   value: 202
  // }, {
  //   label: '重庆',
  //   value: 203
  // }, {
  //   label: '福建',
  //   value: 204
  // }, {
  //   label: '甘肃',
  //   value: 205
  // }, {
  //   label: '广东',
  //   value: 206
  // }, {
  //   label: '广西',
  //   value: 207
  // }, {
  //   label: '贵州',
  //   value: 208
  // }, {
  //   label: '海南',
  //   value: 209
  // }, {
  //   label: '河北',
  //   value: 210
  // }, {
  //   label: '河南',
  //   value: 211
  // }, {
  //   label: '黑龙江',
  //   value: 212
  // }, {
  //   label: '湖北',
  //   value: 213
  // }, {
  //   label: '湖南',
  //   value: 214
  // }, {
  //   label: '吉林',
  //   value: 215
  // }, {
  //   label: '江苏',
  //   value: 216
  // }, {
  //   label: '江西',
  //   value: 217
  // }, {
  //   label: '辽宁',
  //   value: 218
  // }, {
  //   label: '内蒙古',
  //   value: 219
  // }, {
  //   label: '宁夏',
  //   value: 220
  // }, {
  //   label: '青海',
  //   value: 221
  // }, {
  //   label: '山东',
  //   value: 222
  // }, {
  //   label: '山西',
  //   value: 223
  // }, {
  //   label: '陕西',
  //   value: 224
  // }, {
  //   label: '上海',
  //   value: 225
  // }, {
  //   label: '四川',
  //   value: 226
  // }, {
  //   label: '台湾',
  //   value: 227
  // }, {
  //   label: '天津',
  //   value: 228
  // }, {
  //   label: '西藏',
  //   value: 229
  // }, {
  //   label: '香港',
  //   value: 230
  // }, {
  //   label: '新疆',
  //   value: 231
  // }, {
  //   label: '云南',
  //   value: 232
  // }, {
  //   label: '浙江',
  //   value: 233
  // }]
}, {
  label: '海外',
  value: 2
}];

_.each(areaMetadata[0].children, (chinaZone) => {
  chinaZone.value = _.map(chinaZone.children, (province) => province.value).join(',');
});

export default areaMetadata[0].children;
