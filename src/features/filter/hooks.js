import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterApply } from './apply';
import { selectFilterConfig, selectFilterIds } from './selectors';
import { usePots } from '../../helpers/hooks';

export function useFilteredPots() {
  const dispatch = useDispatch();
  const pots = usePots();
  const balances = useSelector(state => state.balance.tokensByNetwork);
  const ids = useSelector(selectFilterIds);

  // re-apply filters when pots/balances update
  useEffect(() => {
    dispatch(filterApply());
  }, [dispatch, pots, balances]);

  return ids;
}

export function useFilterConfig() {
  return useSelector(selectFilterConfig);
}
