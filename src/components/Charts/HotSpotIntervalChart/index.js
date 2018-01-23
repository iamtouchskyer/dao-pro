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

    this.state = {
      scope: '过去一年',
    };

    this.handleScopeChange = this.handleScopeChange.bind(this);
  }

  handleScopeChange(e) {
    this.setState({ scope: e.target.value });
  }

  render() {
    const {
      data,
      cardProps,
    } = this.props;

    if (!data) return null;

    const dv = new DataSet.DataView();
    dv.source(data)
      .transform({
        type: 'map',
        callback({ entity: { name }, count }) {
          return {
            name,
            count,
          }
        }
      });

    return (
      <Chart
        height={400}
        data={dv}
        scale={{
          count: { type: 'linear' },
          name: { type: 'cat' }
        }}
        padding={[ 80, 100, 80, 80 ]}
        forceFit>
        {/* <Coord type='theta' radius={0.75} /> */}
        <Axis name="name" />
        <Axis name="count" />
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
