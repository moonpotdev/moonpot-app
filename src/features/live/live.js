import React, { memo, useEffect, useMemo, useState } from 'react';
import { Container, Grid, Link, makeStyles } from '@material-ui/core';
import reduxActions from '../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { usePot } from '../../helpers/hooks';
import Countdown from '../../components/Countdown';
import { Card, Cards } from '../../components/Cards';
import { Translate } from '../../components/Translate';
import { RouteLoading } from '../../components/RouteLoading';
import liveActions from '../redux/actions/live';
import { Logo, WinTokens, WinTotal } from '../../components/Pot';
import styles from './styles';
import BigNumber from 'bignumber.js';
import { tokensByNetworkAddress } from '../../config/tokens';
import { byDecimals, formatDecimals } from '../../helpers/format';
import { formatAddressShort } from '../../helpers/utils';

const useStyles = makeStyles(styles);

const DataFetcher = memo(function DataFetcher() {
  const dispatch = useDispatch();
  const pricesLastUpdated = useSelector(state => state.pricesReducer.lastUpdated);
  const address = useSelector(state => state.walletReducer.address);

  useEffect(() => {
    if (pricesLastUpdated > 0) {
      dispatch(reduxActions.vault.fetchPools());
    }
  }, [dispatch, pricesLastUpdated]);

  useEffect(() => {
    if (address && pricesLastUpdated > 0) {
      dispatch(reduxActions.balance.fetchBalances());
    }
  }, [dispatch, address, pricesLastUpdated]);

  return null;
});

const ResultsWatcher = memo(function ResultsWatcher({ id, enabled }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (enabled) {
      dispatch(liveActions.startWatchDraw(id));
      return () => dispatch(liveActions.stopWatchDraw(id));
    }
  }, [dispatch, id, enabled]);

  return null;
});

const Winnings = memo(function Winnings({ winnings }) {
  const classes = useStyles();

  return winnings.map(token => (
    <div key={token.symbol}>
      <span className={classes.token}>
        {formatDecimals(token.amount, 2)} {token.symbol}
      </span>{' '}
      <span className={classes.value}>(${formatDecimals(token.value, 2)})</span>
    </div>
  ));
});

const Winners = memo(function Winners({ winners }) {
  const classes = useStyles();
  return (
    <div className={classes.winners}>
      {Object.entries(winners).map(([winner, winnings], index) => (
        <div key={winner} className={classes.winner}>
          <div className={classes.winnerAddress}>
            {index + 1}
            {'. '}
            {formatAddressShort(winner)}
          </div>
          <div className={classes.winnings}>
            <Winnings winnings={winnings} />
          </div>
        </div>
      ))}
    </div>
  );
});

const Results = memo(function Results({ id, winners }) {
  const classes = useStyles();
  const step = useSelector(state => state.live[id].step);
  const awardTx = useSelector(state => state.live[id].awardTx);

  const status = useMemo(() => {
    switch (step) {
      case 'idle':
      case 'pending':
        return 'Awaiting draw...';
      case 'started':
      case 'awarded':
        return 'Awaiting results...';
      case 'finished':
        return 'Winners';
      default:
        return null;
    }
  }, [step]);

  return (
    <div>
      {status ? <div className={classes.drawStatus}>{status}</div> : null}
      {step === 'finished' ? (
        <>
          <Winners winners={winners} />
          <Link
            href={`https://bscscan.com/tx/${awardTx}`}
            target="_blank"
            rel="noreferrer"
            className={classes.txLink}
          >
            <Translate i18nKey="winners.viewTransaction" />
          </Link>
        </>
      ) : null}
    </div>
  );
});

const Title = memo(function ({ name }) {
  const classes = useStyles();
  return (
    <div className={classes.title}>
      <Translate i18nKey="pot.title" values={{ name }} />
    </div>
  );
});

