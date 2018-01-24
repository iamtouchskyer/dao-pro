import React from 'react';
import { Card, Radio } from 'antd';
import { Chart, Tooltip, Geom, Legend, Axis, Coord, Label } from 'bizcharts';
import DataSet from '@antv/data-set';
import Slider from 'bizcharts-plugin-slider';
import autoHeight from '../autoHeight';

@autoHeight()
export default class HotSpotInvervalChart extends React.Component {
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate(nextProps) {
    return !_.isEqual(this.props.data, nextProps.data);
  }

  render() {
    const {
      data,
      cardProps,
    } = this.props;

    if (!data) {
      return (
        <div style={{ height: 400 }} />
      );
    }

    const dv = new DataSet.DataView();
    dv.source(data)
      .transform({
        type: 'map',
        callback({ videoname, play_count }) {
          return {
            name: videoname,
            count: play_count,
          }
        }
      });

    return (
      <Chart
        height={400}
        data={dv}
        scale={{
          count: { type: 'linear', alias: '观看数量' },
          name: { type: 'cat', alias: '影片名称' }
        }}
        padding={[ 80, 100, 80, 80 ]}
        forceFit>
        <Axis name="name" label={{ offset: 20 }} />
        <Axis name="count" label={{ offset: 20 }} />
        <Tooltip
          showTitle={false}
          itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
          />
        <Geom
          type="interval"
          position="name*count"
          color='name'
          style={{lineWidth: 1,stroke: '#fff'}}
          >
          <Label content='count' />
        </Geom>
      </Chart>
    );
  }
}
