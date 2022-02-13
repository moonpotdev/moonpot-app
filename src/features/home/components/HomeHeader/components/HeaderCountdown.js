import React, { useEffect, useMemo, useState } from 'react';
import { Translate } from '../../../../../components/Translate';
import { Logo } from '../../../../../components/Pot/Pot';
import { PrimaryButton } from '../../../../../components/Buttons/PrimaryButton';
import { makeStyles } from '@material-ui/core';
import { formatTimeLeft } from '../../../../../helpers/format';
import { useTotalPrize } from '../../../../../helpers/hooks';
import styles from '../styles';

const useStyles = makeStyles(styles);

const HeaderCountdown = ({ pot }) => {
  const classes = useStyles();

  // Set time for countdown calculation
  const [time, setTime] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setTime(Date.now()), 1000);
    return () => clearInterval(id);
  }, [setTime]);

  // Calculate time until draw
  const expiresAt = pot.expiresAt * 1000;
  const timeLeft = Math.max(0, expiresAt - time);
  const timeToDraw = useMemo(
    () =>
      formatTimeLeft(timeLeft, {
        resolution: 'seconds',
        returnNumbers: true,
      }),
    [timeLeft]
  );

  // Whether to show days or seconds
  const daysToDraw = timeToDraw.days;
  const showDays = useMemo(() => daysToDraw > 0, [daysToDraw]);

  // Format prize
  const prize = useTotalPrize(
    pot.projectedAwardBalanceUsd || pot.awardBalanceUsd,
    pot.projectedTotalSponsorBalanceUsd || pot.totalSponsorBalanceUsd
  );

  return (
    <div className={classes.nextDrawCard}>
      {/* Top of card */}
      <div className={classes.nextDrawInner}>
        {/* Prize + Countdown */}
        <div>
          <div className={classes.nextDrawPrizeText}>
            {/* All featured non daily pots are token only prize (for now)*/}
            <Translate
              i18nKey="header.winPrizeInToken"
              values={{ prize: '$' + prize, token: pot.token }}
            />
          </div>
          <div className={classes.nextDrawTimeContainer}>
            {showDays ? (
              <>
                <div>
                  <div className={classes.nextDrawTimeValue}>
                    {timeToDraw.days.toString().padStart(2, '0')}
                  </div>
                  <div className={classes.nextDrawTimeLabel}>
                    <Translate i18nKey="header.days" />
                  </div>
                </div>
                <div className={classes.nextDrawTimeSeparator}>:</div>
              </>
            ) : null}
            <div>
              <div className={classes.nextDrawTimeValue}>
                {timeToDraw.hours.toString().padStart(2, '0')}
              </div>
              <div className={classes.nextDrawTimeLabel}>
                <Translate i18nKey="header.hours" />
              </div>
            </div>
            <div className={classes.nextDrawTimeSeparator}>:</div>
            <div>
              <div className={classes.nextDrawTimeValue}>
                {timeToDraw.minutes.toString().padStart(2, '0')}
              </div>
              <div className={classes.nextDrawTimeLabel}>
                <Translate i18nKey="header.mins" />
              </div>
            </div>
            {!showDays ? (
              <>
                <div className={classes.nextDrawTimeSeparator}>:</div>
                <div>
                  <div className={classes.nextDrawTimeValue}>
                    {timeToDraw.seconds.toString().padStart(2, '0')}
                  </div>
                  <div className={classes.nextDrawTimeLabel}>
                    <Translate i18nKey="header.secs" />
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
        {/* Pot Logo */}
        <div className={classes.nextDrawLogoContainer}>
          <Logo icon={pot.icon || pot.id} sponsorToken={pot.sponsorToken} />
        </div>
      </div>
      <PrimaryButton to={`/pot/` + pot.id} variant={'purpleHeader'} fullWidth={true}>
        <Translate i18nKey={'pot.playWith'} values={{ token: pot.token }} />
      </PrimaryButton>
    </div>
  );
};

export default HeaderCountdown;
