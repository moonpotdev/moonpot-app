import React from 'react';
import { useStyles } from './styles';
import classNames from 'classnames';
import { Typography } from '@material-ui/core';

function variantClass(classes, prefix, variant) {
  const key = prefix + variant[0].toUpperCase() + variant.substr(1);
  return key in classes ? classes[key] : classes[prefix + 'White'];
}

export function Cards({ variant, className, children, ...rest }) {
  const classes = useStyles();

  return (
    <div className={classNames(classes.cards, className)} {...rest}>
      {children}
    </div>
  );
}

export function Card({ variant = 'white', className, children, ...rest }) {
  const classes = useStyles();

  return (
    <div
      className={classNames(classes.card, variantClass(classes, 'card', variant), className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardTitle({ variant = 'white', className, children, ...rest }) {
  const classes = useStyles();

  return (
    <Typography
      variant="h2"
      className={classNames(classes.title, variantClass(classes, 'title', variant), className)}
      {...rest}
    >
      {children}
    </Typography>
  );
}
