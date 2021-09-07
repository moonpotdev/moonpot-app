import * as React from 'react';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import styles from './styles';
import ActiveLayout from './PotActiveLayout';
import EOLLayout from './PotEOLLayout';
import { Card } from '../../../../../components/Cards/Cards';
import { useTranslation } from 'react-i18next';
import { PotTitle, PotInfoBlock } from './PotComponents';
import { Logo } from '../../../../../components/Pot/Pot';

const useStyles = makeStyles(styles);

const Pot = function ({ item, wallet, prices, balance }) {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Card variant={item.status === 'active' ? 'purpleLight' : 'purpleDarkAlt'}>
      <Grid container spacing={0}>
        {/*Pot Image*/}
        <Grid item xs={4} align={'left'} style={{ marginBottom: '24px' }}>
          <Logo baseToken={item.token} sponsorToken={item.sponsorToken} />
        </Grid>
        {/*Pot Title*/}
        <PotTitle item={item} />
        {/*Divider Text*/}
        <Grid item xs={12} align={'left'} style={{ paddingBottom: 0 }}>
          <Typography className={classes.dividerText}>{t('pot.myDetails')} </Typography>
        </Grid>
        {/*Info Block*/}
        <PotInfoBlock item={item} prices={prices} active={item.status !== 'eol'} />
      </Grid>
      {/*Bottom*/}
      {item.status === 'active' ? (
        <ActiveLayout item={item} wallet={wallet} balance={balance} prices={prices} />
      ) : (
        <EOLLayout item={item} wallet={wallet} balance={balance} prices={prices} />
      )}
    </Card>
  );
};

export default Pot;
