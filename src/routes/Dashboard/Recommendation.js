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

@connect(({ project, chart, recommendation, loading }) => ({
  project,
  chart,
  recommendation,
  loading: loading.effects['project/fetchNotice'] || loading.effects['recommendation/fetchPersonalRecommendation'],
  recommendationLoading: loading.effects['recommendation/fetchUsers'] || loading.effects['recommendation/fetchPersonalRecommendation'],
  projectLoading: loading.effects['project/fetchNotice'],
}))
export default class Recommendation extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/fetchNotice',
    });
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
      type: 'recommendation/queryCIBNPersonalTags',
      payload: { hid },
    });
  }

  renderDropdownMenu = () => {
    const {
      recommendation,
    } = this.props;

    const users = (recommendation && _.isArray(recommendation.users)) ? recommendation.users : [];

    return (<Dropdowns title="选择用户" menu={users} handleMenuClick={this.onMenuItemClick} />);
  };

  render() {
    const {
      project: { notice },
      projectLoading,
      recommendationLoading,
      chart: { radarData },
      recommendation,
    } = this.props;

    if (projectLoading === undefined ) return null;
    /*
    const {
      tags
    } = recommendation;
    */
    const tags = _.chain(recommendation.history.data)
      .map(historyItem => `${historyItem.taginfo}|${historyItem.category}`.split('|'))
      .flatten()
      .uniq()
      .map((item) => { return { name:item, value: Math.floor((Math.random() * 50)) + 20 }; })
      .value();


    const loading=false;

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

    return (
      <PageHeaderLayout>
        { this.renderDropdownMenu() }
         
        <Tabs size="large" tabBarStyle={{ marginBottom: 24 }}>
          { _.map(recommendation.recommendation.data.listByTimeCategory, (cards, title) => 
              (
              <Tabs.TabPane tab= {title} key= {title}>
                <CardGroup loading={false} cardTitle="猜你喜欢" cards={cards} />
              </Tabs.TabPane>
              )
            )
          }
        </Tabs>

        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false} title="观影历史">
              <Table
                loading={loading}
                rowKey={record => record.key}
                dataSource={aa}
                columns={cc}
                pagination={paginationProps}
                onChange={this.handleTableChange}
              />
            </Card>

          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card title="观影标签" loading={loading} bordered={false} bodyStyle={{ overflow: 'hidden' }}>
              <TagCloud
                data={tags}
                height={161}
              />
            </Card>
            <Card
              style={{ marginBottom: 24 }}
              bordered={false}
              title="XX 指数"
              loading={radarData.length === 0}
            >
              <div className={styles.chart}>
                <Radar hasLegend height={343} data={radarData} />
              </div>
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
