import React from 'react';
import _ from 'lodash';
import {
  Card,
  DatePicker,
  Tabs,
  Radio,
} from 'antd';
import moment from 'moment';
import {
  Pie,
} from '../../../components/Charts';
import { humanizeMilliseconds } from  '../../../utils/utils';

export default class PercentageChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: moment(moment(_.last(props.data).date)),
    };
  }

  render() {
    const { data, cardProps } = this.props;

    if (_.isEmpty(data)) {
      return null;
    }

    const cardExtra = (
      <DatePicker
        value={this.state.date}
        onChange={(date) => {
          this.setState({
            date,
          });
        }}
        disabledDate={(currentDate) => {
          return _.findIndex(data, (d) => {
            return currentDate.isSame(d.date, 'day');
          }) === -1;
        }}
        style={{ marginLeft: 20 }}
      />
    );

    const renderPanel = (panelKey, name) => {
      const pieData = _.chain(data)
        .find(d => this.state.date.isSame(d.date, 'day'))
        .result('categories')
        .result(panelKey)
        .map('dimensions')
        .map(this.props.dimension === 'app' ? 'application' : 'channel')
        .flatten()
        .reduce((memo, cur) => {
          const idKey = `${this.props.dimension}Id`;
          const key = cur[idKey];

          return _.defaults({}, {
            [key]: _.isNumber(memo[key]) ? memo[key] + cur.total : Number(cur.total),
          }, memo);
        }, {})
        .map((value, key) => ({ x: key, y: value }))
        .value();

      return (
        <Tabs.TabPane tab={name} key={panelKey}>
          <Pie
            hasLegend={this.props.dimension === 'app'}
            subTitle={name}
            total={panelKey === 'totalWatchedTime' ? humanizeMilliseconds(pieData.reduce((pre, now) => now.y + pre, 0)) : pieData.reduce((pre, now) => now.y + pre, 0)}
            data={pieData}
            height={248}
            lineWidth={4}
            valueFormat={panelKey === 'totalWatchedTime' ? v => humanizeMilliseconds(v, { hoursOnly: true }) : v => v}
          />
        </Tabs.TabPane>
      );
    };

    return (
      <Card
        {...cardProps}
        extra={cardExtra}
      >
        <Tabs >
          {renderPanel('activeClients', '活跃客户端')}
          {renderPanel('newClients', '新增客户端')}
          {renderPanel('countOfWhatchedMedia', '播放剧集数量')}
          {renderPanel('totalWatchedTime', '播放时长')}
        </Tabs>
      </Card>
    );
  }
}
