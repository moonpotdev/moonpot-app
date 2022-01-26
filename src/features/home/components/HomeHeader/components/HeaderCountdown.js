import React, { useState, useEffect } from 'react';
import { Translate } from '../../../../../components/Translate';
import { Logo } from '../../../../../components/Pot/Pot';
import { PrimaryButton } from '../../../../../components/Buttons/PrimaryButton';
import { makeStyles } from '@material-ui/core';
import { formatTimeLeft } from '../../../../../helpers/format';
import { Grid } from '@material-ui/core';
import styles from '../styles';

const useStyles = makeStyles(styles);

const HeaderCountdown = ({ pot }) => {
  const classes = useStyles();
  const potData = pot[1];

  //Set time for countdown calculation
  const [time, setTime] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setTime(Date.now()), 1000);
    return () => clearInterval(id);
  }, [setTime]);

  //Calculate time untill draw
  const expiresAt = potData.expiresAt * 1000;
  const timeLeft = Math.max(0, expiresAt - time);
  const timeToDraw = formatTimeLeft(
    timeLeft,
    {
      resolution: 'seconds',
      dropZero: false,
    },
    true
  );

  //Format prize
  const prize = potData.totalPrizeUsd.toFixed(0);
  const prizeFormatted = prize.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

  console.log(prizeFormatted);

  return (
    <Grid item lg={4} md={6} sm={6} xs={12} className={classes.nextDrawCard}>
      {/* Top of card */}
      <div className={classes.nextDrawInner}>
        {/* Prize + Countdown */}
        <div>
          <div className={classes.nextDrawPrizeText}>
            {/* All featured non daily pots are token only prize (for now)*/}
            <Translate
              i18nKey="header.winPrizeInToken"
              values={{ prize: '$' + prizeFormatted, token: potData.token }}
            />
          </div>
          <div className={classes.nextDrawTimeContainer}>
            <div>
              <div className={classes.nextDrawTimeValue}>
                {timeToDraw[1] === 'NaN' ? '00' : timeToDraw[1]}
              </div>
              <div className={classes.nextDrawTimeLabel}>
                <Translate i18nKey="header.hours" />
              </div>
            </div>
            <div className={classes.nextDrawTimeSeparator}>:</div>
            <div>
              <div className={classes.nextDrawTimeValue}>
                {timeToDraw[2] === 'NaN' ? '00' : timeToDraw[2]}
              </div>
              <div className={classes.nextDrawTimeLabel}>
                <Translate i18nKey="header.mins" />
              </div>
            </div>
            <div className={classes.nextDrawTimeSeparator}>:</div>
            <div>
              <div className={classes.nextDrawTimeValue}>
                {timeToDraw[3] === 'NaN' ? '00' : timeToDraw[3]}
              </div>
              <div className={classes.nextDrawTimeLabel}>
                <Translate i18nKey="header.secs" />
              </div>
            </div>
          </div>
        </div>
        {/* Pot Logo */}
        <div className={classes.nextDrawLogoContainer}>
          <Logo icon={potData.icon || potData.id} sponsorToken={potData.sponsorToken} />
        </div>
      </div>
      <PrimaryButton to={`/pot/` + potData.id} variant={'purpleHeader'} fullWidth={true}>
        <Translate i18nKey={'pot.playWith'} values={{ token: potData.token }} />
      </PrimaryButton>
    </Grid>
  );
};

export default HeaderCountdown;
