import React, { memo, useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { RouteLoading } from '../../../../components/RouteLoading';
import { Cards } from '../../../../components/Cards';
import { Draw } from '../Draw';
import { useAppSelector } from '../../../../store';
import { selectFilteredDraws } from '../../../data/selectors/draws';
import { DrawEntity } from '../../../data/entities/draws';

interface useFilteredDrawsReturnType {
  draws: DrawEntity['id'][];
  nextPage: () => void;
  haveMore: boolean;
}

function useFilteredDraws(): useFilteredDrawsReturnType {
  const perPage = 18;
  const draws = useAppSelector(selectFilteredDraws);
  const [drawsToRender, setDrawsToRender] = useState<DrawEntity['id'][]>(() =>
    draws.slice(0, perPage)
  );
  const [haveMore, setHaveMore] = useState(() => drawsToRender.length < draws.length);
  const nextPage = useCallback(() => {
    if (draws.length > drawsToRender.length) {
      const endItem = Math.min(drawsToRender.length + perPage, draws.length);
      setDrawsToRender(draws.slice(0, endItem));
      setHaveMore(endItem < draws.length);
    } else {
      setHaveMore(false);
    }
  }, [draws, drawsToRender]);

  useEffect(() => {
    if (draws.length > drawsToRender.length && drawsToRender.length <= perPage) {
      nextPage();
    }
  }, [draws.length, drawsToRender.length, perPage, nextPage]);

  console.log(draws.length, drawsToRender.length);

  return {
    draws: drawsToRender,
    nextPage,
    haveMore,
  };
}

export const Draws = memo(function Draws() {
  const { draws, nextPage, haveMore } = useFilteredDraws();
  console.log(draws.length, haveMore);

  return (
    <InfiniteScroll
      dataLength={draws.length}
      next={nextPage}
      hasMore={haveMore}
      loader={<RouteLoading />}
      style={{ overflow: 'visible' }}
    >
      <Cards sameHeight={false}>{draws ? draws.map(id => <Draw key={id} id={id} />) : null}</Cards>
    </InfiniteScroll>
  );
});