const useWinnersValues = function (winners, drawToken, network) {
  const prices = useSelector(state => state.pricesReducer.prices);

  return useMemo(() => {
    return Object.fromEntries(
      Object.entries(winners || {}).map(([winner, tokenAddressAmount]) => {
        const tokens = {
          [drawToken]: {
            symbol: drawToken,
            amount: new BigNumber(0),
            value: new BigNumber(0),
          },
        };

        for (const [tokenAddress, tokenAmount] of Object.entries(tokenAddressAmount)) {
          const tokenData = tokensByNetworkAddress[network]?.[tokenAddress.toLowerCase()];
          if (tokenData) {
            const numericAmount = byDecimals(tokenAmount, tokenData.decimals);
            const price = new BigNumber(prices[tokenData.oracleId] || 0);
            const totalPrice = numericAmount.multipliedBy(price);
            const symbol = tokenData.displaySymbol || tokenData.symbol;

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
            console.warn(`No token for ${tokenAddress} on ${network} found`);
          }
        }

        return [
          winner,
          Object.values(tokens).map(token => ({
            symbol: token.symbol,
            amount: token.amount.toNumber(),
            value: token.value.toNumber(),
          })),
        ];
      })
    );
  }, [winners, prices, drawToken, network]);
};

const useTotalWinnings = function (winners) {
  return useMemo(
    function () {
      let sum = 0;

      if (winners) {
        for (const tokens of Object.values(winners)) {
          for (const token of tokens) {
            sum += token.value;
          }
        }
      }

      return sum;
    },
    [winners]
  );
};

function useWinners(id, drawToken, network) {
  const winners = useSelector(state => state.live[id].winners);
  return useWinnersValues(winners, drawToken, network);
}

const WonTotal = memo(function ({ winners }) {
  const classes = useStyles();
  const total = useTotalWinnings(winners);
  const totalFormatted = total.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

  return (
    <div className={classes.winTotal}>
      <Translate i18nKey="winners.valueWon" values={{ currency: '$', amount: totalFormatted }} />
    </div>
  );
});

const LiveDraw = memo(function LiveDraw({ id }) {
  const pot = usePot(id);
  const classes = useStyles();
  const drawTime = pot.expiresAt;
  const [checkForResults, setCheckForResults] = useState(() => Date.now() / 1000 >= drawTime);
  const step = useSelector(state => state.live[id].step);
  const winners = useWinners(id, pot.token, pot.network);

  useEffect(() => {
    const initial = Date.now() / 1000;
    if (initial < drawTime) {
      const id = setInterval(() => {
        const now = Date.now() / 1000;
        if (now >= drawTime) {
          clearInterval(id);
          setCheckForResults(true);
        } else {
          setCheckForResults(false);
        }
      }, 1000);

      return () => clearInterval(id);
    }
  }, [drawTime, setCheckForResults]);

  return (
    <Card variant="purpleMid">
      <ResultsWatcher id={id} enabled={checkForResults} />
      <Grid container spacing={2} className={classes.rowLogoTitle}>
        <Grid item xs={4}>
          <Logo baseToken={pot.token} sponsorToken={pot.sponsorToken} />
        </Grid>
        <Grid item xs={8}>
          <Title name={pot.name} />
          {step === 'finished' ? (
            <WonTotal winners={winners} />
          ) : (
            <WinTotal
              awardBalanceUsd={pot.awardBalanceUsd}
              totalSponsorBalanceUsd={pot.totalSponsorBalanceUsd}
            />
          )}
          <WinTokens depositToken={pot.token} sponsors={pot.sponsors} />
        </Grid>
      </Grid>
      {checkForResults ? (
        <Results id={id} winners={winners} />
      ) : (
        <div className={classes.countdown}>
          <Countdown until={pot.expiresAt * 1000} resolution="seconds" />
        </div>
      )}
    </Card>
  );
});

const NextLiveDraw = memo(function NextLiveDraw() {
  const pots = useSelector(state => state.vaultReducer.pools);
  const next = useMemo(() => {
    const cutoff = Date.now() / 1000 - 60 * 60;
    const candidates = Object.values(pots).filter(pot => pot.expiresAt > cutoff);
    if (candidates.length) {
      candidates.sort((a, b) => (a.expiresAt > b.expiresAt) - (a.expiresAt < b.expiresAt));
      return candidates[0].id;
    }

    return null;
  }, [pots]);

  const [show, setShow] = useState(null);

  useEffect(() => {
    if (show === null && next !== null) {
      setShow(next);
    }
  }, [next, show, setShow]);

  if (show) {
    return <LiveDraw id={show} />;
  }

  return <RouteLoading />;
});

const Live = () => {
  return (
    <Container maxWidth="xl">
      <DataFetcher />
      <Cards>
        <NextLiveDraw />
      </Cards>
    </Container>
  );
};

export default Live;
