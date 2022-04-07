import React, { memo, PropsWithChildren } from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import styles from './styles';

const useStyles = makeStyles(styles);

export type ContainerProps = PropsWithChildren<{
  className?: string;
}>;

export const Container = memo<ContainerProps>(function Container({ className, children }) {
  const classes = useStyles();

  return <div className={clsx(classes.container, className)}>{children}</div>;
});
