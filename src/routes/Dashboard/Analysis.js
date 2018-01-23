import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Icon,
  Card,
  Tabs,
  Table,
  Radio,
  DatePicker,
  Tooltip,
  Menu,
  Dropdown,
  Select,
} from 'antd';
import numeral from 'numeral';
import _ from 'lodash';
import {
  ChartCard,
  yuan,
  MiniArea,
  MiniBar,
  MiniProgress,
  Field,
  Bar,
  Pie,
  TimelineChart,
} from '../../components/Charts';
import Trend from '../../components/Trend';
import NumberInfo from '../../components/NumberInfo';
import { getTimeDistance } from '../../utils/utils';
import ChinaMapChart from '../../newmodules/Charts/ChinaMap';

import styles from './Analysis.less';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

@connect(({ chart, operationData, loading }) => ({
  chart,
  operationData,
  loading: loading.effects['chart/fetch'] || loading.effects['operationData/fetchOperationData'],
}))
export default class Analysis extends Component {
  state = {
    channelType: '0',
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('thisYear'),
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'chart/fetch',
    });

    this.props.dispatch({
      type: 'operationData/fetchOperationData',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });

    /*
    dispatch({
      type: 'operationData/clear',
    });
    */
  }

  changeProvinceFilterFilterBy = (e) => {
    this.props.dispatch({
      type: 'operationData/changeProvinceFilterFilterBy',
      value: e.target.value,
    });
  }

  handleChangeSalesType = (e) => {
    this.setState({
      salesType: e.target.value,
    });
  };

  changeFilterValue = (value) => {
    this.props.dispatch({
      type: 'operationData/changeFilterValue',
      value,
    });
  };

  handleTabChange = (key) => {
    this.setState({
      currentTabKey: key,
    });
  };

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

  renderProvinceData = () => {
    const { operationData, loading } = this.props;
    const { provinceAggregratedData } = operationData;

    if (loading === undefined) return null;

    const provinceAggregratedDataByNewClient = provinceAggregratedData.newClients;
    const provinceAggregratedDataByActiveClient = provinceAggregratedData.activeClients;
    const provinceAggregratedDataByTWT = provinceAggregratedData.totalWatchedTime;
    const provinceAggregratedDataByTNWM = provinceAggregratedData.countOfWhatchedMedia;
    const theData = provinceAggregratedDataByNewClient;

    /*
    if (this.state.channelType === 0) {
      theData = _.map(provinceAggregratedDataByNewClient, (eachProvince) => {
        return { id: eachProvince.provinceId, value: _.sumBy(eachProvince.appId, eachApp => _.sum(_.values(eachApp))) };
      });
    } else {
      theData = _.map(provinceAggregratedDataByNewClient, (eachProvince) => {
        return { id: eachProvince.provinceId, value: _.values(_.find(eachProvince.appId, eachApp => _.keys(eachApp)[0] === this.state.channelType))[0] };
      });
    }
    */

    const { provinceFilter } = operationData;

    return (
      <Card
        loading={loading}
        className={styles.salesCard}
        bordered={false}
        bodyStyle={{ padding: 24 }}
        style={{ marginTop: 24, minHeight: 500 }}
        title="地域分布"
        extra={
          <div className={styles.salesCardExtra}>
            { this.renderDatePicker() }
            <div className={styles.salesTypeRadio}>
              <Radio.Group value={provinceFilter.filterBy} onChange={this.changeProvinceFilterFilterBy}>
                <Radio.Button value="app">App</Radio.Button>
                <Radio.Button value="channel">Channel</Radio.Button>
              </Radio.Group>
              <Select value={provinceFilter.filterValue} style={{ width: 100 }} onChange={this.changeFilterValue}>
                {provinceFilter[provinceFilter.filterBy === 'app' ? 'allAppIds' : 'allChannels'].map(i => (
                  <Select.Option key={i} value={i}>{i}</Select.Option>
                ))}
              </Select>
            </div>
          </div>
        }
      >
        <ChinaMapChart height={1200} data={theData} />
      </Card>
    );
  };

  render() {
    const { salesType, currentTabKey } = this.state;
    const { chart, loading } = this.props;
    const {
      visitData,
      visitData2,
      salesData,
      searchData,
      offlineData,
      salesTypeData,
      salesTypeDataOnline,
      salesTypeDataOffline,
    } = chart;

    if (loading === undefined) return null;

    const salesPieData =
      salesType === 'all'
        ? salesTypeData
        : salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;

    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );

    const iconGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis" />
        </Dropdown>
      </span>
    );

    const columns = [
      {
        title: '排名',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '搜索关键词',
        dataIndex: 'keyword',
        key: 'keyword',
        render: text => <a href="/">{text}</a>,
      },
      {
        title: '用户数',
        dataIndex: 'count',
        key: 'count',
        sorter: (a, b) => a.count - b.count,
        className: styles.alignRight,
      },
      {
        title: '周涨幅',
        dataIndex: 'range',
        key: 'range',
        sorter: (a, b) => a.range - b.range,
        render: (text, record) => (
          <Trend flag={record.status === 1 ? 'down' : 'up'}>
            <span style={{ marginRight: 4 }}>{text}%</span>
          </Trend>
        ),
        align: 'right',
      },
    ];

    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);

    const CustomTab = ({ data, currentTabKey: currentKey }) => (
      <Row gutter={8} style={{ width: 138, margin: '8px 0' }}>
        <Col span={12}>
          <NumberInfo
            title={data.name}
            subTitle="转化率"
            gap={2}
            total={`${data.cvr * 100}%`}
            theme={currentKey !== data.name && 'light'}
          />
        </Col>
        <Col span={12} style={{ paddingTop: 36 }}>
          <Pie
            animate={false}
            color={currentKey !== data.name && '#BDE4FF'}
            inner={0.55}
            tooltip={false}
            margin={[0, 0, 0, 0]}
            percent={data.cvr * 100}
            height={64}
          />
        </Col>
      </Row>
    );

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 24 },
    };

    return (
      <div>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="播放时长趋势"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={yuan(126560)}
              footer={
                <div>
                  <Trend flag="up" style={{ marginRight: 16 }}>
                    周同比<span className={styles.trendText}>12%</span>
                  </Trend>
                  <Trend flag="down">
                    日环比<span className={styles.trendText}>11%</span>
                  </Trend>
                </div>
              }
              contentHeight={46}
            >
              <MiniArea color="#ed7d31" data={visitData} />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="播放剧集量趋势"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(8846).format('0,0')}
              footer={
                <div>
                  <Trend flag="up" style={{ marginRight: 16 }}>
                    周同比<span className={styles.trendText}>12%</span>
                  </Trend>
                  <Trend flag="down">
                    日环比<span className={styles.trendText}>11%</span>
                  </Trend>
                </div>
              }
              contentHeight={46}
            >
              <MiniArea color="#ffc000" data={visitData} />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="客户端数量趋势"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(6560).format('0,0')}
              footer={
                <div>
                  <Trend flag="up" style={{ marginRight: 16 }}>
                    周同比<span className={styles.trendText}>12%</span>
                  </Trend>
                  <Trend flag="down">
                    日环比<span className={styles.trendText}>11%</span>
                  </Trend>
                </div>
              }
              contentHeight={46}
            >
              <MiniBar color="#4472c4" data={visitData} />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="运营活动效果"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total="78%"
              footer={
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  <Trend flag="up" style={{ marginRight: 16 }}>
                    周同比<span className={styles.trendText}>12%</span>
                  </Trend>
                  <Trend flag="down">
                    日环比<span className={styles.trendText}>11%</span>
                  </Trend>
                </div>
              }
              contentHeight={46}
            >
              <MiniProgress percent={78} strokeWidth={8} target={80} color="#13C2C2" />
            </ChartCard>
          </Col>
        </Row>


        { this.renderTrend() }
        { this.renderProvinceData() }


        <Row gutter={24}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              loading={loading}
              bordered={false}
              title="线上热门搜索"
              extra={iconGroup}
              style={{ marginTop: 24 }}
            >
              <Row gutter={68}>
                <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
                  <NumberInfo
                    subTitle={
                      <span>
                        搜索用户数
                        <Tooltip title="指标文案">
                          <Icon style={{ marginLeft: 8 }} type="info-circle-o" />
                        </Tooltip>
                      </span>
                    }
                    gap={8}
                    total={numeral(12321).format('0,0')}
                    status="up"
                    subTotal={17.1}
                  />
                  <MiniArea line height={45} data={visitData2} />
                </Col>
                <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
                  <NumberInfo
                    subTitle="人均搜索次数"
                    total={2.7}
                    status="down"
                    subTotal={26.2}
                    gap={8}
                  />
                  <MiniArea line height={45} data={visitData2} />
                </Col>
              </Row>
              <Table
                rowKey={record => record.index}
                size="small"
                columns={columns}
                dataSource={searchData}
                pagination={{
                  style: { marginBottom: 0 },
                  pageSize: 5,
                }}
              />
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              loading={loading}
              className={styles.salesCard}
              bordered={false}
              title="销售额类别占比"
              bodyStyle={{ padding: 24 }}
              extra={
                <div className={styles.salesCardExtra}>
                  {iconGroup}
                  <div className={styles.salesTypeRadio}>
                    <Radio.Group value={salesType} onChange={this.handleChangeSalesType}>
                      <Radio.Button value="all">全部渠道</Radio.Button>
                      <Radio.Button value="online">线上</Radio.Button>
                      <Radio.Button value="offline">门店</Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
              }
              style={{ marginTop: 24, minHeight: 509 }}
            >
              <h4 style={{ marginTop: 8, marginBottom: 32 }}>销售额</h4>
              <Pie
                hasLegend
                subTitle="销售额"
                total={yuan(salesPieData.reduce((pre, now) => now.y + pre, 0))}
                data={salesPieData}
                valueFormat={val => yuan(val)}
                height={248}
                lineWidth={4}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

