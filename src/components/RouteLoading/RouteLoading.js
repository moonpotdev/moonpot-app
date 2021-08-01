import React from 'react';
import styles from './styles';
import { CircularProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(styles);

export function RouteLoading() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <CircularProgress />
    </div>
  );
}
