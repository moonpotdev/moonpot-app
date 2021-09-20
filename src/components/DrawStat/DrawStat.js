import React, { memo } from 'react';
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

export const DrawNextDraw = memo(function ({
  tooltip,
  labelClass,
  valueClass,
  children,
  frequency,
}) {
  const classes = useStyles();

  return (
    <>
      <div className={clsx(classes.statLabel, labelClass)}>
        <Translate i18nKey={handleDrawText(frequency)} />
        {tooltip ? tooltip : null}
      </div>
      <div className={clsx(classes.statValue, valueClass)}>{children}</div>
    </>
  );
});

const handleDrawText = frequency => {
  if (frequency < 700000) {
    return 'pot.statNextDrawWeekly';
  } else if (frequency < 1400000) {
    return 'pot.statNextDrawBiWeekly';
  } else {
    return 'pot.statNextDrawMonthly';
  }
};
