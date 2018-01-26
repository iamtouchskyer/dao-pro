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

export default class PercentageChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      category: 'activeClients',
      date: moment(moment(_.last(props.data).date)),
    };
  }

  render() {
    const { data, cardProps } = this.props;

    if (_.isEmpty(data)) {
      return null;
    }

    const pieData = _.chain(data)
      .find(d => this.state.date.isSame(d.date, 'day'))
      .result('categories')
      .result(this.state.category)
      .map('dimensions')
      .map(this.props.dimension === 'app' ? 'application' : 'channel')
      .flatten()
      .reduce((memo, cur) => {
        const idKey = `${this.props.dimension}Id`;
        const key = cur[idKey];

        return _.defaults({}, {
          [key]: _.isNaN(memo[key]) ? Number(cur.total) : memo[key] + cur.total,
        }, memo);
      }, {})
      .map((value, key) => ({ x: key, y: value }))
      .value();


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

    const renderPanel = (key, name) => (
      <Tabs.TabPane tab={name} key={key}>
        <Pie
          hasLegend={this.props.dimension === 'app'}
          subTitle={name}
          total={pieData.reduce((pre, now) => now.y + pre, 0)}
          data={pieData}
          height={248}
          lineWidth={4}
        />
      </Tabs.TabPane>
    );

    return (
      <Card
        {...cardProps}
        extra={cardExtra}
      >
        <Tabs
          onChange={(key) => {
            this.setState({
              category: key,
            });
          }}
          tabPosition={this.state.category}
        >
          {renderPanel('activeClients', '活跃客户端')}
          {renderPanel('newClients', '新增客户端')}
          {renderPanel('countOfWhatchedMedia', '播放剧集数量')}
          {renderPanel('totalWatchedTime', '播放时长')}
        </Tabs>
      </Card>
    );
  }
}
