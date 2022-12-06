import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core';
import styles from './styles';
import { Hero } from './components/Hero';

const useStyles = makeStyles(styles);

const Home = memo(function Home() {
  const classes = useStyles();

  return (
    <div className={classes.home}>
      <Hero />
    </div>
  );
});

export default Home;
