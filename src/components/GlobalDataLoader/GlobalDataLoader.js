import { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { load } from 'fathom-client';
import reduxActions from '../../features/redux/actions';

function selectPricesLastUpdated(state) {
  return state.pricesReducer.lastUpdated;
}

function selectPotsLastUpdated(state) {
  return state.vaultReducer.lastUpdated;
}

export const GlobalDataLoader = memo(function GlobalDataLoader() {
  const dispatch = useDispatch();
  const pricesLastUpdated = useSelector(selectPricesLastUpdated);
  const potsLastUpdated = useSelector(selectPotsLastUpdated);

  useEffect(() => {
    load(process.env.REACT_APP_FATHOM_SITE_ID, {
      url: process.env.REACT_APP_FATHOM_SITE_URL,
      spa: 'hash',
    });
  });

  useEffect(() => {
    dispatch(reduxActions.wallet.createWeb3Modal());
  }, [dispatch]);

  useEffect(() => {
    dispatch(reduxActions.prices.fetchPrices());
  }, [dispatch]);

  useEffect(() => {
    dispatch(reduxActions.buybacks.fetchBuybacks());
  }, [dispatch]);

  useEffect(() => {
    dispatch(reduxActions.holders.fetchHolders());
  }, [dispatch]);

  useEffect(() => {
    // Only initial pots load, after prices have loaded
    if (potsLastUpdated === 0 && pricesLastUpdated > 0) {
      dispatch(reduxActions.vault.fetchPools());
    }
  }, [dispatch, pricesLastUpdated, potsLastUpdated]);

  return null;
});
