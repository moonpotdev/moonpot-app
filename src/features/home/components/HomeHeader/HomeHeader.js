import React from 'react';
import { Translate } from '../../../../components/Translate';
import { Logo } from '../../../../components/Pot/Pot';
import { PrimaryButton } from '../../../../components/Buttons/PrimaryButton';
import { Grid, makeStyles } from '@material-ui/core';
import styles from './styles';
import coins from '../../../../images/ziggy/coins.png';

const useStyles = makeStyles(styles);

const HomeHeader = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.nextDrawCard}>
        {/* Top of card */}
        <div className={classes.nextDrawInner}>
          {/* Prize + Countdown */}
          <div>
            <div className={classes.nextDrawPrizeText}>
              <Translate
                i18nKey="header.winPrizeInToken"
                values={{ prize: '$69,420', token: 'CAKE' }}
              />
            </div>
            <div className={classes.nextDrawTimeContainer}>
              <div>
                <div className={classes.nextDrawTimeValue}>1</div>
                <div className={classes.nextDrawTimeLabel}>
                  <Translate i18nKey="header.hours" />
                </div>
              </div>
              <div className={classes.nextDrawTimeSeparator}>:</div>
              <div>
                <div className={classes.nextDrawTimeValue}>23</div>
                <div className={classes.nextDrawTimeLabel}>
                  <Translate i18nKey="header.mins" />
                </div>
              </div>
              <div className={classes.nextDrawTimeSeparator}>:</div>
              <div>
                <div className={classes.nextDrawTimeValue}>45</div>
                <div className={classes.nextDrawTimeLabel}>
                  <Translate i18nKey="header.secs" />
                </div>
              </div>
            </div>
          </div>
          {/* Pot Logo */}
          <div className={classes.nextDrawLogoContainer}>
            <Logo icon={'cake'} sponsorToken={'pots'} />
          </div>
        </div>
        <PrimaryButton to={`/pot/cake`} variant={'purpleHeader'} fullWidth={true}>
          <Translate i18nKey={'pot.playWith'} values={{ token: 'CAKE' }} />
        </PrimaryButton>
      </div>
      <div className={classes.statsCard}>
        <Grid container style={{ height: '100%' }}>
          <Grid item xs={6} className={classes.statsVertCenterOuter}>
            <div className={classes.statsVertCenterInner}>
              <div className={classes.statsCardLabel}>
                <Translate i18nKey="header.totalWon" />
              </div>
              <div className={classes.statsCardValue}>$4,824,200</div>
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
              <div className={classes.statsCardValue}>$395,575</div>
            </div>
          </Grid>
          <Grid item xs={6} className={classes.statsVertCenterOuter}>
            <div className={classes.statsVertCenterInner}>
              <div className={classes.statsCardLabel}>
                <Translate i18nKey="header.cadets" />
              </div>
              <div className={classes.statsCardValue}>23,456</div>
            </div>
          </Grid>
        </Grid>
        <img alt="" width="170" height="170" sizes="170px" src={coins} />
      </div>
    </div>
  );
};

export default HomeHeader;
