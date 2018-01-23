import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Table, Row, Col, Card, List, Avatar } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Radar, TagCloud } from '../../components/Charts';
import CardGroup from '../../newmodules/CardGroup';
import Dropdowns from '../../newmodules/Dropdowns';
import styles from './Recommendation.less';
import _ from 'lodash';

@connect(({ project, chart, recommendation, loading }) => ({
  project,
  chart,
  loading: loading.effects['project/fetchNotice'] || loading.effects['recommendation/fetchPersonalRecommendation'],
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
      type: 'recommendation/fetchPersonalRecommendation',
    });
    dispatch({
      type: 'recommendation/fetchPersonalTag',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  render() {
    const {
      project: { notice },
      projectLoading,
      chart: { radarData },
      recommendation,
    } = this.props;

    /*
    const {
      tags
    } = recommendation;
    */
    const tags = [];
    for (let i = 0; i < 30; i += 1) {
      tags.push({
        name: `TagClout-Title-${i}`,
        value: Math.floor((Math.random() * 50)) + 20,
      });
    }

    if (projectLoading === undefined) return null;

    const loading=false;
    const aa = _.times(100, (n) => {return {key: n, 'Name': '肖申克的救赎', 'Date': (new Date()).toLocaleString()};});
    const bb = _.keys(aa[0]);
    const cc = _.map(bb, (b) => _.zipObject(['title', 'dataIndex', 'key'], [b, b, b]));

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '20', '50', '100'],
    };

    const menu = (_.chain(tags).map((tag) => tag.name).value());

    return (
      <PageHeaderLayout>

        <Dropdowns menu={menu} />
        <CardGroup loading={projectLoading} cardTitle="猜你喜欢" cards={notice} />

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
