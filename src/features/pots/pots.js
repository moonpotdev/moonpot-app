import React, { Suspense, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import styles from './styles';
import { useHistory, useParams } from 'react-router';
import FilterBar from './components/FilterBar';
import { useDispatch } from 'react-redux';
import { filterSetConfig } from '../filter/slice';
import { RouteLoading } from '../../components/RouteLoading';
import { networkIds } from '../../config/networks';

const Moonpots = React.lazy(() => import('./Moonpots/Moonpots'));
const MyPots = React.lazy(() => import('./MyPots/MyPots'));

const useStyles = makeStyles(styles);

function useMaybeRedirect() {
  const { push } = useHistory();
  const dispatch = useDispatch();
  const { tab, category, network, status } = useParams();

  useEffect(() => {
    if (tab === 'moonpots' && (category || network)) {
      const changes = {};
      if (category) {
        changes['category'] = category;
      }

      if (network) {
        changes['networks'] = Object.fromEntries(networkIds.map(key => [key, key === network]));
      }

      // Change filter config
      dispatch(filterSetConfig(changes));
      // Drop filter params from url
      push('/moonpots');
    }
  }, [tab, category, network, push, dispatch]);

  useEffect(() => {
    if (tab === 'my-moonpots' && status) {
      const changes = { status };
      // Change filter config
      dispatch(filterSetConfig(changes));
      // Drop filter params from url
      push('/my-moonpots');
    }
  }, [tab, status, push, dispatch]);

  return tab;
}

export const Pots = () => {
  const classes = useStyles();
  const tab = useMaybeRedirect();

  return (
    <div className={classes.homeContainer}>
      <div className={classes.backgroundWrapper}>
        <FilterBar selected={tab} />
        <Suspense fallback={<RouteLoading />}>
          {tab === 'moonpots' ? <Moonpots /> : <MyPots />}
        </Suspense>
      </div>
    </div>
  );
};
