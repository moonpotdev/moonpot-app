import React, { useMemo } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import styles from './styles';
import SectionSelect from './components/SectionSelect/SectionSelect';
import { useParams } from 'react-router';
import Filter from './components/Filter';
import HomeHeader from './components/HomeHeader/HomeHeader';

const Moonpots = React.lazy(() => import('./Moonpots/Moonpots'));
const MyPots = React.lazy(() => import('./MyPots/MyPots'));

const useStyles = makeStyles(styles);

function useSelectedParams() {
  let { top, bottom } = useParams();

  if (!top) {
    top = 'moonpots';
  }

  if (!bottom) {
    bottom = 'all';
  }

  return useMemo(() => ({ top, bottom }), [top, bottom]);
}

export const Pots = () => {
  const classes = useStyles();
  const { top, bottom } = useSelectedParams();

  return (
    <div className={classes.homeContainer}>
      <HomeHeader />
      <div className={classes.backgroundWrapper}>
        <Grid container className={classes.filters}>
          <Grid item className={classes.filterContainerLeft}>
            <SectionSelect selected={top} />
          </Grid>
          <Grid item className={classes.filterContainerRight}>
            <Filter selected={top} categoryFromUrl={bottom} />
          </Grid>
        </Grid>
        {top === 'moonpots' ? <Moonpots /> : <MyPots />}
      </div>
    </div>
  );
};
