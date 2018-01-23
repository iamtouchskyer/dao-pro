import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Tabs,
  Row,
  Col,
  Card,
  Tooltip,
  DatePicker
} from 'antd';
import numeral from 'numeral';
import Authorized from '../../utils/Authorized';
import { Pie, WaterWave, Gauge, TagCloud, Bar } from '../../components/Charts';
import NumberInfo from '../../components/NumberInfo';
import CountDown from '../../components/CountDown';
import ActiveChart from '../../components/ActiveChart';
import styles from './Monitor.less';
import { getTimeDistance } from '../../utils/utils';

const { Secured } = Authorized;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const targetTime = new Date().getTime() + 3900000;

// use permission as a parameter
const havePermissionAsync = new Promise((resolve) => {
  // Call resolve on behalf of passed
  setTimeout(() => resolve(), 1000);
});
@Secured(havePermissionAsync)
@connect(({ monitor, cibnHot, loading }) => ({
  monitor,
  cibnHot,
  loading: loading.models.monitor || loading.effects['cibnHot/fetchFilter'],
}))
export default class Monitor extends PureComponent {
  state = {
    channelType: '0',
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('thisYear'),
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'monitor/fetchTags',
    });
    this.props.dispatch({
      type: 'cibnHot/fetchFilter',
    });
  }

  handleRangePickerChange = (rangePickerValue) => {
    this.setState({
      rangePickerValue,
    });

    this.props.dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  selectDate = (type) => {
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    this.props.dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return;
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
  }

  renderDatePicker = () => {
    const { rangePickerValue } = this.state;
    return (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
            今日
          </a>
          <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>
            本周
          </a>
          <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
            本月
          </a>
          <a className={this.isActive('year')} onClick={() => this.selectDate('thisYear')}>
            全年
          </a>
        </div>
        <RangePicker
          value={rangePickerValue}
          onChange={this.handleRangePickerChange}
          style={{ width: 256 }}
        />
      </div>
    );
  };

  renderTabPane = (tabProps, chartProps, top10Props) => {
    return (
      <TabPane {...tabProps}>
        <Row>
          <Col xl={18} lg={16} md={16} sm={36} xs={36}>
            <div className={styles.salesBar}>
              <Bar
                height={380}
                {...chartProps}
              />
            </div>
          </Col>
          <Col xl={6} lg={8} md={8} sm={12} xs={12}>
            <div className={styles.salesRank}>
              <h4 className={styles.rankingTitle}>{top10Props.title}</h4>
              <ul className={styles.rankingList}>
                {top10Props.data.map((item, i) => (
                  <li key={item.title}>
                    <span className={i < 3 ? styles.active : ''}>{i + 1}</span>
                    <span>{item.title}</span>
                    <span>{numeral(item.total).format('0,0')}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>
      </TabPane>

    );
  }

  renderTrend = () => {
    const { salesType, currentTabKey } = this.state;
    const { operationData, loading } = this.props;
    const {
      newDeviceTrend, provinceNDTop10,
      activeDeviceTrend, totalWatchTimeTrend, totalNumberOfWatchedMediaTrend,
      provinceADTop10, provinceTWTTop10, provinceTNWMTop10,
    } = operationData;

    if (loading === undefined) return null;

    return (
      <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
        <div className={styles.salesCard}>
          <Tabs tabBarExtraContent={this.renderDatePicker()} size="large" tabBarStyle={{ marginBottom: 24 }}>
            {
              this.renderTabPane(
                { tab: '活跃客户端', key: 'activeclients' },
                { title: '活跃客户端趋势', data: activeDeviceTrend },
                { title: '省份Top10', data: provinceADTop10 },
              )
            }

            {
              this.renderTabPane(
                { tab: '新增客户端', key: 'newclients' },
                { title: '新增客户端趋势', data: newDeviceTrend },
                { title: '省份Top10', data: provinceNDTop10 },
              )
            }

            {
              this.renderTabPane(
                { tab: '播放剧集数目', key: 'counts' },
                { title: '播放剧集数目趋势', data: totalWatchTimeTrend },
                { title: '省份Top10', data: provinceTWTTop10 },
              )
            }

            {
              this.renderTabPane(
                { tab: '播放时长', key: 'totaltime' },
                { title: '播放时长趋势', data: totalNumberOfWatchedMediaTrend },
                { title: '省份Top10', data: provinceTNWMTop10 },
              )
            }

          </Tabs>
        </div>
      </Card>
    );
  }

  render() {
    const { monitor, loading } = this.props;
    const { tags } = monitor;

    return (
      <div>
        {/* { this.renderTrend() } */}
        <Row gutter={24}>
          <Col xl={18} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <Card title="活动实时交易情况" bordered={false}>
              <Row>
                <Col md={6} sm={12} xs={24}>
                  <NumberInfo
                    subTitle="今日交易总额"
                    suffix="元"
                    total={numeral(124543233).format('0,0')}
                  />
                </Col>
                <Col md={6} sm={12} xs={24}>
                  <NumberInfo
                    subTitle="销售目标完成率"
                    total="92%"
                  />
                </Col>
                <Col md={6} sm={12} xs={24}>
                  <NumberInfo subTitle="活动剩余时间" total={<CountDown target={targetTime} />} />
                </Col>
                <Col md={6} sm={12} xs={24}>
                  <NumberInfo
                    subTitle="每秒交易总额"
                    suffix="元"
                    total={numeral(234).format('0,0')}
                  />
                </Col>
              </Row>
              <div className={styles.mapChart}>
                <Tooltip title="等待后期实现">
                  <img src="https://gw.alipayobjects.com/zos/rmsportal/HBWnDEUXCnGnGrRfrpKa.png" alt="map" />
                </Tooltip>
              </div>
            </Card>
          </Col>
          <Col xl={6} lg={24} md={24} sm={24} xs={24}>
            <Card title="活动情况预测" style={{ marginBottom: 24 }} bordered={false}>
              <ActiveChart />
            </Card>
            <Card
              title="券核效率"
              style={{ marginBottom: 24 }}
              bodyStyle={{ textAlign: 'center' }}
              bordered={false}
            >
              <Gauge
                format={(val) => {
                  switch (parseInt(val, 10)) {
                    case 20:
                      return '差';
                    case 40:
                      return '中';
                    case 60:
                      return '良';
                    case 80:
                      return '优';
                    default:
                      return '';
                  }
                }}
                title="跳出率"
                height={180}
                percent={87}
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={12} lg={24} sm={24} xs={24}>
            <Card
              title="各品类占比"
              style={{ marginBottom: 24 }}
              bordered={false}
              className={styles.pieCard}
            >
              <Row style={{ padding: '16px 0' }}>
                <Col span={8}>
                  <Pie
                    animate={false}
                    percent={28}
                    subTitle="中式快餐"
                    total="28%"
                    height={128}
                    lineWidth={2}
                  />
                </Col>
                <Col span={8}>
                  <Pie
                    animate={false}
                    color="#5DDECF"
                    percent={22}
                    subTitle="西餐"
                    total="22%"
                    height={128}
                    lineWidth={2}
                  />
                </Col>
                <Col span={8}>
                  <Pie
                    animate={false}
                    color="#2FC25B"
                    percent={32}
                    subTitle="火锅"
                    total="32%"
                    height={128}
                    lineWidth={2}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xl={6} lg={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <Card title="热门搜索" loading={loading} bordered={false} bodyStyle={{ overflow: 'hidden' }}>
              <TagCloud
                data={tags}
                height={161}
              />
            </Card>
          </Col>
          <Col xl={6} lg={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <Card title="资源剩余" bodyStyle={{ textAlign: 'center', fontSize: 0 }} bordered={false}>
              <WaterWave
                height={161}
                title="补贴资金剩余"
                percent={34}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
