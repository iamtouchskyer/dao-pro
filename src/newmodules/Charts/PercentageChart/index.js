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
      dimension: 'app',
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
      .map(this.state.dimension === 'app' ? 'application' : 'channel')
      .flatten()
      .reduce((memo, cur) => {
        const idKey = `${this.state.dimension}Id`;
        const key = cur[idKey];

        return _.defaults({}, {
          [key]: _.isNaN(memo[key]) ? Number(cur.total) : memo[key] + cur.total,
        }, memo);
      }, {})
      .map((value, key) => ({ x: key, y: value }))
      .value();


    const cardExtra = (
      <div>
        <Radio.Group
          value={this.state.dimension}
          onChange={(e) => {
            this.setState({
              dimension: e.target.value,
            });
          }}
        >
          <Radio.Button value="app" key="app">App占比</Radio.Button>
          <Radio.Button value="channel" key="channel">渠道占比</Radio.Button>
        </Radio.Group>
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
      </div>
    );

    const renderPanel = (key, name) => (
      <Tabs.TabPane tab={name} key={key}>
        <Pie
          hasLegend
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
