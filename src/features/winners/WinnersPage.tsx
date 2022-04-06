import React, { memo, useEffect } from 'react';
import { Container, makeStyles } from '@material-ui/core';
import { Total } from './components/Total';
import { Draws } from './components/Draws';
import styles from './styles';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../store';
import { selectHaveDrawsLoadedOnce, selectShouldInitDraws } from '../data/selectors/draws';
import { initialDrawsLoader } from '../data/actions/scenarios';
import { RouteLoading } from '../../components/RouteLoading/RouteLoading';

const useStyles = makeStyles(styles);

const WinnersDataLoader = memo(function WinnersDataLoader() {
  const dispatch = useDispatch();
  const shouldInitDraws = useAppSelector(selectShouldInitDraws);
  const potsLoaded = true; // TODO fix when pots are dynamically loaded in to store
  const tokensLoaded = true; // TODO fix when tokens are dynamically loaded in to store

  useEffect(() => {
    if (shouldInitDraws && potsLoaded && tokensLoaded) {
      dispatch(initialDrawsLoader());
    }
  }, [dispatch, shouldInitDraws, potsLoaded, tokensLoaded]);

  return null;
});

export const WinnersPage = function () {
  const classes = useStyles();
  const isLoading = useAppSelector(state => !selectHaveDrawsLoadedOnce(state));

  return (
    <Container maxWidth="xl">
      <WinnersDataLoader />
      <Total className={classes.total} />
      {isLoading ? <RouteLoading /> : <Draws />}
    </Container>
  );
};
