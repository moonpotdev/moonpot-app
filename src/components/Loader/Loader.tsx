import { Box, makeStyles } from '@material-ui/core';
import React, { memo, PropsWithChildren } from 'react';
import styles from './styles';

const useStyles = makeStyles(styles);

export type LoaderProps = PropsWithChildren<{
  message?: string;
  line?: boolean;
}>;
export const Loader = memo<LoaderProps>(function ({ message, line }) {
  const classes = useStyles();
  return (
    <Box textAlign={'center'}>
      {message}
      <Box className={line ? classes.line : classes.circle} />
    </Box>
  );
});
