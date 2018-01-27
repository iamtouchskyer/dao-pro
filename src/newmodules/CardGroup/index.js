import React, { PureComponent } from 'react';
import moment from 'moment';
import { Link } from 'dva/router';
import { Card, Row, Col, Avatar, Icon } from 'antd';
import styles from './index.less';
import Ellipsis from '../../components/Ellipsis';

export default class CardGroup extends PureComponent {

  renderOneLineOfDesc = (label, value) => {
    return (
      <Row gutter={24}>
        <Col xl={8} lg={8} md={8} sm={8} xs={8}>
          {`${label}:`}
        </Col>
        <Col xl={16} lg={16} md={16} sm={16} xs={16}>
          {value}
        </Col>
      </Row>
    );
  };

  render() {
    const {
      cardTitle,
      loading,
      cards,
    } = this.props;

    return (
      <Card
        className={styles.projectList}
        style={{ marginBottom: 12 }}
        bordered={false}
        loading={loading}
        bodyStyle={{ padding: 0 }}
      >
        {
          cards.map(cardItem => (
            <Card.Grid className={styles.projectGrid} key={cardItem.id} style={{ padding: 4 }}>
              <Card
                bodyStyle={{ padding: 0 }}
                bordered={false}
                key={cardItem.vid}
                actions={[<Icon type="like" />, <Icon type="dislike" />, <Icon type="ellipsis" />]}
              >
                <Card.Meta
                  style={{ minHeight: 180 }}
                  title={<div className={styles.cardTitle}>{cardItem.vname}</div>}
                  description={(
                    <div style={{ minHeight: 180 }}>
                      <Ellipsis tooltip lines={8}>
                        { this.renderOneLineOfDesc('地区', cardItem.area) }
                        { this.renderOneLineOfDesc('年份', cardItem.issueyear) }
                        { this.renderOneLineOfDesc('类型', cardItem.videotype) }
                        { this.renderOneLineOfDesc('分类', cardItem.category) }
                        { this.renderOneLineOfDesc('标签', cardItem.taginfo) }
                      </Ellipsis>
                    </div>
                  )}
                />
              </Card>
            </Card.Grid>
          ))
        }
      </Card>
    );
  }
}

//`${cardItem.area};${cardItem.videotype};${cardItem.category};${cardItem.taginfo}`

// <Rate allowHalf disabled defaultValue={2.5} />

/*
              <Card
                bodyStyle={{ padding: 0 }}
                bordered={false}
                cover={<img alt={cardItem.title} src={cardItem.logo} />}
              >
                <Card.Meta
                  title={<div className={styles.cardTitle}>{cardItem.title}</div>}
                  description={(
                    <Ellipsis tooltip lines={5}>{cardItem.description}</Ellipsis>
                  )}
                />
              </Card>

*/
