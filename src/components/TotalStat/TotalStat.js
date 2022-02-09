import React, { memo } from 'react';
import clsx from 'clsx';
import { Card, Cards } from '../Cards';
import { makeStyles } from '@material-ui/core';
import styles from './styles';

const useStyles = makeStyles(styles);

export const TotalStat = memo(function ({ label, value, className }) {
  const classes = useStyles();

  return (
    <Cards>
      <Card variant="purpleDark" className={clsx(classes.card, className)} oneColumn={true}>
        <div className={classes.label}>{label}</div>
        <div className={classes.value}>{value}</div>
      </Card>
    </Cards>
  );
});
