import React, { memo } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import styles from './styles';
import clsx from 'clsx';
import { variantClass } from '../../helpers/utils';
import { InfoOutlined } from '@material-ui/icons';

const useStyles = makeStyles(styles);

export const Alert = memo(function ({ Icon = InfoOutlined, variant, children, className }) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.alert, variantClass(classes, 'variant', variant), className)}>
      <div className={classes.icon}>
        <Icon fontSize="inherit" />
      </div>
      <div className={classes.content}>{children}</div>
    </div>
  );
});

export const AlertTitle = memo(function AlertTitle({ className, children }) {
  const classes = useStyles();
  return (
    <Typography variant="h2" className={clsx(classes.title, className)}>
      {children}
    </Typography>
  );
});

export const AlertText = memo(function AlertText({ className, children }) {
  const classes = useStyles();
  return <div className={clsx(classes.text, className)}>{children}</div>;
});
