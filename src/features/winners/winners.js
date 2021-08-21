import React from 'react';
import { Container, makeStyles } from '@material-ui/core';
import { Total } from './components/Total';
import { Draws } from './components/Draws';
import styles from './styles';

const useStyles = makeStyles(styles);

const WinnersPage = function () {
  const classes = useStyles();

  return (
    <Container maxWidth="xl">
      <Total className={classes.total} />
      <Draws />
    </Container>
  );
};

export default WinnersPage;
