import * as React from 'react';
import { memo, useMemo } from 'react';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import styles from './styles';
import { investmentOdds } from '../../../../../helpers/utils';
import { useTranslation } from 'react-i18next';
import { byDecimals, formatDecimals } from '../../../../../helpers/format';
import Countdown from '../../../../../components/Countdown';
import { InterestTooltip, WinTotal } from '../../../../../components/Pot';
import { Translate } from '../../../../../components/Translate';
import { useTokenBalance } from '../../../../../helpers/hooks';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(styles);

export const PotTitle = function ({ item }) {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Grid item xs={8}>
      {item.status === 'active' ? (
        <React.Fragment>
          <Typography className={classes.title}>
            <Translate i18nKey="pot.title" values={{ name: item.name }} />
          </Typography>
          <div className={classes.potUsdTop}>
            <WinTotal
              awardBalanceUsd={item.awardBalanceUsd}
              totalSponsorBalanceUsd={item.totalSponsorBalanceUsd}
            />
          </div>
          <Typography className={classes.myPotsNextWeeklyDrawText} align={'right'}>
            {t('pot.prizeDraw')}
            {': '}
            <span>
              <Countdown until={item.expiresAt * 1000} />{' '}
            </span>
          </Typography>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography className={classes.potUsdTop} align={'right'}>
            <Translate i18nKey="pot.titleRetired" values={{ name: item.name }} />
          </Typography>
          <Typography className={classes.myPotsNextWeeklyDrawText} align={'right'}>
            {t('pot.prizeDraw')}: <span>{t('pot.closed')}</span>
          </Typography>
        </React.Fragment>
      )}
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
    <div className={classes.interestContainer}>
      <div className={classes.interestValueApy}>
        <Translate i18nKey="pot.statInterestApy" values={{ apy: totalApy.toFixed(2) }} />
      </div>
      {hasBaseApy && hasBonusApy ? (
        <div className={classes.interestValueBaseApy}>
          <Translate i18nKey="pot.statInterestApy" values={{ apy: baseApy.toFixed(2) }} />
        </div>
      ) : null}
      {hasBonusApr ? (
        <div className={classes.interestValueApr}>
          <Translate i18nKey="pot.statInterestApr" values={{ apr: bonusApr.toFixed(2) }} />
        </div>
      ) : null}
    </div>
  );
};

const DepositedOdds = memo(function ({ ticketTotalSupply, winners, ticketToken, tokenDecimals }) {
  const depositedTickets = useTokenBalance(ticketToken, tokenDecimals);

  const odds = useMemo(() => {
    return investmentOdds(byDecimals(ticketTotalSupply, tokenDecimals), winners, depositedTickets);
  }, [ticketTotalSupply, depositedTickets, winners, tokenDecimals]);

  return <Translate i18nKey="pot.odds" values={{ odds }} />;
});

export const PotInfoBlock = function ({ item, active = true }) {
  const classes = useStyles();
  const prices = useSelector(state => state.pricesReducer);
  const { t } = useTranslation();

  return (
    <Grid item xs={12}>
      <Grid container>
        {/*Balance*/}
        <Grid item xs={6}>
          <Typography className={classes.myDetailsText} align={'left'}>
            <Translate i18nKey="pot.myToken" values={{ token: item.token }} />
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.myDetailsValue} align={'right'}>
            {formatDecimals(item.userBalance)} {item.token} ($
            {formatDecimals(item.userBalance.multipliedBy(prices.prices[item.oracleId]), 2)})
          </Typography>
        </Grid>
        {/*Interest*/}
        {active ? (
          <>
            <Grid item xs={6}>
              <Typography className={classes.myDetailsText} align={'left'}>
                {t('pot.myInterestRate')}
                <InterestTooltip
                  baseApy={item.apy}
                  bonusApy={item.bonusApy}
                  bonusApr={item.bonusApr}
                />
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Interest baseApy={item.apy} bonusApy={item.bonusApy} bonusApr={item.bonusApr} />
            </Grid>
          </>
        ) : null}
        {/*Odds*/}
        {active ? (
          <>
            <Grid item xs={6}>
              <Typography className={classes.myDetailsText} align={'left'}>
                {t('pot.myOdds')}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.myDetailsValue} align={'right'}>
                <DepositedOdds
                  ticketTotalSupply={item.totalTickets}
                  winners={item.numberOfWinners}
                  ticketToken={item.rewardToken}
                  tokenDecimals={item.tokenDecimals}
                />
              </Typography>
            </Grid>
          </>
        ) : null}
      </Grid>
    </Grid>
  );
};
