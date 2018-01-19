import React, { PureComponent } from 'react';
import moment from 'moment';
import { Link } from 'dva/router';
import { Card, Avatar } from 'antd';
import styles from './index.less';

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
                cover={<img alt={cardItem.title} src={cardItem.logo} />}
              >
                <Card.Meta
                  title={(
                    <div className={styles.cardTitle}>
                      <Link to=''>{cardItem.title}</Link>
                    </div>
                  )}
                  description={(
                    <div>
                    <div className={styles.projectItemContent}>
                      {cardItem.description} 
                    </div>
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
};

// <Rate allowHalf disabled defaultValue={2.5} />

/*
<Card.Meta
title={(
  <div className={styles.cardTitle}>
    <Avatar size="small" src={cardItem.logo} />
    <Link to={cardItem.href}>{cardItem.title}</Link>
  </div>
)}
description={cardItem.description}
/>
<div className={styles.projectItemContent}>
<Link to={cardItem.memberLink}>{cardItem.member || ''}</Link>
{cardItem.updatedAt && (
  <span className={styles.datetime} title={cardItem.updatedAt}>
    {moment(cardItem.updatedAt).fromNow()}
  </span>
)}
</div>
</Card>
*/
