import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Cards } from '../../../../components/Cards';
import { Draw } from '../Draw';
import { RouteLoading } from '../../../../components/RouteLoading/RouteLoading';
import { useAppSelector } from '../../../../store';
import { DrawEntity } from '../../../data/entities/draws';
import {
  selectFilteredDraws,
  selectFilteredDrawsFilterApplied,
  selectFilteredDrawsMode,
  selectFilteredDrawsOptions,
} from '../../../data/selectors/filtered-draws';
import { shallowEqual } from 'react-redux';
import { selectWalletConnectedAddress } from '../../../wallet/selectors';
import { NoDrawsNoWinners } from '../NoDrawsNoWinners';
import { NoDrawsMatchFilter } from '../NoDrawsMatchFilter';
import { NoDrawsNotConnected } from '../NoDrawsNotConnected';

interface useFilteredDrawsReturnType {
  draws: DrawEntity['id'][];
  nextPage: () => void;
  haveMore: boolean;
}

function useFilteredDraws(): useFilteredDrawsReturnType {
  const perPage = 18;
  const filter = useAppSelector(selectFilteredDrawsOptions);
  const draws = useAppSelector(state => selectFilteredDraws(state, filter), shallowEqual);
  const [count, setCount] = useState(Math.min(draws.length, perPage));
  const drawsToRender = useMemo(() => {
    return draws.slice(0, Math.min(count, draws.length));
  }, [draws, count]);
  const haveMore = drawsToRender.length < draws.length;

  const nextPage = useCallback(() => {
    if (draws.length > drawsToRender.length) {
      setCount(Math.min(draws.length, drawsToRender.length + perPage));
    } else if (drawsToRender.length > draws.length) {
      setCount(Math.min(draws.length, perPage));
    }
  }, [draws, drawsToRender]);

  // Reset to page 1 when full list changes
  useEffect(() => {
    setCount(Math.min(draws.length, perPage));
  }, [draws.length, setCount]);

  return {
    draws: drawsToRender,
    nextPage,
    haveMore,
  };
}

export const DrawsListEmpty = memo(function DrawsListEmpty() {
  const address = useAppSelector(selectWalletConnectedAddress);
  const mode = useAppSelector(selectFilteredDrawsMode);
  const filtered = useAppSelector(selectFilteredDrawsFilterApplied);

  if (mode === 'winning') {
    if (address === null) {
      return <NoDrawsNotConnected />;
    } else if (!filtered) {
      return <NoDrawsNoWinners address={address} />;
    }
  }

  return <NoDrawsMatchFilter />;
});

export const DrawsList = memo(function DrawsList() {
  const { draws, nextPage, haveMore } = useFilteredDraws();

  if (draws.length === 0) {
    return <DrawsListEmpty />;
  }

  return (
    <InfiniteScroll
      dataLength={draws.length}
      next={nextPage}
      hasMore={haveMore}
      loader={<RouteLoading />}
      style={{ overflow: 'visible' }}
    >
      <Cards sameHeight={false} justifyContent="flex-start">
        {draws.length ? draws.map(id => <Draw key={id} id={id} />) : <DrawsListEmpty />}
      </Cards>
    </InfiniteScroll>
  );
});
