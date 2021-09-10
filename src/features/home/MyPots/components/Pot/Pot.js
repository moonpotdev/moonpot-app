import React from 'react';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import styles from './styles';
import ActiveLayout from './PotActiveLayout';
import EOLLayout from './PotEOLLayout';
import { Card } from '../../../../../components/Cards';
import { useTranslation } from 'react-i18next';
import { PotInfoBlock, PotTitle } from './PotComponents';
import { Logo } from '../../../../../components/Pot';

const useStyles = makeStyles(styles);

const Pot = function ({ item }) {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Card variant={item.status === 'active' ? 'purpleLight' : 'purpleDarkAlt'}>
      <Grid container spacing={0}>
        {/*Pot Image*/}
        <Grid item xs={4} align={'left'} style={{ marginBottom: '24px' }}>
          <Logo name={item.name} baseToken={item.token} sponsorToken={item.sponsorToken} />
        </Grid>
        {/*Pot Title*/}
        <PotTitle item={item} />
        {/*Divider Text*/}
        <Grid item xs={12} align={'left'} style={{ paddingBottom: 0 }}>
          <Typography className={classes.dividerText}>{t('pot.myDetails')} </Typography>
        </Grid>
        {/*Info Block*/}
        <PotInfoBlock item={item} active={item.status !== 'eol'} />
      </Grid>
      {/*Bottom*/}
      {item.status === 'active' ? <ActiveLayout item={item} /> : <EOLLayout item={item} />}
    </Card>
  );
};

export default Pot;
