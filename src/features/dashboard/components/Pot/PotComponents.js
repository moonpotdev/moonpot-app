import * as React from 'react';
import { Box, Grid, makeStyles, Link, Typography } from '@material-ui/core';
import styles from '../../styles';
import { investmentOdds } from '../../../../helpers/utils';
import { Trans, useTranslation } from 'react-i18next';
import { calculateTotalPrize, formatDecimals } from '../../../../helpers/format';
import Countdown from '../../../../components/Countdown';
import { InterestTooltip } from '../../../../components/Pot/Pot';

const useStyles = makeStyles(styles);

export const PotTitle = function ({ item, prices }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const name = item.name;

  return (
    <Grid item xs={8}>
      {item.status === 'active' ? (
        <React.Fragment>
          <Typography className={classes.title}>
            <Trans i18nKey="pot.title" values={{ name }} />
          </Typography>
          <Typography className={classes.potUsdTop} align={'right'}>
            <span>{t('win')} </span>
            <span style={{ color: '#F3BA2E' }}>
              ${Number(calculateTotalPrize(item, prices).substring(1)).toLocaleString()}
            </span>
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

const Interest = function ({ baseApy, bonusApy, bonusApr }) {
  const classes = useStyles();
  const hasBaseApy = typeof baseApy === 'number' && baseApy > 0;
  const hasBonusApy = typeof bonusApy === 'number' && bonusApy > 0;
  const hasBonusApr = typeof bonusApr === 'number' && bonusApr > 0;
  const totalApy = (hasBaseApy ? baseApy : 0) + (hasBonusApy ? bonusApy : 0);

  return (
    <div style={{ display: 'block', textAlign: 'right', paddingBottom: '16px' }}>
      <div className={classes.interestValueApy}>
        <Trans i18nKey="pot.statInterestApy" values={{ apy: totalApy.toFixed(2) }} />
      </div>
      {hasBaseApy && hasBonusApy ? (
        <div className={classes.interestValueBaseApy}>
          <Trans i18nKey="pot.statInterestApy" values={{ apy: baseApy.toFixed(2) }} />
        </div>
      ) : null}
      {hasBonusApr ? (
        <div className={classes.interestValueApr}>
          <Trans i18nKey="pot.statInterestApr" values={{ apr: bonusApr.toFixed(2) }} />
        </div>
      ) : null}
    </div>
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
            <InterestTooltip baseApy={item.apy} bonusApy={item.bonusApy} bonusApr={item.bonusApr} />
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Interest baseApy={item.apy} bonusApy={item.bonusApy} bonusApr={item.bonusApr} />
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
