import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core';
import styles from './styles';
import { Card } from '../../../../components/Cards/Cards';
import clsx from 'clsx';
import { Trans } from 'react-i18next';
import { useSelector } from 'react-redux';
const useStyles = makeStyles(styles);

export const TVL = memo(function ({ className }) {
  const classes = useStyles();
  const tvl = useSelector(state => state.vaultReducer.totalTvl || 0).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

  return (
    <Card variant="purpleDark" className={clsx(classes.card, className)}>
      <div className={classes.label}>
        <Trans i18nKey="homeTotalDeposits" />
      </div>
      <div className={classes.value}>${tvl}</div>
    </Card>
  );
});
