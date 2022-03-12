import React, { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatTimeLeft } from '../../helpers/format';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import styles from './styles';

const useStyles = makeStyles(styles);

const CountdownPart = memo(function CountdownPart({ value, label }) {
  const classes = useStyles();

  return (
    <div className={classes.countdownPart}>
      <div className={classes.countdownBox}>{value.toString().padStart(2, '0')}</div>
      <div className={classes.countdownLabel}>{label}</div>
    </div>
  );
});

export const StaticSegmentedCountdown = memo(function StaticSegmentedCountdown({
  days,
  hours,
  minutes,
  seconds,
  className,
}) {
  const classes = useStyles();
  const { t } = useTranslation();
  const showDays = days > 0;

  return (
    <div className={clsx(classes.countdown, className)}>
      {showDays ? (
        <>
          <CountdownPart value={days || 0} label={t('home.featuredPots.countdown.days')} />
          <div className={classes.countdownSep}>:</div>
        </>
      ) : null}
      <CountdownPart value={hours || 0} label={t('home.featuredPots.countdown.hours')} />
      <div className={classes.countdownSep}>:</div>
      <CountdownPart value={minutes || 0} label={t('home.featuredPots.countdown.mins')} />
      {!showDays ? (
        <>
          <div className={classes.countdownSep}>:</div>
          <CountdownPart value={seconds || 0} label={t('home.featuredPots.countdown.secs')} />
        </>
      ) : null}
    </div>
  );
});

export const SegmentedCountdown = memo(function SegmentedCountdown({ when, className }) {
  const [time, setTime] = useState(() => Date.now());
  const timeLeft = Math.max(0, when - time);
  const timeLeftComponents = useMemo(
    () =>
      formatTimeLeft(timeLeft, {
        resolution: 'seconds',
        returnNumbers: true,
      }),
    [timeLeft]
  );

  useEffect(() => {
    const id = setInterval(() => setTime(Date.now()), 1000);
    return () => clearInterval(id);
  }, [setTime]);

  return <StaticSegmentedCountdown {...timeLeftComponents} className={className} />;
});
