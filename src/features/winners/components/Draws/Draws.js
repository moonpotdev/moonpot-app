import React from 'react';
import { makeStyles } from '@material-ui/core';
import styles from './styles';
import { useDraws } from '../../apollo/hooks';
import { Draw } from '../Draw';
import { RouteLoading } from '../../../../components/RouteLoading';
import { Card } from '../../../../components/Cards';

const useStyles = makeStyles(styles);

export const Draws = function () {
  const classes = useStyles();
  const { loading, error, draws } = useDraws();

  if (loading) {
    return <RouteLoading />;
  }

  if (error) {
    return <Card variant="purpleDark">{JSON.stringify(error)}</Card>;
  }

  return draws.map(draw => <Draw key={draw.id} draw={draw} />);
};
