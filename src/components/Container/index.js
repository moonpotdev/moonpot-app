import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import styles from './styles';

const useStyles = makeStyles(styles);

export const Container = memo(function Container({ className, children }) {
  const classes = useStyles();

  return <div className={clsx(classes.container, className)}>{children}</div>;
});
