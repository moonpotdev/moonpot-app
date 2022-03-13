import { memo } from 'react';
import { makeStyles } from '@material-ui/core';
import styles from './styles';

const useStyles = makeStyles(styles);

export const Background = memo(function Background() {
  const classes = useStyles();

  return (
    <div className={classes.background}>
      <div className={classes.stars} />
      <div className={classes.inner}>
        <div className={classes.planetGreen} />
        <div className={classes.planetYellow} />
        <div className={classes.rocket} />
      </div>
      <div className={classes.clouds} />
    </div>
  );
});

export default Background;
