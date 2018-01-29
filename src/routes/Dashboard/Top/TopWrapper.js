import React, { Component, PureComponent } from 'react';
import _ from 'lodash';
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
import Authorized from '../../../utils/Authorized';
import HotSpotInvervalChart from '../../../components/Charts/HotSpotIntervalChart/index';
import stringify from 'json-stable-stringify';

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

export default class TopWrapper extends Component {
  shouldComponentUpdate(nextProps) {
    return !_.isEqual(this.props.payload, nextProps.payload);
  }

  render() {
    const { payload } = this.props;

    @connect(({ cibnHot, loading }) => ({
      playCount: cibnHot.playCount[stringify(payload)],
      // loading: loading.effects['cibnHot/fetchPlayCount'] || loading.models.cibnHot,
    }))
    class TopChart extends PureComponent {
      componentDidMount() {
        this.props.dispatch({
          type: 'cibnHot/fetchPlayCount',
          payload,
        });
      }

      render() {
        const { playCount } = this.props;
        this.data = playCount;
        this.payload = payload;
        return <HotSpotInvervalChart data = {playCount}/>;
      }
    }

    return <TopChart />;
  }
}
