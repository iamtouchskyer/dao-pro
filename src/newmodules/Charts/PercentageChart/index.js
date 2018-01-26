import React from 'react';
import {
  Card,
  DatePicker,
  Tabs,
  Radio,
} from 'antd';
import moment from 'moment';
import {
  yuan,
  Pie,
} from '../../../components/Charts';

export default class PercentageChart extends React.Component {
  render() {
    const { data, disabledDate, cardProps } = this.props;
    const pieData = data;

    const cardExtra = (
      <div>
        <Radio.Group>
          <Radio.Button value="app" key="app">App占比</Radio.Button>
          <Radio.Button value="channel" key="channel">渠道占比</Radio.Button>
        </Radio.Group>
        <DatePicker
          defaultValue={moment()}
          disabledDate={disabledDate}
          style={{ marginLeft: 20 }}
        />
      </div>
    );

    const pie = (
      <Pie
        hasLegend
        subTitle="销售额"
        total={yuan(pieData.reduce((pre, now) => now.y + pre, 0))}
        data={pieData}
        valueFormat={val => yuan(val)}
        height={248}
        lineWidth={4}
      />
    );

    return (
      <Card
        {...cardProps}
        extra={cardExtra}
      >
        <Tabs>
          <Tabs.TabPane tab="活跃客户端" key="activeClients">
            {pie}
          </Tabs.TabPane>
          <Tabs.TabPane tab="新增客户端" key="newClients">
            {pie}
          </Tabs.TabPane>
          <Tabs.TabPane tab="播放剧集数量" key="countOfWhatchedMedia">
            {pie}
          </Tabs.TabPane>
          <Tabs.TabPane tab="播放时长" key="totalWatchedTime">
            {pie}
          </Tabs.TabPane>
        </Tabs>
      </Card>
    );
  }
}
