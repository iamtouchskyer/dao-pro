import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Table, Row, Col, Card, Tabs, List, Avatar } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Radar, TagCloud } from '../../components/Charts';
import CardGroup from '../../newmodules/CardGroup';
import Dropdowns from '../../newmodules/Dropdowns';
import styles from './Recommendation.less';
import _ from 'lodash';

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

  onMenuItemClick = (target) => {
    const { dispatch } = this.props;

    const index = target.index;
    const hid = target.title;

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
  }

  renderDropdownMenu = () => {
    const {
      recommendation,
    } = this.props;

    const users = (recommendation && _.isArray(recommendation.users)) ? recommendation.users : [];

    return (<Dropdowns style={{ marginBottom: 24 }} title="选择用户" menu={users} handleMenuClick={this.onMenuItemClick} />);
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

        <Card loading={usersLoading} bordered={false} title="猜你喜欢" bodyStyle={{ marginBottom: 4, padding: 4, minHeight: 200 }} >
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
        </Card>

        <Row gutter={24}>
          <Col xl={9} lg={24} md={24} sm={24} xs={24}>
            <Card title="观影标签" loading={tagLoading} bordered={false} style={{ marginBottom: 24, height: 360 }} bodyStyle={{ overflow: 'hidden' }}>
              <TagCloud
                data={tags}
                height={270}
                loading={tagLoading}
              />
            </Card>
          </Col>
          <Col xl={6} lg={24} md={24} sm={24} xs={24}>
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
          </Col>
          <Col xl={9} lg={24} md={24} sm={24} xs={24}>
            <Card
              style={{ marginBottom: 24, height: 360 }}
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
