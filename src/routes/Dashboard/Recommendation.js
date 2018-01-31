import React, { PureComponent } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Table, Row, Col, Card, Tabs, Radio, Select } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Radar, TagCloud } from '../../components/Charts';
import CardGroup from '../../newmodules/CardGroup';
import Scroller from '../../newmodules/Scroller';
import styles from './Recommendation.less';

_.mixin({
  countUnique: (arr) => {
    const a = {};
    _.each(arr, (element) => { a[element] = a[element] ? a[element] + 1 : 1; });

    return a;
  },
});

@connect(({ chart, recommendation, loading }) => ({
  chart,
  recommendation,
  usersLoading: loading.effects['recommendation/fetchUsers'],
  gueesYouLikeLoading: loading.effects['recommendation/fetchPersonalRecommendation'],
  historyLoading: loading.effects['recommendation/fetchPersonalViewHistory'],
  tagLoading: loading.effects['recommendation/fetchPersonalTag'],
  summaryLoading: loading.effects['recommendation/fetchPersonalSummary'],
}))
export default class Recommendation extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/fetch',
    });
    dispatch({
      type: 'recommendation/fetchUsers',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  doFetehByHid = (hid) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'recommendation/fetchPersonalRecommendation',
      payload: { hid },
    });

    dispatch({
      type: 'recommendation/fetchPersonalViewHistory',
      payload: { hid },
    });

    dispatch({
      type: 'recommendation/fetchPersonalTag',
      payload: { hid },
    });

    dispatch({
      type: 'recommendation/fetchPersonalSummary',
      payload: { hid },
    });
  };

  renderDropdownMenu = () => {
    const {
      recommendation,
    } = this.props;

    const users = (recommendation && _.isArray(recommendation.users)) ? recommendation.users : [];

    return (
      <Row>
        <Select
          defaultValue="选择用户"
          style={{ width: 300 }}
          onChange={(value) => {
            this.doFetehByHid(value);
          }}
        >
          {users.map(user => (
            <Select.Option value={user} key={user}>
              {user}
            </Select.Option>
          ))}
        </Select>
      </Row>
    );
  };

  renderSpecifiedUser = () => {
    return (
      <Row style={{ marginBottom: 12 }}>
        <Radio.Group value="small" onChange={e => this.doFetehByHid(e.target.value)} >
          <Radio.Button value="00070C448EB2FE4183CEF3FC2C531BDE">游戏爱好者</Radio.Button>
          <Radio.Button value="000783C6C87BA6A2EA013D5B0E884596">海外用户</Radio.Button>
          <Radio.Button value="00044891791203A2B7DD92C19F201281">家庭主妇</Radio.Button>
          <Radio.Button value="001645DB9A1E99C20BB9852E2B4B50A6">电影控</Radio.Button>
          <Radio.Button value="000044E965457180C090E890D047E42E">家有小宝</Radio.Button>
          <Radio.Button value="00009B773848B7A8C73E383E368F179D">家有小宝</Radio.Button>
          <Radio.Button value="000FEE6DEA812413957A98B2C3B40361">家有小宝</Radio.Button>
          <Radio.Button value="0000D4E279F03603976F7AFF7BE43BEA">戏剧爱好者</Radio.Button>
        </Radio.Group>
      </Row>
    );
  };

  render() {
    const {
      recommendation,
      usersLoading,
      gueesYouLikeLoading,
      historyLoading,
      tagLoading,
      summaryLoading,
    } = this.props;

    /*
    const {
      tags
    } = recommendation;
    */
    const tags = _.chain(recommendation.tags.data)
      .countUnique()
      .map((value, key) => { return { name: key, value: value + 20 }; })
      .value();

    const aa = _.map(recommendation.history.data, (historyItem) => {
      return {
        key: historyItem.vid,
        name: historyItem.vname,
        videotype: historyItem.videotype,
        area: historyItem.area,
        issueyear: historyItem.issueyear,
        taginfo: `${historyItem.taginfo}|${historyItem.category}`,
      };
    });
    const bb = _.keys(aa[0]);
    const cc = _.map(bb, b => _.zipObject(['title', 'dataIndex', 'key'], [b, b, b]));

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '20', '50', '100'],
    };


    const radarOriginData = [
      {
        name: '用户1',
        ref: 10,
        koubei: 8,
        output: 4,
        contribute: 5,
        hot: 7,
      },
      {
        name: '用户2',
        ref: 3,
        koubei: 9,
        output: 6,
        contribute: 3,
        hot: 1,
      },
      {
        name: '用户3',
        ref: 4,
        koubei: 1,
        output: 6,
        contribute: 5,
        hot: 7,
      },
    ];
    const radarData = [];
    const radarTitleMap = {
      ref: '宜人性',
      koubei: '严谨性',
      output: '外向性',
      contribute: '神经质',
      hot: '开放性',
    };
    radarOriginData.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (key !== 'name') {
          radarData.push({
            name: item.name,
            label: radarTitleMap[key],
            value: item[key],
          });
        }
      });
    });

    return (
      <PageHeaderLayout>
        { this.renderDropdownMenu() }
        { this.renderSpecifiedUser() }

        <Row gutter={24}>
          <Col xs={15}>
            <Card style={{ marginBottom: 24, height: 1008 }} bordered={false} >
              {/* <Scroller
                data={recommendation.recommendation.data.listByTimeCategory}
              /> */}
              <Tabs type="card">
                <Tabs.TabPane tab="全部" key="fullList">
                  {/* <CardGroup
                    loading={gueesYouLikeLoading}
                    cards={recommendation.recommendation.data.fullList}
                    cardGridStyle={{ width: '25%' }}
                  /> */}
                  <Scroller
                    gueesYouLikeLoading={gueesYouLikeLoading}
                    fullData={recommendation.recommendation.data.listByTimeCategory}
                  />
                </Tabs.TabPane>
                <Tabs.TabPane tab="按时间归类" key="listByTimeCategory">
                  <Tabs size="small" tabPosition="left" tabBarStyle={{ maxHeight: 960 }}>
                    {_.map(recommendation.recommendation.data.listByTimeCategory, (cards, title) =>
                      (
                        <Tabs.TabPane tab={title} key={title} style={{ padding: 0 }}>
                          <CardGroup
                            loading={gueesYouLikeLoading}
                            cards={_.take(_.shuffle(cards), 10)}
                            cardGridStyle={{ width: '25%' }}
                          />
                        </Tabs.TabPane>
                      )
                    )
                    }
                  </Tabs>
                </Tabs.TabPane>
              </Tabs>
            </Card>
          </Col>
          <Col xs={9}>
            <Card title="观影标签" loading={tagLoading} bordered={false} style={{ marginBottom: 24, height: 360 }} bodyStyle={{ overflow: 'hidden' }}>
              <TagCloud
                data={tags}
                height={270}
                loading={tagLoading}
              />
            </Card>
            <Card
              style={{ marginBottom: 24, height: 360 }}
              bordered={false}
              title="大五人格分析 -- TBD"
              loading={radarData.length === 0}
            >
              <div className={styles.chart}>
                <Radar hasLegend height={270} data={radarData} />
              </div>
            </Card>
            <Card
              style={{ marginBottom: 24, height: 240 }}
              bordered={false}
              title="用户描述"
              loading={summaryLoading}
            >
              <div className={styles.chart} height="300">
                {recommendation.summary.data}
              </div>
            </Card>
          </Col>
        </Row>

        {/* <Card loading={usersLoading} bordered={false} title="猜你喜欢" bodyStyle={{ marginBottom: 4, padding: 4, minHeight: 200 }} >
          <Tabs size="large">
            {_.map(recommendation.recommendation.data.listByTimeCategory, (cards, title) =>
              (
                <Tabs.TabPane tab={title} key={title} style={{ padding: 0 }}>
                  <CardGroup loading={gueesYouLikeLoading} cardTitle="" cards={_.take(_.shuffle(cards), 10)} />
                </Tabs.TabPane>
              )
            )
            }
          </Tabs>
        </Card> */}
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false} title="观影历史">
              <Table
                loading={historyLoading}
                rowKey={record => record.key}
                dataSource={aa}
                columns={cc}
                pagination={paginationProps}
                onChange={this.handleTableChange}
              />
            </Card>

          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
