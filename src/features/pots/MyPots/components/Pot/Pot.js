import React from 'react';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import styles from './styles';
import ActiveLayout from './PotActiveLayout';
import EOLLayout from './PotEOLLayout';
import { Card } from '../../../../../components/Cards';
import { useTranslation } from 'react-i18next';
import { PotInfoBlock, PotTitle } from './PotComponents';
import { Logo, PotNetwork } from '../../../../../components/Pot';
import { useHistory } from 'react-router';
import { usePot } from '../../../../../helpers/hooks';

const useStyles = makeStyles(styles);

const Pot = function ({ id }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();
  const pot = usePot(id);

  return (
    <Card variant={pot.status === 'active' ? 'purpleLight' : 'purpleDarkAlt'}>
      <PotNetwork network={pot.network} />
      <Grid container spacing={0}>
        {/*Pot Image*/}
        <Grid
          item
          xs={4}
          align={'left'}
          style={{ marginBottom: '24px' }}
          onClick={() => history.push(`/pot/${pot.id}`)}
        >
          <Logo icon={pot.icon || pot.id} sponsorToken={pot.sponsorToken} />
        </Grid>
        {/*Pot Title*/}
        <PotTitle item={pot} />
        {/*Divider Text*/}
        <Grid item xs={12} align={'left'} style={{ paddingBottom: 0 }}>
          <Typography className={classes.dividerText}>{t('pot.myDetails')} </Typography>
        </Grid>
        {/*Info Block*/}
        <PotInfoBlock pot={pot} active={pot.status !== 'eol'} />
      </Grid>
      {/*Bottom*/}
      {pot.status === 'active' ? <ActiveLayout item={pot} /> : <EOLLayout item={pot} />}
    </Card>
  );
};

export default Pot;
