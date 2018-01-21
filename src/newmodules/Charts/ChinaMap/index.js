import React from 'react';
import { Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape } from 'bizcharts';
import DataSet from '@antv/data-set';
import autoHeight from '../../../components/Charts/autoHeight';
import styles from '../../../components/Charts/index.less';
import chinaMapData from '../../../assets/china-geo.json';

const mappingTable =
  [
    {
      ProvicenName: '安徽',
      ProvinceId: 200,
    },
    {
      ProvicenName: '澳门',
      ProvinceId: 201,
    },
    {
      ProvicenName: '北京',
      ProvinceId: 202,
    },
    {
      ProvicenName: '重庆',
      ProvinceId: 203,
    },
    {
      ProvicenName: '福建',
      ProvinceId: 204,
    },
    {
      ProvicenName: '甘肃',
      ProvinceId: 205,
    },
    {
      ProvicenName: '广东',
      ProvinceId: 206,
    },
    {
      ProvicenName: '广西',
      ProvinceId: 207,
    },
    {
      ProvicenName: '贵州',
      ProvinceId: 208,
    },
    {
      ProvicenName: '海南',
      ProvinceId: 209,
    },
    {
      ProvicenName: '河北',
      ProvinceId: 210,
    },
    {
      ProvicenName: '黑龙江',
      ProvinceId: 211,
    },
    {
      ProvicenName: '河南省',
      ProvinceId: 212,
    },
    {
      ProvicenName: '湖北省',
      ProvinceId: 213,
    },
    {
      ProvicenName: '湖南省',
      ProvinceId: 214,
    },
    {
      ProvicenName: '江苏',
      ProvinceId: 215,
    },
    {
      ProvicenName: '江西',
      ProvinceId: 216,
    },
    {
      ProvicenName: '吉林',
      ProvinceId: 217,
    },
    {
      ProvicenName: '辽宁',
      ProvinceId: 218,
    },
    {
      ProvicenName: '内蒙古',
      ProvinceId: 219,
    },
    {
      ProvicenName: '宁夏',
      ProvinceId: 220,
    },
    {
      ProvicenName: '青海',
      ProvinceId: 221,
    },
    {
      ProvicenName: '山东',
      ProvinceId: 222,
    },
    {
      ProvicenName: '上海',
      ProvinceId: 223,
    },
    {
      ProvicenName: ' 陕西',
      ProvinceId: 224,
    },
    {
      ProvicenName: '山西',
      ProvinceId: 225,
    },
    {
      ProvicenName: '四川',
      ProvinceId: 226,
    },
    {
      ProvicenName: '台湾',
      ProvinceId: 227,
    },
    {
      ProvicenName: '天津',
      ProvinceId: 228,
    },
    {
      ProvicenName: '香港',
      ProvinceId: 229,
    },
    {
      ProvicenName: '新疆 ',
      ProvinceId: 230,
    },
    {
      ProvicenName: '西藏',
      ProvinceId: 231,
    },
    {
      ProvicenName: '云南',
      ProvinceId: 232,
    },
    {
      ProvicenName: '浙江',
      ProvinceId: 233,
    },
  ];

@autoHeight()
export default class ChinaMapChart extends React.Component {
  constructor(props) {
    super(props);

    this.ds = new DataSet();
    this.chinaMap = this.ds.createView('back')
      .source(chinaMapData, {
        type: 'GeoJSON',
      });

    this.userData = [
      { name: '北京', value: 16.3 },
      { name: '上海', value: 106.3 },
      { name: '天津', value: 330 },
      { name: '重庆', value: 150 },
      { name: '河北', value: 110 },
      { name: '河南', value: 130 },
      { name: '云南', value: 120 },
      { name: '辽宁', value: 430 },
      { name: '黑龙江', value: 60 },
      { name: '湖南', value: 70 },
      { name: '安徽', value: 60 },
      { name: '山东', value: 70 },
      { name: '新疆', value: 70 },
      { name: '江苏', value: 80 },
      { name: '浙江', value: 70 },
      { name: '江西', value: 1430 },
      { name: '湖北', value: 30 },
      { name: '广西', value: 40 },
      { name: '甘肃', value: 3 },
      { name: '山西', value: 5 },
      { name: '内蒙古', value: 10 },
      { name: '陕西', value: 40 },
      { name: '吉林', value: 30 },
      { name: '福建', value: 40 },
      { name: '贵州', value: 30 },
      { name: '广东', value: 430 },
      { name: '青海', value: 30 },
      { name: '西藏', value: 20 },
      { name: '四川', value: 10 },
      { name: '宁夏', value: 4320 },
      { name: '海南', value: 10 },
      { name: '台湾', value: 4210 },
      { name: '香港', value: 430 },
      { name: '澳门', value: 30 },
    ];
  }

  render() {
    const userDv = this.ds.createView()
      .source(this.props.data)
      .transform({
        geoDataView: this.chinaMap,
        field: 'name',
        type: 'geo.region',
        as: ['longitude', 'latitude'],
      })
      .transform({
        type: 'map',
        callback(obj) {
          return obj;
        },
      });

    const cols = {
      longitude: {
        sync: true,
      },
      latitude: {
        sync: true,
      },
    };

    const {
      title,
      height = 1200,
      padding = [20, 20, 20, 20],
      borderWidth = 2,
      data = this.userData,
    } = this.props;

    return (
      <div style={{ height }}>
        {height > 0 && (
          <Chart height={height} data={data} scale={cols} padding={padding} forceFit>
            <Tooltip showTitle={false} />
            <View data={this.chinaMap} >
              <Geom type="polygon" tooltip={false} position="longitude*latitude" style={{ fill: '#fff', stroke: '#ccc', lineWidth: 1 }} />
            </View>
            <View data={userDv}
              scale={{
                trend: {
                  alias: '数量',
                },
              }}
            >
              <Geom type="polygon" position="longitude*latitude" animate={{ leave: { animation: 'fadeOut' } }} opacity="value" tooltip="name*value" color={['trend', '#4472c4']} size={0}>
                <Label content="name" offset={0} textStyle={{ fill: '#545454', fontSize: 14 }} />
              </Geom>
            </View>
            <Geom type="polygon" position="x*y" style={{ lineWidth: 1, stroke: '#fff' }} color={['count', ['rgb(200, 200, 255)', 'rgb(0, 0, 255)']]} />
          </Chart>
        )}
      </div>
    );
  }
}

/* ' -#ed7d31-#a5a5a5-#ffc000-#5b9bd5-#70ad47 */