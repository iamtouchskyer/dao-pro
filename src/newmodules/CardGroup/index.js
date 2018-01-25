import React, { PureComponent } from 'react';
import moment from 'moment';
import { Link } from 'dva/router';
import { Card, Avatar } from 'antd';
import styles from './index.less';
import Ellipsis from '../../components/Ellipsis';

export default class CardGroup extends PureComponent {

  render() {
    const {
      cardTitle,
      extraLinkTitle, extraLink,
      loading,
      cards,
    } = this.props;

    return (
      <Card
        className={styles.projectList}
        style={{ marginBottom: 24 }}
        title={cardTitle}
        bordered={false}
        loading={loading}
        bodyStyle={{ padding: 0 }}
      >
        {
          cards.map(cardItem => (
            <Card.Grid className={styles.projectGrid} key={cardItem.id}>
              <Card
                bodyStyle={{ padding: 0 }}
                bordered={false}
              >
                <Card.Meta
                  title={<div className={styles.cardTitle}>{cardItem.vname}</div>}
                  description={(
                    <Ellipsis tooltip lines={5}>
                      {
                      `${cardItem.area};${cardItem.videotype};${cardItem.category};${cardItem.taginfo}`
                      }
                    </Ellipsis>
                  )}
                />
              </Card>
            </Card.Grid>
          ))
        }
      </Card>
    );
  }
};

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
