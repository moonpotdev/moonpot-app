import React from 'react';
import { Container, makeStyles, Grid } from '@material-ui/core';
import styles from './styles';
import { TVL } from './components/TVL';
import SectionSelect from './components/SectionSelect/SectionSelect';
import Moonpots from './Moonpots/Moonpots';
import MyPots from './MyPots/MyPots';
import { Title } from './components/Title';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { PoweredByBeefy } from '../../components/PoweredByBeefy';
import Filter from './components/Filter';

const useStyles = makeStyles(styles);

function useSelectedParams() {
  let { top, bottom } = useParams();
  let filter = useSelector(state => state.filterReducer.sort);
  if (!top) {
    top = 'moonpots';
  }

  if (!bottom) {
    bottom = 'all';
  }

  if (!filter) {
    filter = top === 'moonpots' ? 'all' : 'active';
  }
  return { top, bottom, filter };
}

const Home = () => {
  const classes = useStyles();
  const { top, bottom, filter } = useSelectedParams();

  return (
    <Container maxWidth={false} style={{ padding: '0', overflow: 'hidden' }}>
      <Title className={classes.mainTitle} />
      <PoweredByBeefy />
      <div className={classes.tvlSpacer}>
        <TVL className={classes.totalTVL} />
      </div>
      <div className={classes.backgroundWrapper}>
        <Grid container className={classes.filters}>
          <Grid item className={classes.filterContainerLeft}>
            <SectionSelect selected={top} />
          </Grid>
          <div className={classes.placeholder} />
          <Grid item className={classes.filterContainerRight}>
            <Filter selected={bottom} sort={filter} />
          </Grid>
        </Grid>
        {top === 'moonpots' ? (
          <Moonpots selected={bottom} sort={filter} />
        ) : (
          <MyPots selected={filter} bottom={bottom} />
        )}
      </div>
    </Container>
  );
};

export default Home;
