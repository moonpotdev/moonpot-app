import * as React from 'react';
import { Box, Grid, makeStyles, Link, Typography } from '@material-ui/core';
import styles from '../../styles';
import { investmentOdds } from '../../../../helpers/utils';
import { Trans, useTranslation } from 'react-i18next';
import { calculateTotalPrize, formatDecimals } from '../../../../helpers/format';
import Countdown from '../../../../components/Countdown';
import PrizeSplit from '../../../../components/PrizeSplit';
import BigNumber from 'bignumber.js';

const useStyles = makeStyles(styles);

export const PotImage = function ({ item }) {
  const classes = useStyles();

  return (
    <Grid item xs={4} align={'left'}>
      <Box className={classes.potImage}>
        <img
          alt={`Moonpot ${item.sponsorToken}`}
          src={
            require('../../../../images/vault/' +
              item.token.toLowerCase() +
              '/sponsored/' +
              item.sponsorToken.toLowerCase() +
              '.svg').default
          }
        />
      </Box>
    </Grid>
  );
};

export const PotTitle = function ({ item, prices }) {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Grid item xs={8}>
      {item.status === 'active' ? (
        <React.Fragment>
          <Typography className={classes.potUsdTop} align={'right'}>
            <span>{t('win')}</span> $
            {Number(calculateTotalPrize(item, prices).substring(1)).toLocaleString()}
          </Typography>
          <Typography className={classes.potUsd} align={'right'}>
            <span>{t('in')}</span>
            <PrizeSplit item={item} withBalances={false} /> PRIZES
          </Typography>
          <Typography className={classes.myPotsNextWeeklyDrawText} align={'right'}>
            {t('prize')}:{' '}
            <span>
              <Countdown until={item.expiresAt * 1000} />{' '}
            </span>
          </Typography>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography className={classes.potUsdTop} align={'right'}>
            Retired {item.token}
          </Typography>
          <Typography className={classes.potUsd} align={'right'}>
            Moonpot
          </Typography>
          <Typography className={classes.myPotsNextWeeklyDrawText} align={'right'}>
            {t('prize')}: <span>Closed</span>
          </Typography>
        </React.Fragment>
      )}
    </Grid>
  );
};

export const PotWinners = function ({ item }) {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item xs={6} align={'left'}>
        <Typography className={classes.potsItemText} style={{ marginBottom: 0 }}>
          <Trans i18nKey="winners" />
        </Typography>
      </Grid>
      <Grid item xs={6} align={'right'}>
        <Typography className={classes.potsPrizeWinnersTransaction}>
          <Link href={`https://bscscan.com/tx/${item.winnersTransaction}`}>
            <Trans i18nKey="winningTransactions" />
          </Link>
        </Typography>
      </Grid>
    </Grid>
  );
};

export const PotInfoBlock = function ({ item, prices }) {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Grid item xs={12}>
      <Grid container>
        {/*Balance*/}
        <Grid item xs={6}>
          <Typography className={classes.myDetailsText} align={'left'}>
            <Trans i18nKey="myToken" values={{ token: item.token }} />
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.myDetailsValue} align={'right'}>
            {formatDecimals(item.userBalance)} {item.token} ($
            {formatDecimals(item.userBalance.multipliedBy(prices.prices[item.oracleId]), 2)})
          </Typography>
        </Grid>
        {/*Interest*/}
        <Grid item xs={6}>
          <Typography className={classes.myDetailsText} align={'left'}>
            {t('myInterestRate')}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.myDetailsValue} align={'right'}>
            {item.apy > 0 ? <span>{item.apy.toFixed(2)}%</span> : ''}{' '}
            {item.bonusApy > 0
              ? new BigNumber(item.apy).plus(item.bonusApy).toFixed(2)
              : item.apy.toFixed(2)}
            % APY
          </Typography>
        </Grid>
        {/*Odds*/}
        <Grid item xs={6}>
          <Typography className={classes.myDetailsText} align={'left'}>
            {t('myOdds')}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.myDetailsValue} align={'right'}>
            {t('odds', {
              odds: investmentOdds(
                item.totalStakedUsd,
                item.userBalance.times(prices.prices[item.oracleId]),
                item.numberOfWinners
              ),
            })}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
