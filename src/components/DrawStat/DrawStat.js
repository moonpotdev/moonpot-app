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

export const DrawStatNextDraw = memo(function ({ duration, ...rest }) {
  const i18nKey = useMemo(() => {
    if (duration >= 28) {
      return 'pot.statNextDrawMonthly';
    } else if (duration >= 14) {
      return 'pot.statNextDrawBiWeekly';
    } else if (duration >= 7) {
      return 'pot.statNextDrawWeekly';
    } else if (duration >= 1) {
      return 'pot.statNextDrawDaily';
    }

    return 'pot.statNextDraw';
  }, [duration]);

  return <DrawStat i18nKey={i18nKey} {...rest} />;
});
