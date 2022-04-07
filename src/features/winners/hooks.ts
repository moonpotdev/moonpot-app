import {
  selectNetworksShouldInitPrizeTotals,
  selectTotalPrizeValue,
} from '../data/selectors/draws';
import { useAppDispatch, useAppSelector } from '../../store';
import { shallowEqual } from 'react-redux';
import { useEffect } from 'react';
import { fetchPrizeTotalsForNetwork } from '../data/actions/draws';

export function useTotalPrizeValue() {
  const dispatch = useAppDispatch();
  const networksNeedingInit = useAppSelector(selectNetworksShouldInitPrizeTotals, shallowEqual);
  const total = useAppSelector(selectTotalPrizeValue);

  useEffect(() => {
    if (networksNeedingInit.length) {
      for (const networkId of networksNeedingInit) {
        dispatch(fetchPrizeTotalsForNetwork({ networkId }));
      }
    }
  }, [dispatch, networksNeedingInit]);

  return total;
}
