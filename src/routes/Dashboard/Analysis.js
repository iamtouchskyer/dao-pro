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
    /*
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });

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

  renderDatePicker = ({
    value = this.state.rangePickerValue,
    onChange = this.handleRangePickerChange,
    onClickToday = () => this.selectDate('today'),
    onClickWeek = () => this.selectDate('week'),
    onClickMonth = () => this.selectDate('month'),
    onClickThisYear = () => this.selectDate('thisYear'),
  } = {}) => {
    return (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <a className={this.isActive('today')} onClick={onClickToday}>
            今日
          </a>
          <a className={this.isActive('week')} onClick={onClickWeek}>
            本周
          </a>
          <a className={this.isActive('month')} onClick={onClickMonth}>
            本月
          </a>
          <a className={this.isActive('year')} onClick={onClickThisYear}>
            全年
          </a>
        </div>
        <RangePicker
          value={value}
          onChange={onChange}
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
                { title: '活跃客户端趋势', data: activeDeviceTrend, color: '#4472c4' },
                { title: '省份Top10', data: provinceADTop10 },
              )
            }

            {
              this.renderTabPane(
                { tab: '新增客户端', key: 'newclients' },
                { title: '新增客户端趋势', data: newDeviceTrend, color: '#ffc000' },
                { title: '省份Top10', data: provinceNDTop10 },
              )
            }

            {
              this.renderTabPane(
                { tab: '播放剧集数目', key: 'counts' },
                { title: '播放剧集数目趋势', data: totalWatchTimeTrend, color: '#70ad47' },
                { title: '省份Top10', data: provinceTWTTop10 },
              )
            }

            {
              this.renderTabPane(
                { tab: '播放时长', key: 'totaltime' },
                { title: '播放时长趋势', data: totalNumberOfWatchedMediaTrend, color: '#ed7d31' },
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
    const { provinceFilter, provinceMapData } = operationData;

    const filterBar = (
      <div>
        <Radio.Group
          value={provinceFilter.filterValue}
          onChange={(e) => {
            this.props.dispatch({
              type: 'operationData/updateProvinceFilter',
              payload: {
                filterBy: 'app',
                filterValue: e.target.value,
              },
            });
          }}
        >
          <Radio.Button value="0">全部App</Radio.Button>
          {provinceFilter.allAppIds.map(i => (
            <Radio.Button key={i} value={i}>{i}</Radio.Button>
          ))}
        </Radio.Group>
        <Radio.Group
          value={provinceFilter.filterValue}
          onChange={(e) => {
            this.props.dispatch({
              type: 'operationData/updateProvinceFilter',
              payload: {
                filterBy: 'channel',
                filterValue: e.target.value,
              },
            });
          }}
          style={{ marginLeft: 20 }}
        >
          <Radio.Button value="-1">全部Channel</Radio.Button>
          {provinceFilter.allChannels.slice(0, 4).map(i => (
            <Radio.Button key={i} value={i}>{i}</Radio.Button>
          ))}
          <Select
            value={provinceFilter.allChannels.indexOf(provinceFilter.filterValue) > 4 ? provinceFilter.filterValue : '更多'}
            defaultValue="更多"
            style={{ width: 100 }}
            onChange={(value) => {
              this.props.dispatch({
                type: 'operationData/updateProvinceFilter',
                payload: {
                  filterBy: 'channel',
                  filterValue: value,
                },
              });
            }}
          >
            {provinceFilter.allChannels.slice(4).map(i => (
              <Select.Option key={i}>{i}</Select.Option>
            ))}
          </Select>
          <DatePicker
            value={provinceFilter.date}
            disabledDate={provinceFilter.disabledDate}
            onChange={(date) => {
              this.props.dispatch({
                type: 'operationData/updateProvinceFilter',
                payload: {
                  date,
                },
              });
            }}
            style={{ marginLeft: 20 }}
          />
        </Radio.Group>
      </div>
    );

    return (
      <Card
        loading={loading}
        className={styles.salesCard}
        bordered={false}
        bodyStyle={{ padding: 24 }}
        style={{ marginTop: 24, minHeight: 500 }}
      >
        <Tabs
          onChange={(key) => {
            this.props.dispatch({
              type: 'operationData/updateProvinceFilter',
              payload: {
                categoryName: key,
              },
            });
          }}
        >
          <TabPane tab="活跃客户端地域分布" key="activeClients" >
            {filterBar}
            <ChinaMapChart height={1200} data={provinceMapData} />
          </TabPane>
          <TabPane tab="新增客户端地域分布" key="newClients">
            {filterBar}
            <ChinaMapChart height={1200} data={provinceMapData} />
          </TabPane>
          <TabPane tab="播放剧集数量地域分布" key="countOfWhatchedMedia">
            {filterBar}
            <ChinaMapChart height={1200} data={provinceMapData} />
          </TabPane>
          <TabPane tab="播放时长地域分布" key="totalWatchedTime">
            {filterBar}
            <ChinaMapChart height={1200} data={provinceMapData} />
          </TabPane>
        </Tabs>
      </Card>
    );
  };

  renderPast7DayChartCardGroup = () => {
    const { operationData, loading } = this.props;
    const {
      newDeviceTrend,
      activeDeviceTrend,
      totalWatchTimeTrend,
      totalNumberOfWatchedMediaTrend,
    } = operationData;

    const last7DayActiveDeviceTrend = _.takeRight(activeDeviceTrend, 7);
    const last7DayTotalWatchTimeTrend = _.takeRight(totalWatchTimeTrend, 7);
    const last7DayNewDeviceTrend = _.takeRight(newDeviceTrend, 7);
    const last7DayTotalNumberOfWatchedMediaTrend = _.takeRight(totalNumberOfWatchedMediaTrend, 7);

    return (
      <Row gutter={24}>
        {this.renderPast7DayChartCard('miniBar', loading, '过去七天活跃客户端', '#4472c4', last7DayActiveDeviceTrend, { type: 'field', label: '平均活跃用户', value: _.sumBy(last7DayActiveDeviceTrend, dayData => dayData.y) / 7 })}
        {this.renderPast7DayChartCard('miniArea', loading, '过去七天新增客户端', '#ffc000',
            last7DayNewDeviceTrend, {
            type: 'field', label: '平均新增客户端', value: _.sumBy(last7DayNewDeviceTrend, dayData => dayData.y) / 7,
            /*
            type: 'trend',
            value: [
              { label: '七日同比', percentage: 0 },
              { label: '七日环比', percentage: 0 },
            ],
            */
          })}
        {this.renderPast7DayChartCard('miniBar', loading, '过去七天播放剧集数量', '#70ad47',
            last7DayTotalNumberOfWatchedMediaTrend, {
            type: 'field', label: '平均播放剧集数量', value: _.sumBy(last7DayTotalNumberOfWatchedMediaTrend, dayData => dayData.y) / 7,
              /*
            type: 'trend',
            value: [
              { label: '七日同比', percentage: 0 },
              { label: '七日环比', percentage: 0 },
            ],
            */
          })}
        {this.renderPast7DayChartCard('miniArea', loading, '过去七天播放时长', '#ed7d31', 
            last7DayTotalWatchTimeTrend, { type: 'field', label: '平均播放时长', value: _.sumBy(last7DayTotalWatchTimeTrend, dayData => dayData.y) / 7 })}
      </Row>
    );
  }

  renderPast7DayChartCard = (whichChart, loading, title, color, chartData, footer) => {
  /* {label: '周同比', percentage: }, */
    const _renderChartCardTrendGroup = (arr) => {
      const _renderTrend = (label, percentage) => {
        return (
          <Trend flag= {percentage > 0 ? 'up' : percentage === 0 ? '' : 'down'}
                  style={{ marginRight: 16 }}>
            {label}:<span className={styles.trendText}>{`${ percentage}%`}</span>
          </Trend>
        );
      };

      return (
        <div>
          {
            _.map(arr, (element) => {
              return _renderTrend(element.label, element.percentage);
            })
          }
        </div>
      );
    };

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 24 },
    };

    let footerElement = null;

    if (footer.type === 'field') {
      footerElement = <Field label={footer.label} value={numeral(footer.value).format('0')} />;
    } else if (footer.type === 'trend') {
      footerElement = _renderChartCardTrendGroup(footer.value);
    }

    let miniChartElement = null;
    if (whichChart === 'miniBar') {
      miniChartElement = (<MiniBar data={chartData} color={color} />);
    } else {
      miniChartElement = (<MiniArea data={chartData} color={color} />);
    }

    return (
      <Col {...topColResponsiveProps}>
        <ChartCard
          loading={loading}
          bordered={false}
          title={title}
          action={<Tooltip title="指标说明"> <Icon type="info-circle-o" /> </Tooltip>}
          footer={footerElement}
          contentHeight={90}
        >
          { miniChartElement }
        </ChartCard>
      </Col>
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
        key: 'userCount',
        sorter: (a, b) => a.count - b.count,
        className: styles.alignRight,
      },
      {
        title: '搜索次数',
        dataIndex: 'count',
        key: 'searchCount',
        sorter: (a, b) => a.count - b.count,
        className: styles.alignRight,
      },
      {
        title: '过去七天涨幅',
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


    return (
      <div>
        { this.renderPast7DayChartCardGroup() }
        { this.renderTrend() }
        { this.renderProvinceData() }

        <Row gutter={24}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              loading={loading}
              bordered={false}
              title="热门搜索关键字"
              extra={iconGroup}
              style={{ marginTop: 24 }}
            >
              <Row gutter={68}>
                <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
                  <NumberInfo
                    subTitle="搜索用户数"
                    gap={8}
                    total="-"
                    status=""
                    subTotal="-"
                  />
                  <MiniArea line height={45} data={[]} />
                </Col>
                <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
                  <NumberInfo
                    subTitle="人均搜索次数"
                    total="-"
                    status=""
                    subTotal="-"
                    gap={8}
                  />
                  <MiniArea line height={45} data={[]} />
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
                      <Radio.Button key="all" value="all">全部渠道</Radio.Button>
                      <Radio.Button key="online" value="online">线上</Radio.Button>
                      <Radio.Button key="offline" value="offline">门店</Radio.Button>
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

