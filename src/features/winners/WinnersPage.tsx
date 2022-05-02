import React, { memo, useEffect } from 'react';
import { Draws } from './components/Draws';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../store';
import {
  selectHaveAllNetworkDrawsLoadedOnce,
  selectShouldInitDraws,
} from '../data/selectors/draws';
import { initialDrawsLoader } from '../data/actions/scenarios';
import { RouteLoading } from '../../components/RouteLoading/RouteLoading';
import { selectHaveNetworksLoadedOnce } from '../data/selectors/networks';

const WinnersDataLoader = memo(function WinnersDataLoader() {
  const dispatch = useDispatch();
  const shouldInitDraws = useAppSelector(selectShouldInitDraws);
  const networksLoaded = useAppSelector(selectHaveNetworksLoadedOnce);
  const potsLoaded = true; // TODO fix when pots are dynamically loaded in to store
  const tokensLoaded = true; // TODO fix when tokens are dynamically loaded in to store

  useEffect(() => {
    if (shouldInitDraws && networksLoaded && potsLoaded && tokensLoaded) {
      dispatch(initialDrawsLoader());
    }
  }, [dispatch, shouldInitDraws, networksLoaded, potsLoaded, tokensLoaded]);

  return null;
});

export const WinnersPage = memo(function () {
  const isLoading = useAppSelector(state => !selectHaveAllNetworkDrawsLoadedOnce(state));

  return (
    <>
      <WinnersDataLoader />
      {isLoading ? <RouteLoading /> : <Draws />}
    </>
  );
});
