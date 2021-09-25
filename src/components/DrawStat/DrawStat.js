import React, { memo, useMemo } from 'react';
import { makeStyles } from '@material-ui/core';
import styles from './styles';
import clsx from 'clsx';
import { Translate } from '../Translate';

const useStyles = makeStyles(styles);

export const DrawStat = memo(function ({ i18nKey, tooltip, labelClass, valueClass, children }) {
  const classes = useStyles();

  return (
    <>
      <div className={clsx(classes.statLabel, labelClass)}>
        <Translate i18nKey={i18nKey} />
        {tooltip ? tooltip : null}
      </div>
      <div className={clsx(classes.statValue, valueClass)}>{children}</div>
    </>
  );
});

export const DrawStatNextDraw = memo(function ({ frequency, ...rest }) {
  const i18nKey = useMemo(() => {
    if (frequency >= 16 * 24 * 60 * 60) {
      return 'pot.statNextDrawMonthly';
    } else if (frequency >= 9 * 24 * 60 * 60) {
      return 'pot.statNextDrawBiWeekly';
    } else if (frequency >= 5 * 24 * 60 * 60) {
      return 'pot.statNextDrawWeekly';
    } else if (frequency >= 20 * 60 * 60) {
      return 'pot.statNextDrawDaily';
    }

    return 'pot.statNextDraw';
  }, [frequency]);

  return <DrawStat i18nKey={i18nKey} {...rest} />;
});
