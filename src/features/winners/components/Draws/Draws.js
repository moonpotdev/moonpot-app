import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDraws } from '../../redux/draws';
import { RouteLoading } from '../../../../components/RouteLoading';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Cards } from '../../../../components/Cards';
import { Draw } from '../Draw';

function useDraws() {
  const dispatch = useDispatch();
  const hasMore = useSelector(state => state.winners.hasMore);
  const draws = useSelector(state => state.winners.draws);
  const pending = useSelector(state => state.winners.pending);
  const firstLoad = useSelector(state => state.winners.firstLoad);
  const drawsCount = draws.length;
  const oldestDraw = draws.length ? draws[draws.length - 1] : null;

  const nextPage = useCallback(() => {
    if (!pending && hasMore && oldestDraw) {
      dispatch(fetchDraws(oldestDraw.timestamp));
    }
  }, [dispatch, hasMore, pending, oldestDraw]);

  useEffect(() => {
    if (firstLoad) {
      dispatch(fetchDraws(0));
    }
  }, [dispatch, firstLoad]);

  return [draws, drawsCount, nextPage, hasMore, firstLoad];
}

export const Draws = function () {
  const [draws, drawsCount, nextPage, hasMore, firstLoad] = useDraws();

  if (firstLoad) {
    return <RouteLoading />;
  }

  return (
    <InfiniteScroll
      dataLength={drawsCount}
      next={nextPage}
      hasMore={hasMore}
      loader={<RouteLoading />}
      style={{ overflow: 'visible' }}
    >
      <Cards sameHeight={false}>
        {draws ? draws.map(draw => <Draw key={draw.id} draw={draw} />) : null}
      </Cards>
    </InfiniteScroll>
  );
};
