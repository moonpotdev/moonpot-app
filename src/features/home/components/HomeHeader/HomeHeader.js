import React, { memo, useMemo } from 'react';
import { Translate } from '../../../../components/Translate';
import { Grid, makeStyles } from '@material-ui/core';
import styles from './styles';
import coins from '../../../../images/ziggy/coins.png';
import { useSelector } from 'react-redux';
import { usePots } from '../../../../helpers/hooks';
import HeaderCountdown from './components/HeaderCountdown';
import { useTotalPrizeValue } from '../../../winners/apollo/total';
import { RouteLoading } from '../../../../components/RouteLoading';
import { ZERO } from '../../../../helpers/utils';

const useStyles = makeStyles(styles);

const NextFeaturedPotCountdown = memo(function NextFeaturedPotCountdown() {
  const pots = usePots();
  const nextFeaturedPot = useMemo(() => {
    const now = Date.now() / 1000;
    const eligible = Object.values(pots)
      .filter(pot => pot.featured && pot.vaultType !== 'nft' && pot.expiresAt > now)
      .sort((a, b) => a.expiresAt - b.expiresAt);

    return eligible.length ? eligible[0] : null;
  }, [pots]);

  if (nextFeaturedPot) {
    return <HeaderCountdown pot={nextFeaturedPot} />;
  }

  return <RouteLoading />;
});

const StatsCard = memo(function StatsCards() {
  const classes = useStyles();

  // Holders Data
  const cadets = useSelector(state => state.holders.cadets || 0);
  const cadetsFormatted = cadets.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

  // Available Prizes Data
  const totalPrizesAvailable = useSelector(state =>
    (
      state.vaultReducer.projectedTotalPrizesAvailable ||
      state.vaultReducer.totalPrizesAvailable ||
      ZERO
    ).toNumber()
  );
  const totalPrizesAvailableFormatted = useMemo(() => {
    return totalPrizesAvailable.toLocaleString(undefined, {
      maximumFractionDigits: 0,
    });
  }, [totalPrizesAvailable]);

  // Total Prizes Data
  const { total } = useTotalPrizeValue();
  const totalFormatted = total.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

  // Unique winners value
  const uniqueWinners = useSelector(state => state.uniqueWinnersReducer.uniqueWinners || 0);

  return (
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
            <div className={classes.statsCardValue}>{uniqueWinners}</div>
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
      <img
        alt=""
        width="170"
        height="170"
        sizes="170px"
        src={coins}
        className={classes.ziggyImage}
      />
    </div>
  );
});

const HomeHeader = memo(function HomeHeader() {
  const classes = useStyles();

  return (
    <Grid container className={classes.container}>
      <Grid item lg={4} md={6} sm={6} xs={12} className={classes.nextDrawCardWrapper}>
        <NextFeaturedPotCountdown />
      </Grid>
      <Grid item lg={7} md={5} sm={6} xs={12} className={classes.statsCardBuffer}>
        <StatsCard />
      </Grid>
    </Grid>
  );
});

export default HomeHeader;
