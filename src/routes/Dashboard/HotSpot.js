import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Tabs,
  Row,
  Col,
  Card,
  Tooltip,
  DatePicker,
  Select
} from 'antd';
import numeral from 'numeral';
import Authorized from '../../utils/Authorized';
import { Pie, WaterWave, Gauge, TagCloud, Bar } from '../../components/Charts';
import NumberInfo from '../../components/NumberInfo';
import CountDown from '../../components/CountDown';
import ActiveChart from '../../components/ActiveChart';
import styles from './Monitor.less';
import { getTimeDistance } from '../../utils/utils';
import kindMetadata from '../../../metadata/kind';

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
      filter: {}
    };
  }

  componentDidMount() {
    this.onChangeKind('movie');
  }

  onChangeKind(kind) {
    this.setState({ kind });
    this.props.dispatch({
      type: 'cibnHot/fetchFilter',
      payload: {
        kind,
      },
    });
  }

  onChangeFilter(name, value) {
    if (value === 'all') {
      this.setState({
        filter: _.omit(this.state.filter, name)
      })
    } else {
      this.setState({
        filter: _.defaults({
          [name]: value,
        }, this.state.filter)
      })
    }
    this.props.dispatch({
      type: 'cibnHot/fetchPlayCount',
    });
  }

  render() {
    const { cibnHot } = this.props;
    const { filter } = cibnHot;

    if (filter) {
      return (
        <div>
          <Select defaultValue="movie" style={{ width: 120 }} onChange={(value) => { this.onChangeKind(value) }}>
            {_.map(kindMetadata, (meta, kind) => {
              return <Option value={kind} key={kind}>{meta.name}</Option>
            })}
          </Select>
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
        </div>
      );
    }
    return null;
  }
}
