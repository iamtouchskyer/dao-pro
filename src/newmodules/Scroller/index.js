import React from 'react';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';

import CardGroup from '../CardGroup';

export default class Scroller extends React.Component {
  state = {
    data: [],
    loading: false,
    hasMore: true,
  }

  componentWillReceiveProps() {
    const keys = _.keys(this.props.fullData);
    const values = _.values(this.props.fullData);

    this.setState({
      hasMore: !_.isEmpty(values) && values.length > 1,
      dataKey: _.first(keys),
      data: _.isEmpty(values) ? [] : _.first(values),
    });
  }

  handleInfiniteOnLoad = () => {
    const keys = _.keys(this.props.fullData);
    const values = _.values(this.props.fullData);
    const currentDataKeyIndex = _.indexOf(_.keys(this.props.fullData), this.state.dataKey);
    const dataKeyNext = keys[currentDataKeyIndex + 1];

    if (!values[dataKeyNext]) {
      this.setState({
        hasMore: false,
      });
    } else {
      this.setState({
        hasMore: dataKeyNext < values.length - 1,
        dataKey: dataKeyNext,
        data: [...this.state.data, ...values[dataKeyNext]],
      });
    }
  }

  render() {
    const { gueesYouLikeLoading } = this.props;

    return (
      <div style={{ height: 800, overflowY: 'scroll' }}>
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={this.handleInfiniteOnLoad}
          hasMore={!this.state.loading && this.state.hasMore}
          useWindow={false}
        >
          <CardGroup
            loading={gueesYouLikeLoading}
            cards={this.state.data}
            cardGridStyle={{ width: '50%' }}
          />
        </InfiniteScroll>
      </div>
    );
  }
}
