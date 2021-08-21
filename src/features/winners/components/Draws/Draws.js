import React from 'react';
import { Draw } from '../Draw';
import { Card, Cards } from '../../../../components/Cards';
import InfiniteScroll from 'react-infinite-scroll-component';
import { RouteLoading } from '../../../../components/RouteLoading';
import { useDraws } from '../../apollo/draws';

export const Draws = function () {
  const { error, draws, fetchMore, hasMore } = useDraws();

  if (error) {
    return <Card variant="purpleDark">{JSON.stringify(error)}</Card>;
  }

  return (
    <InfiniteScroll
      dataLength={draws ? draws.length : 0}
      next={fetchMore}
      hasMore={hasMore}
      loader={<RouteLoading />}
      style={{ overflow: 'visible' }}
    >
      <Cards>{draws ? draws.map(draw => <Draw key={draw.id} draw={draw} />) : null}</Cards>
    </InfiniteScroll>
  );
};
