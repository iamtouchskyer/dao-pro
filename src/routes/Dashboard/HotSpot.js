import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Tabs,
  Row,
  Col,
  Card,
  Tooltip,
  DatePicker,
  Select,
  Cascader
} from 'antd';
import numeral from 'numeral';
import Authorized from '../../utils/Authorized';
import { Pie, WaterWave, Gauge, TagCloud, Bar } from '../../components/Charts';
import NumberInfo from '../../components/NumberInfo';
import CountDown from '../../components/CountDown';
import ActiveChart from '../../components/ActiveChart';
import HotSpotInvervalChart from '../../components/Charts/HotSpotIntervalChart/index';
import styles from './Monitor.less';
import { getTimeDistance } from '../../utils/utils';
import kindMetadata from '../../../metadata/kind';
import areaMetadata from '../../../metadata/area';

const { Secured } = Authorized;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const targetTime = new Date().getTime() + 3900000;
function handleChange(value) {
  console.log(`selected ${value}`);
}
// use permission as a parameter
const havePermissionAsync = new Promise((resolve) => {
  // Call resolve on behalf of passed
  setTimeout(() => resolve(), 1000);
});
@Secured(havePermissionAsync)
@connect(({ cibnHot, loading }) => ({
  cibnHot,
  loading: loading.effects['cibnHot/fetchFilter'],
}))
export default class HotSpot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kind: 'movie',
      filter: {},
      location: null,
      rangePickerValue: getTimeDistance('thisYear'),
    };
  }

  componentDidMount() {
    this.onChangeKind('movie');
    this.fetchPlayCount({});
  }

  fetchFilter(kind) {
    this.props.dispatch({
      type: 'cibnHot/fetchFilter',
      payload: {
        kind,
      },
    });
  }

  fetchPlayCount(condition) {
    const updatedState = _.defaults(condition, this.state);

    this.props.dispatch({
      type: 'cibnHot/fetchPlayCount',
      payload: {
        kind: updatedState.kind,
        language: updatedState.filter.language,
        category: updatedState.filter.category,
        musicstyle: updatedState.filter.musicstyle,
        location: updatedState.filter.location,
        areaId: updatedState.areaId,
      },
    });
  }

  onChangeAreaId(areaId) {
    this.setState({ areaId });
    this.fetchPlayCount({ areaId });
  }

  onChangeKind(kind) {
    this.setState({ kind });
    this.fetchFilter(kind);
  }

  onChangeFilter(name, value) {
    const filter = (value === 'all')
      ? _.omit(this.state.filter, name)
      : _.defaults({
          [name]: value,
        }, this.state.filter);
    this.setState({ filter });
    this.fetchPlayCount({ filter });
  }

  selectDate = (type) => {
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    this.fetchPlayCount();
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

  render() {
    const { cibnHot } = this.props;
    const { filter, playCount } = cibnHot;

    if (filter) {
      return (
        <div>
          <Cascader defaultValue={[1]} options={areaMetadata} onChange={(value) => { this.onChangeAreaId(value[value.length-1])}} showSearch />
          <label>
            类别：
            <Select defaultValue="movie" style={{ width: 120 }} onChange={(value) => { this.onChangeKind(value) }}>
              {_.map(kindMetadata, (meta, kind) => {
                return <Option value={kind} key={kind}>{meta.name}</Option>
              })}
            </Select>
          </label>
          {_.map(filter, (options, name) => {
            return (
              <label key={name}>
                {name}:
                <Select defaultValue="all" style={{ width: 120 }} onChange={(value) => { this.onChangeFilter(name, value) }}>
                  <Option value="all">全部</Option>
                  {_.map(options, (option, index) => {
                    return <Option value={option} key={option}>{option}</Option>
                  })}
                </Select>
              </label>
            );
          })}
          { this.renderDatePicker() }
          { playCount ?
            <HotSpotInvervalChart data = {playCount}/> :
            null
          }}
        </div>
      );
    }
    return null;
  }
}
