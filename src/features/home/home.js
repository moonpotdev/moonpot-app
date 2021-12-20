import React from 'react';
import { Container, makeStyles, Grid } from '@material-ui/core';
import styles from './styles';
import { TVL } from './components/TVL';
import SectionSelect from './components/SectionSelect/SectionSelect';
import Moonpots from './Moonpots/Moonpots';
import MyPots from './MyPots/MyPots';
import { Title } from './components/Title';
import { useParams } from 'react-router';
import { PoweredByBeefy } from '../../components/PoweredByBeefy';
import Filter from './components/Filter';

const useStyles = makeStyles(styles);

function useSelectedParams() {
  let { top, bottom } = useParams();
  if (!top) {
    top = 'moonpots';
  }

  if (!bottom) {
    bottom = top === 'moonpots' ? 'all' : 'active';
  }

  return { top, bottom };
}

const Home = () => {
  const classes = useStyles();
  const { top, bottom } = useSelectedParams();

  return (
    <Container maxWidth={false} style={{ padding: '0', overflow: 'hidden' }}>
      <Title className={classes.mainTitle} />
      <PoweredByBeefy />
      <div className={classes.tvlSpacer}>
        <TVL className={classes.totalTVL} />
      </div>
      <div className={classes.backgroundWrapper}>
        <div className={classes.mainContainer}>
          <Grid container>
            <Grid item style={{ marginRight: 'auto', marginLeft: 0 }}>
              <SectionSelect selected={top} />
            </Grid>
            <Grid item style={{ marginLeft: 'auto', marginRight: 32 }}>
              <Filter selected={bottom} />
            </Grid>
          </Grid>
          {top === 'moonpots' ? <Moonpots selected={bottom} /> : <MyPots selected={bottom} />}
        </div>
      </div>
    </Container>
  );
};

export default Home;
