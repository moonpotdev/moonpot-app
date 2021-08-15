import React from 'react';
import { Card } from '../../../../components/Cards/Cards';
import { Grid, makeStyles } from '@material-ui/core';
import styles from './styles';
import { PotLogo, PotTitle } from '../../../home/components/Pot/Pot';

const useStyles = makeStyles(styles);

export const Draw = function ({ result }) {
  const classes = useStyles();
  const { name, token, sponsorToken } = result;

  return (
    <Card variant="purpleLight">
      <Grid container spacing={2} className={classes.rowLogoWinTotal}>
        <Grid item xs={4}>
          <PotLogo name={name} baseToken={token} sponsorToken={sponsorToken} />
        </Grid>
        <Grid item xs={8}>
          <PotTitle name={name} />
        </Grid>
      </Grid>
    </Card>
  );
};
