import React, { Component, PureComponent } from 'react';
import { connect } from 'dva';
import {
  Tabs,
  Row,
  Col,
  Card,
  Tooltip,
  DatePicker,
  Select,
  Cascader,
} from 'antd';
import numeral from 'numeral';
import Authorized from '../../utils/Authorized';
import { Pie, WaterWave, Gauge, TagCloud, Bar } from '../../components/Charts';
import NumberInfo from '../../components/NumberInfo';
import CountDown from '../../components/CountDown';
import ActiveChart from '../../components/ActiveChart';
import HotSpotInvervalChart from '../../components/Charts/HotSpotIntervalChart/index';
import styles from './Analysis.less';
import { getTimeDistance } from '../../utils/utils';
import kindMetadata from '../../../metadata/kind';
import areaMetadata from '../../../metadata/area';
import TopWrapper from './Top/TopWrapper';
import moment from 'moment';

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
export default class TopList extends PureComponent {
  constructor(props) {
    super(props);
  }

  renderTopCard = (title, payload) => {
    return (
      <Card
        title={title}
        bordered={false}
        bodyStyle={{ padding: 0 }}
      >
        <TopWrapper payload={payload} />
      </Card>
    );
  }

  render() {

    const topColResponsiveProps = {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 24,
      xl: 12,
      style: { marginBottom: 24 },
    };

    const now = moment(new Date(2018, 0, 22)).startOf('day');
    const previous7days = {
      startDate: now.clone().subtract(7, 'day').toDate(),
      endDate: now.toDate()
    };

    const previous15days = {
      startDate: now.clone().subtract(15, 'day'),
      endDate: now
    };

    return (
      <div>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            { this.renderTopCard('七日热门电影', {
              kind: 'movie',
              ...previous7days
            }) }
          </Col>
          <Col {...topColResponsiveProps}>
            { this.renderTopCard('十五日热门电影', {
              kind: 'movie',
              ...previous15days
            }) }
          </Col>
        </Row>

        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            { this.renderTopCard('七日热门电视剧', {
              kind: 'tv',
              ...previous7days
            }) }
          </Col>
          <Col {...topColResponsiveProps}>
            { this.renderTopCard('十五日热门电视剧', {
              kind: 'tv',
              ...previous15days
            }) }
          </Col>
        </Row>

        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            {this.renderTopCard('七日热门少儿节目', {
              kind: 'children',
              ...previous7days
            })}
          </Col>
          <Col {...topColResponsiveProps}>
            {this.renderTopCard('十五日热门少儿节目', {
              kind: 'children',
              ...previous15days
            })}
          </Col>
        </Row>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            {this.renderTopCard('七日热门动漫', {
              kind: 'manga',
              ...previous7days
            })}
          </Col>
          <Col {...topColResponsiveProps}>
            {this.renderTopCard('十五日热门动漫', {
              kind: 'manga',
              ...previous15days
            })}
          </Col>
        </Row>

        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            {this.renderTopCard('七日热门综艺', {
              kind: 'variety',
              ...previous7days
            })}
          </Col>
          <Col {...topColResponsiveProps}>
            {this.renderTopCard('十五日热门综艺', {
              kind: 'variety',
              ...previous15days
            })}
          </Col>
        </Row>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            {this.renderTopCard('七日热门戏曲', {
              kind: 'theatre',
              ...previous7days
            })}
          </Col>
          <Col {...topColResponsiveProps}>
            {this.renderTopCard('十五日热门戏曲', {
              kind: 'theatre',
              ...previous15days
            })}
          </Col>
        </Row>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            {this.renderTopCard('七日热门禅文化节目', {
              kind: 'dhyana',
              ...previous7days
            })}
          </Col>
          <Col {...topColResponsiveProps}>
            {this.renderTopCard('十五日热门禅文化节目', {
              kind: 'dhyana',
              ...previous15days
            })}
          </Col>
        </Row>
      </div>
    );
  }
}
