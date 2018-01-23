import _ from 'lodash';

export const getFilterForVideoKind = (req, res) => {
  const videoKind = req.query.kind;

  if (videoKind === 'music') {
    res.send({
      language: ['汉语', '英语'],
      category: ['演唱会', 'MV'],
      area: ['香港', '大陆'],
      musicstyle: ['流行', '摇滚']
    });
  } else if (videoKind === 'dhyana') {
    res.send({
      "languages": [
        "汉语"
      ],
      "areas": [
        "中国大陆"
      ],
      "categories": [
        "禅文化",
        "讲座",
        "佛学",
        "纪实",
        "文化",
        "菩萨在线",
        "最快资讯",
        "寺观",
        "禅艺",
        "影视",
        "动画",
        "养生",
        "人物",
        "国学",
        "汉学院",
        "修身齐家",
        "曲艺",
        "音乐",
        "饮食",
        "中医养生",
        "道教之音",
        "道学",
        "剧场",
        "电影",
        "科仪",
        "资讯",
        "原创沙画",
        "经典解读",
        "医疗",
        "寺院风光",
        "第六届非遗节执委办",
        "电视剧",
        "运动",
        "德音",
        "人物专访",
        "雅乐",
        "六步教育"
      ]
    });
  } else {
    res.send({
      language: ['汉语', '英语'],
      category: ['喜剧', '恐怖'],
      area: ['香港', '大陆']
    });
  }
};

export const getPlayCount = (req, res) => {
  const videoKind = req.query.kind;
  const areaId = Number(req.query.areaId);

  if (videoKind === 'music') {
    if (areaId === 223) {
      res.send([{
        entity: {
          name: '鲜肉来袭!UNIQ特辑 - UNIQ',
        },
        count: 11444,
      }, {
        entity: {
          name: '全亚音乐榜 第1期',
        },
        count: 10444,
      }, {
        entity: {
          name: '全亚音乐榜 第10期',
        },
        count: 9333,
      }, {
        entity: {
          name: '【专访】徐浩、朱元冰做客',
        },
        count: 7555,
      }, {
        entity: {
          name: '2015年音悦V榜第8期 欧美',
        },
        count: 2111,
      }]);
    } else {
      res.send([{
        entity: {
          name: '2015年音悦V榜第8期内地 高清',
        },
        count: 15444,
      }, {
        entity: {
          name: '全亚音乐榜 第1期',
        },
        count: 13444,
      }, {
        entity: {
          name: '全亚音乐榜 第10期',
        },
        count: 4333,
      }, {
        entity: {
          name: '【专访】徐浩、朱元冰做客',
        },
        count: 255,
      }, {
        entity: {
          name: '【专访】小室哲哉做客乐人无数',
        },
        count: 111,
      }]);
    }
  } else {
    res.send([{
      entity: {
        name: '2015年音悦V榜第8期内地 高清',
      },
      count: 144,
    }, {
      entity: {
        name: 'Emose超透气香水洗发套组',
      },
      count: 160,
    }, {
      entity: {
        name: '全亚音乐榜 第10期',
      },
      count: 43,
    }, {
      entity: {
        name: '【专访】徐浩、朱元冰做客',
      },
      count: 5,
    }, {
      entity: {
        name: '【专访】小室哲哉做客乐人无数',
      },
      count: 1,
    }]);
  }
};

