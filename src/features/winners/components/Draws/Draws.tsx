import React, { memo } from 'react';
import { DrawsList } from '../DrawsList';
import { DrawsFilter } from '../DrawsFilter';
import { makeStyles } from '@material-ui/core';
import styles from './styles';
import { WinningShrimps } from '../WinningShrimps';

const useStyles = makeStyles(styles);

export const Draws = memo(function Draws() {
  const classes = useStyles();

  return (
    <div className={classes.page}>
      <WinningShrimps className={classes.shrimps} />
      <DrawsFilter className={classes.filters} />
      <DrawsList />
    </div>
  );
});
