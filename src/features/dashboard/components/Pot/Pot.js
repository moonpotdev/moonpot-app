import * as React from 'react';
import { useSelector } from 'react-redux';
import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import styles from '../../styles';
import { investmentOdds, isEmpty } from '../../../../helpers/utils';
import ActiveLayout from './ActiveLayout';
import EOLLayout from './EOLLayout';
import { Card, Cards } from '../../../../components/Cards/Cards';
import { Trans, useTranslation } from 'react-i18next';
import { calculateTotalPrize, formatDecimals } from '../../../../helpers/format';
import Countdown from '../../../../components/Countdown';
import PrizeSplit from '../../../../components/PrizeSplit';
import BigNumber from 'bignumber.js';

const useStyles = makeStyles(styles);

const PotImage = function ({ item }) {
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

const PotTitle = function ({ item, prices }) {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Grid item xs={8}>
      {item.hardcodeWin ? (
        <React.Fragment>
          <Typography className={classes.potUsdTop} align={'right'}>
            <span>{t('win')}</span> {item.hardcodeWin}
          </Typography>
        </React.Fragment>
      ) : (
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
      )}
    </Grid>
  );
};

const InfoBlock = function ({ item, prices }) {
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

const Pot = function ({ item }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const [steps, setSteps] = React.useState({
    modal: false,
    currentStep: -1,
    items: [],
    finished: false,
  });
  const { vault, wallet, balance, prices, earned } = useSelector(state => ({
    vault: state.vaultReducer,
    wallet: state.walletReducer,
    balance: state.balanceReducer,
    prices: state.pricesReducer,
    earned: state.earnedReducer,
  }));

  React.useEffect(() => {
    const index = steps.currentStep;
    if (!isEmpty(steps.items[index]) && steps.modal) {
      const items = steps.items;
      if (!items[index].pending) {
        items[index].pending = true;
        items[index].action();
        setSteps({ ...steps, items: items });
      } else {
        if (wallet.action.result === 'success' && !steps.finished) {
          const nextStep = index + 1;
          if (!isEmpty(items[nextStep])) {
            setSteps({ ...steps, currentStep: nextStep });
          } else {
            setSteps({ ...steps, finished: true });
          }
        }
      }
    }
  }, [steps, wallet.action]);

  /*-----------------------------------------------------------------------*/

  return (
    <div className={classes.activeMyPot}>
      {/*TODO SIMPLIFY CLASS ^^^*/}
      <Cards>
        <Card variant={'purpleLight'}>
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
            <InfoBlock item={item} prices={prices} />
          </Grid>
          {/*Bottom*/}
          {item.status === 'active' ? <ActiveLayout item={item} /> : <EOLLayout item={item} />}
        </Card>
      </Cards>
    </div>
  );
};

export default Pot;
