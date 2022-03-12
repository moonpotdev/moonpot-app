import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core';
import styles from './styles';
import { FeaturedPots } from './components/FeaturedPots';
import { HowToPlay } from './components/HowToPlay';
import { Hero } from './components/Hero';

const useStyles = makeStyles(styles);

const Home = memo(function Home() {
  const classes = useStyles();

  return (
    <div className={classes.home}>
      <Hero />
      <HowToPlay />
      <FeaturedPots />
    </div>
  );
});

export default Home;
