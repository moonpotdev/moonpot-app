import React, { memo, useMemo } from 'react';
import { Card } from '../../../../components/Cards/Cards';
import { Grid, makeStyles } from '@material-ui/core';
import styles from './styles';
import { PotLogo } from '../../../home/components/Pot/Pot';
import { useSelector } from 'react-redux';
import { Trans } from 'react-i18next';
import { tokensByNetworkSymbol } from '../../../../config/tokens';

const useStyles = makeStyles(styles);

const Title = memo(function ({ name, number }) {
  const classes = useStyles();
  return (
    <div className={classes.title}>
      <Trans i18nKey="winners.potDrawNumber" values={{ name, number }} />
    </div>
  );
});

const ValueWon = memo(function ({ currency, amount }) {
  const classes = useStyles();
  return (
    <div className={classes.valueWon}>
      <Trans i18nKey="winners.valueWon" values={{ currency, amount }} />
    </div>
  );
});

const useTotalPrizeValue = function (winners) {
  const prices = useSelector(state => state.pricesReducer.prices);

  const tokenAmounts = useMemo(() => {
    const amounts = {};
    for (const winner of winners) {
      for (const [symbol, amount] of Object.entries(winner.prizes)) {
        amounts[symbol] = symbol in amounts ? amounts[symbol] + amount : amount;
      }
    }
    return amounts;
  }, [winners]);

  return useMemo(() => {
    const network = 'bsc';
    let total = 0;

    for (const [symbol, amount] of Object.entries(tokenAmounts)) {
      const token = tokensByNetworkSymbol[network]?.[symbol];
      if (token) {
        const price = prices[token.oracleId] || 0;
        total += amount * price;
      } else {
        console.error(`No token for ${symbol} on ${network} found`);
      }
    }

    return total.toLocaleString(undefined, {
      maximumFractionDigits: 0,
    });
  }, [tokenAmounts, prices]);
};

export const Draw = function ({ id }) {
  const classes = useStyles();
  const draw = useSelector(state => state.prizeDraws.draws[id]);
  const valueWon = useTotalPrizeValue(draw.winners);

  return (
    <Card variant="purpleLight">
      <Grid container spacing={2} className={classes.rowLogoWonTotal}>
        <Grid item xs={4}>
          <PotLogo name={draw.name} baseToken={draw.token} sponsorToken={draw.sponsorToken} />
        </Grid>
        <Grid item xs={8}>
          <Title name={draw.name} number={draw.number} />
          <ValueWon currency="$" amount={valueWon} />
        </Grid>
      </Grid>
    </Card>
  );
};
