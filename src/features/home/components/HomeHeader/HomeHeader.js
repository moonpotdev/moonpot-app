import React, { useMemo } from 'react';
import { Translate } from '../../../../components/Translate';
import { Grid, makeStyles } from '@material-ui/core';
import styles from './styles';
import coins from '../../../../images/ziggy/coins.png';
import { useSelector } from 'react-redux';
import { usePots } from '../../../../helpers/hooks';
import HeaderCountdown from './components/HeaderCountdown';
import { useTotalPrizeValue } from '../../../winners/apollo/total';

const useStyles = makeStyles(styles);

const HomeHeader = () => {
  const classes = useStyles();

  //Next Featured Draw Countdown Data
  //get all pots
  const pots = usePots();
  //convert to array and sort out filtered pots
  const featuredPots = Object.entries(pots).filter(pot => {
    return pot[1].featured === true;
  });
  //get the pot with the soonest draw
  const nextFeaturedPot = featuredPots.reduce(function (prev, current) {
    return prev[1].expiresAt < current[1].expiresAt ? prev : current;
  });

  //Holders Data
  const cadets = useSelector(state => state.holdersReducer.totalHolders || 0);
  const cadetsFormatted = cadets.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

  //Available Prizes Data
  const totalPrizesAvailable = useSelector(
    state =>
      state.vaultReducer.projectedTotalPrizesAvailable || state.vaultReducer.totalPrizesAvailable
  );
  const totalPrizesAvailableFormatted = useMemo(() => {
    return totalPrizesAvailable.toNumber().toLocaleString(undefined, {
      maximumFractionDigits: 0,
    });
  }, [totalPrizesAvailable]);

  //Total Prizes Data
  const { total } = useTotalPrizeValue();
  const totalFormatted = total.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

  return (
    <div className={classes.container}>
      <HeaderCountdown pot={nextFeaturedPot} />
      <div className={classes.statsCard}>
        <Grid container style={{ height: '100%' }}>
          <Grid item xs={6} className={classes.statsVertCenterOuter}>
            <div className={classes.statsVertCenterInner}>
              <div className={classes.statsCardLabel}>
                <Translate i18nKey="header.totalWon" />
              </div>
              <div className={classes.statsCardValue}>${totalFormatted}</div>
            </div>
          </Grid>
          <Grid item xs={6} className={classes.statsVertCenterOuter}>
            <div className={classes.statsVertCenterInner}>
              <div className={classes.statsCardLabel}>
                <Translate i18nKey="header.uniqueWinners" />
              </div>
              <div className={classes.statsCardValue}>23</div>
            </div>
          </Grid>
          <Grid item xs={6} className={classes.statsVertCenterOuter}>
            <div className={classes.statsVertCenterInner}>
              <div className={classes.statsCardLabel}>
                <Translate i18nKey="header.currentPrizes" />
              </div>
              <div className={classes.statsCardValue}>${totalPrizesAvailableFormatted}</div>
            </div>
          </Grid>
          <Grid item xs={6} className={classes.statsVertCenterOuter}>
            <div className={classes.statsVertCenterInner}>
              <div className={classes.statsCardLabel}>
                <Translate i18nKey="header.cadets" />
              </div>
              <div className={classes.statsCardValue}>{cadetsFormatted}</div>
            </div>
          </Grid>
        </Grid>
        <img alt="" width="170" height="170" sizes="170px" src={coins} />
      </div>
    </div>
  );
};

export default HomeHeader;
