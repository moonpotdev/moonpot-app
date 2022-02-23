import * as React from 'react';
import { memo, useMemo } from 'react';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import styles from './styles';
import { investmentOdds } from '../../../../../helpers/utils';
import { useTranslation } from 'react-i18next';
import { byDecimals, formatDecimals } from '../../../../../helpers/format';
import Countdown from '../../../../../components/Countdown';
import { WinFeature } from '../../../../../components/Pot';
import { InterestTooltip } from '../../../../../components/Tooltip/tooltip';
import { Translate } from '../../../../../components/Translate';
import { useTokenBalance } from '../../../../../helpers/hooks';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

const useStyles = makeStyles(styles);

export const PotTitle = function ({ item }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const pot = item;
  const history = useHistory();

  return (
    <Grid item xs={8}>
      {item.status === 'active' ? (
        <React.Fragment>
          <Typography className={classes.title} onClick={() => history.push(`/pot/${pot.id}`)}>
            <Translate i18nKey="pot.title" values={{ name: item.name }} />
          </Typography>
          <div className={classes.potUsdTop}>
            <WinFeature
              awardBalanceUsd={pot.projectedAwardBalanceUsd || pot.awardBalanceUsd}
              totalSponsorBalanceUsd={
                pot.projectedTotalSponsorBalanceUsd || pot.totalSponsorBalanceUsd
              }
              sponsors={pot.sponsors}
              nfts={pot.nfts}
              depositToken={pot.token}
              nftPrizeOnly={pot.nftPrizeOnly}
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

const Interest = function ({ baseApy, bonusApy, prizeOnly }) {
  const classes = useStyles();
  const hasBaseApy = typeof baseApy === 'number' && baseApy > 0;
  const hasBonusApy = typeof bonusApy === 'number' && bonusApy > 0;
  const totalApy = (hasBaseApy ? baseApy : 0) + (hasBonusApy ? bonusApy : 0);

  return (
    <div className={classes.interestContainer}>
      <div className={classes.interestValueApy}>
        {prizeOnly ? (
          <Translate i18nKey="pot.prizeOnly" />
        ) : (
          <Translate i18nKey="pot.statInterestApy" values={{ apy: totalApy.toFixed(2) }} />
        )}
      </div>
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

export const PotInfoBlock = function ({ pot, active = true }) {
  const classes = useStyles();
  const depositTokenPrice = useSelector(
    state => state.prices.byNetworkAddress[pot.network][pot.tokenAddress]
  );
  const { t } = useTranslation();

  return (
    <Grid item xs={12}>
      <Grid container>
        {/*Balance*/}
        <Grid item xs={6}>
          <Typography className={classes.myDetailsText} align={'left'}>
            <Translate i18nKey="pot.myToken" values={{ token: pot.token }} />
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.myDetailsValue} align={'right'}>
            {formatDecimals(pot.userBalance)} {pot.token} ($
            {formatDecimals(pot.userBalance.multipliedBy(depositTokenPrice), 2)})
          </Typography>
        </Grid>
        {/*Interest*/}
        {active ? (
          <>
            <Grid item xs={6}>
              <Typography className={classes.myDetailsText} align={'left'}>
                {t('pot.myInterestRate')}
                {pot.isPrizeOnly ? null : <InterestTooltip pot={pot} />}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Interest baseApy={pot.apy} bonusApy={pot.bonusApy} prizeOnly={pot.isPrizeOnly} />
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
                  ticketTotalSupply={pot.totalTickets}
                  winners={pot.numberOfWinners}
                  ticketToken={pot.rewardToken}
                  tokenDecimals={pot.tokenDecimals}
                />
              </Typography>
            </Grid>
          </>
        ) : null}
      </Grid>
    </Grid>
  );
};
