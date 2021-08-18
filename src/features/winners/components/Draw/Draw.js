import React, { memo, useMemo } from 'react';
import { Card, CardAccordionGroup, CardAccordionItem } from '../../../../components/Cards';
import { Grid, Link, makeStyles } from '@material-ui/core';
import styles from './styles';
import { Logo } from '../../../../components/Pot';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { tokensByNetworkAddress, tokensByNetworkSymbol } from '../../../../config/tokens';
import { DrawStat } from '../../../../components/DrawStat';
import { TransListJoin } from '../../../../components/TransListJoin';
import { byDecimals, formatDecimals } from '../../../../helpers/format';
import { formatAddressShort } from '../../../../helpers/utils';
import BigNumber from 'bignumber.js';

const useStyles = makeStyles(styles);

function useTotalTokenAmounts(winners) {
  return useMemo(() => {
    const amounts = {};
    for (const winner of winners) {
      for (const [symbol, amount] of Object.entries(winner.prizes)) {
        amounts[symbol] = symbol in amounts ? amounts[symbol] + amount : amount;
      }
    }
    return amounts;
  }, [winners]);
}

const useTotalPrizeValue = function (winnings, numberOfWinners) {
  return useMemo(() => {
    let sum = 0;

    for (const { value } of winnings) {
      sum += value * numberOfWinners;
    }

    return sum;
  }, [winnings]);
};

const useNormalizedWinnings = function (awards, drawToken) {
  const prices = useSelector(state => state.pricesReducer.prices);

  return useMemo(() => {
    const network = 'bsc';
    const tokens = {
      [drawToken]: {
        symbol: drawToken,
        amount: new BigNumber(0),
        value: new BigNumber(0),
      },
    };

    for (const { token, amount } of awards) {
      const tokenData = tokensByNetworkAddress[network]?.[token.toLowerCase()];
      if (tokenData) {
        const numericAmount = byDecimals(amount, tokenData.decimals);
        const price = new BigNumber(prices[tokenData.oracleId] || 0);
        const totalPrice = numericAmount.multipliedBy(price);
        const symbol = tokenData.accountingSymbol || tokenData.symbol;

        if (symbol in tokens) {
          tokens[symbol].amount = tokens[symbol].amount.plus(numericAmount);
          tokens[symbol].value = tokens[symbol].value.plus(totalPrice);
        } else {
          tokens[symbol] = {
            symbol: symbol,
            amount: numericAmount,
            value: totalPrice,
          };
        }
      } else {
        console.error(`No token for ${token} on ${network} found`);
      }
    }

    return Object.values(tokens).map(token => ({
      symbol: token.symbol,
      amount: token.amount.toNumber(),
      value: token.value.toNumber(),
    }));
  }, [awards, prices]);
};

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
  const amountFormatted = amount.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

  return (
    <div className={classes.valueWon}>
      <Trans i18nKey="winners.valueWon" values={{ currency, amount: amountFormatted }} />
    </div>
  );
});

const WonTokens = memo(function ({ winnings }) {
  const classes = useStyles();
  const allTokens = winnings.map(winning => winning.symbol);

  return (
    <div className={classes.wonTotalTokens}>
      <Trans i18nKey="pot.winTotalTokensIn" />
      <TransListJoin list={[...allTokens]} />
    </div>
  );
});

const DrawDate = memo(function ({ timestamp }) {
  const date = new Date(timestamp * 1000);
  const formatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'short' });
  return formatter.format(date);
});

const Players = memo(function ({ players }) {
  return players.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
});

const PrizePerWinner = memo(function ({ winnings }) {
  const classes = useStyles();

  return Object.values(winnings).map(prize => {
    return (
      <div key={prize.symbol} className={classes.prizePerWinner}>
        <span className={classes.perWinnerToken}>
          {formatDecimals(prize.amount, 2)} {prize.symbol}
        </span>{' '}
        <span className={classes.perWinnerValue}>(${formatDecimals(prize.value, 2)})</span>
      </div>
    );
  });
});

const Winners = memo(function ({ token, tokenDecimals, winners }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const network = 'bsc';
  const prices = useSelector(state => state.pricesReducer.prices);
  const tokenData = tokensByNetworkSymbol[network]?.[token];
  const price = prices[tokenData.oracleId] || 0;

  return (
    <Grid container spacing={2} className={classes.rowWinners}>
      {winners.map((winner, index) => {
        const staked = byDecimals(winner.balance, tokenDecimals).multipliedBy(2);
        const value = formatDecimals(staked.multipliedBy(price), 2);
        const stakedFormatted = formatDecimals(staked, 2);

        return (
          <Grid item xs={6} key={`${winner.address}${index}`}>
            <div className={classes.winnerAddress}>{formatAddressShort(winner.address)}</div>
            <div className={classes.winnerStaked}>
              {t('winners.stakedAmountToken', { amount: stakedFormatted, token })}
            </div>
            <div>(${value})</div>
          </Grid>
        );
      })}
    </Grid>
  );
});

export const Draw = function ({ draw }) {
  const classes = useStyles();
  const winnings = useNormalizedWinnings(draw.awards, draw.pot.token);
  const totalPrizeValue = useTotalPrizeValue(winnings, draw.winners.length);

  return (
    <Card variant="purpleMid">
      <Grid container spacing={2} className={classes.rowLogoWonTotal}>
        <Grid item xs={4}>
          <Logo
            name={draw.pot.name}
            baseToken={draw.pot.token}
            sponsorToken={draw.pot.sponsorToken}
          />
        </Grid>
        <Grid item xs={8}>
          <Title name={draw.pot.name} number={draw.drawNumber} />
          <ValueWon currency="$" amount={totalPrizeValue} />
          <WonTokens winnings={winnings} />
        </Grid>
      </Grid>
      <Grid container spacing={2} className={classes.rowDrawStats}>
        <Grid item xs={6}>
          <DrawStat i18nKey="winners.drawDate">
            <DrawDate timestamp={draw.timestamp} />
          </DrawStat>
        </Grid>
        <Grid item xs={6}>
          {/*<DrawStat i18nKey="winners.players">*/}
          {/*  <Players players={draw.players || 0} />*/}
          {/*</DrawStat>*/}
        </Grid>
        <Grid item xs={12}>
          <DrawStat i18nKey="winners.prizePerWinner">
            <PrizePerWinner winnings={winnings} />
          </DrawStat>
        </Grid>
      </Grid>
      <CardAccordionGroup>
        <CardAccordionItem titleKey="winners.winners">
          <Winners
            token={draw.pot.token}
            tokenDecimals={draw.pot.tokenDecimals}
            winners={draw.winners}
          />
          <Link
            href={`https://bscscan.com/tx/${draw.txHash}`}
            target="_blank"
            rel="noreferrer"
            className={classes.txLink}
          >
            <Trans i18nKey="winners.viewTransaction" />
          </Link>
        </CardAccordionItem>
      </CardAccordionGroup>
    </Card>
  );
};
