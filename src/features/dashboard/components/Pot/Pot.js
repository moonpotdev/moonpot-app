import * as React from 'react';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import styles from '../../styles';
import ActiveLayout from './PotActiveLayout';
import EOLLayout from './PotEOLLayout';
import { Card, Cards } from '../../../../components/Cards/Cards';
import { useTranslation } from 'react-i18next';
import { PotImage, PotTitle, PotInfoBlock } from './PotComponents';

const useStyles = makeStyles(styles);

const Pot = function ({ item, wallet, prices, balance }) {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.activeMyPot}>
      {/*TODO SIMPLIFY CLASS ^^^*/}
      <Cards>
        <Card variant={item.status === 'active' ? 'purpleLight' : 'purpleDark'}>
          <Grid container spacing={0}>
            {/*Pot Image*/}
            <PotImage item={item} />
            {/*Pot Title*/}
            <PotTitle item={item} prices={prices} />
            {/*Divider Text*/}
            <Grid item xs={12} align={'left'} style={{ paddingBottom: 0 }}>
              <Typography className={classes.dividerText}>{t('myDetails')} </Typography>
            </Grid>
            {/*Info Block*/}
            <PotInfoBlock item={item} prices={prices} />
          </Grid>
          {/*Bottom*/}
          {item.status === 'active' ? (
            <ActiveLayout item={item} wallet={wallet} balance={balance} prices={prices} />
          ) : (
            <EOLLayout item={item} wallet={wallet} balance={balance} prices={prices} />
          )}
        </Card>
      </Cards>
    </div>
  );
};

export default Pot;
