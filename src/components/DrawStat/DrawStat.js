import React, { memo } from 'react';
import { Trans } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import styles from './styles';
import clsx from 'clsx';

const useStyles = makeStyles(styles);

export const DrawStat = memo(function ({ i18nKey, tooltip, labelClass, valueClass, children }) {
  const classes = useStyles();

  return (
    <>
      <div className={clsx(classes.statLabel, labelClass)}>
        <Trans i18nKey={i18nKey} />
        {tooltip ? tooltip : null}
      </div>
      <div className={clsx(classes.statValue, valueClass)}>{children}</div>
    </>
  );
});
