import React, { useEffect } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import styles from './styles';
import SectionSelect from './components/SectionSelect/SectionSelect';
import { useHistory, useParams } from 'react-router';
import Filter from './components/Filter';
import HomeHeader from './components/HomeHeader/HomeHeader';
import { useDispatch } from 'react-redux';
import { filterSetConfig } from '../filter/slice';

const Moonpots = React.lazy(() => import('./Moonpots/Moonpots'));
const MyPots = React.lazy(() => import('./MyPots/MyPots'));

const useStyles = makeStyles(styles);

function useMaybeRedirect() {
  const { push } = useHistory();
  const dispatch = useDispatch();
  const { tab, category, network } = useParams();

  useEffect(() => {
    if (tab === 'moonpots' && (category || network)) {
      const changes = {};
      if (category) {
        changes['category'] = category;
      }
      if (network) {
        changes['network'] = network;
      }

      // Change filter config
      dispatch(filterSetConfig(changes));
      // Drop filter params from url
      push('/moonpots');
    }
  }, [tab, category, network, push, dispatch]);

  return tab;
}

export const Pots = () => {
  const classes = useStyles();
  const tab = useMaybeRedirect();

  return (
    <div className={classes.homeContainer}>
      <HomeHeader />
      <div className={classes.backgroundWrapper}>
        <Grid container className={classes.filters}>
          <Grid item className={classes.filterContainerLeft}>
            <SectionSelect selected={tab} />
          </Grid>
          <Grid item className={classes.filterContainerRight}>
            <Filter selected={tab} />
          </Grid>
        </Grid>
        {tab === 'moonpots' ? <Moonpots /> : <MyPots />}
      </div>
    </div>
  );
};
