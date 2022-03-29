import { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { load } from 'fathom-client';
import reduxActions from '../../features/redux/actions';
import { fetchUniqueWinners } from '../../features/winners/redux/unique';
import { filterLoad } from '../../features/filter/load';
import { selectFilterConfigLoaded } from '../../features/filter/selectors';

function selectPricesLastUpdated(state) {
  return state.prices.lastUpdated;
}

function selectPotsLastUpdated(state) {
  return state.vault.lastUpdated;
}

export const GlobalDataLoader = memo(function GlobalDataLoader() {
  const dispatch = useDispatch();
  const pricesLastUpdated = useSelector(selectPricesLastUpdated);
  const potsLastUpdated = useSelector(selectPotsLastUpdated);
  const filterConfigLoaded = useSelector(selectFilterConfigLoaded);

  useEffect(() => {
    load(process.env.REACT_APP_FATHOM_SITE_ID, {
      url: process.env.REACT_APP_FATHOM_SITE_URL,
      spa: 'hash',
    });
  });

  useEffect(() => {
    dispatch(reduxActions.prices.fetchPrices());
  }, [dispatch]);

  useEffect(() => {
    dispatch(reduxActions.buybacks.fetchBuybacks());
  }, [dispatch]);

  /*useEffect(() => {
    dispatch(reduxActions.holders.fetchHolders());
  }, [dispatch]);*/

  useEffect(() => {
    dispatch(fetchUniqueWinners());
  }, [dispatch]);

  useEffect(() => {
    if (!filterConfigLoaded) {
      console.log('GDL dispatch filterLoad');
      dispatch(filterLoad());
    }
  }, [dispatch, filterConfigLoaded]);

  useEffect(() => {
    // Only initial pots load, after prices have loaded
    if (potsLastUpdated === 0 && pricesLastUpdated > 0) {
      dispatch(reduxActions.vault.fetchPools());
    }
  }, [dispatch, pricesLastUpdated, potsLastUpdated]);

  return null;
});
