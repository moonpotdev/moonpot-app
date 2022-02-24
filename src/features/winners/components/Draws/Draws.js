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
  const sortFilter = useSelector(state => state.filterReducer.winnerSort);
  const potsFilter = useSelector(state => state.filterReducer.winnerPots);
  const drawsCount = draws.length;
  const oldestDraw = draws.length ? draws[draws.length - 1] : null;

  const potIsInFilter = potId => {
    for (var i = 0; i < potsFilter.length; i++) {
      if (potsFilter[i].key === potId) return true;
    }
    return false;
  };

  const filterDraws = draws => {
    if (potsFilter.length === 0) {
      //If single pots filter is not set use type filter
      if (sortFilter === 'all') {
        return draws;
      } else if (sortFilter === 'featured') {
        const filteredDraws = draws.filter(draw => draw.pot.featured === true);
        return filteredDraws;
      } else {
        const filteredDraws = draws.filter(draw => draw.pot.vaultType === sortFilter);
        return filteredDraws;
      }
    } else {
      //Filter by pot name/id
      const filteredDraws = draws.filter(draw => potIsInFilter(draw.pot.id));
      return filteredDraws;
    }
  };

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

  const filteredDraws = filterDraws(draws);

  return [filteredDraws, drawsCount, nextPage, hasMore, firstLoad];
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
