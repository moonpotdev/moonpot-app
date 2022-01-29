import React, { memo, useMemo } from 'react';
import { Card, CardAccordionGroup, CardAccordionItem } from '../../../../components/Cards';
import { Grid, Link, makeStyles } from '@material-ui/core';
import { Logo } from '../../../../components/Pot';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { tokensByNetworkAddress } from '../../../../config/tokens';
import { DrawStat } from '../../../../components/DrawStat';
import { TransListJoin } from '../../../../components/TransListJoin';
import { byDecimals, formatDecimals } from '../../../../helpers/format';
import {
  arrayUnique,
  formatAddressShort,
  getUnderylingToken,
  listJoin,
} from '../../../../helpers/utils';
import { ErrorOutline } from '@material-ui/icons';
import BigNumber from 'bignumber.js';
import clsx from 'clsx';
import styles from './styles';
import { Translate } from '../../../../components/Translate';

const useStyles = makeStyles(styles);
const network = 'bsc';

const useTotalPrizeValue = function (winners) {
  return useMemo(() => {
    let sum = 0;

    for (const winner of winners) {
      for (const award of winner.awards) {
        sum += award.value;
      }
    }

    return sum;
  }, [winners]);
};

const useDrawSponsor = function (depositTokenAddress, ticketTokenAddress, winners) {
  return useMemo(() => {
    const depositTokenAddressLower = depositTokenAddress.toLowerCase();
    const ticketTokenAddressLower = ticketTokenAddress.toLowerCase();

    // Return first token which isn't base token
    for (const winner of winners) {
      for (const { token } of winner.awards) {
        const tokenAddress = token.toLowerCase();
        if (tokenAddress !== depositTokenAddressLower && tokenAddress !== ticketTokenAddressLower) {
          return tokensByNetworkAddress[network]?.[tokenAddress]?.symbol;
        }
      }
    }

    return null;
  }, [depositTokenAddress, ticketTokenAddress, winners]);
};

function normalizeWinnings(awards, drawToken, ticketAddress, ticketPPFS, prices) {
  const tokens = {};

  for (const { token, amount, tokenIds } of awards) {
    const isNFT = tokenIds && tokenIds.length > 0;
    const tokenData = tokensByNetworkAddress[network]?.[token.toLowerCase()];

    if (tokenData) {
      let numericAmount = isNFT
        ? new BigNumber(tokenIds.length)
        : byDecimals(amount, tokenData.decimals);

      // Handle PPFS for reward in pot tickets
      if (token.toLowerCase() === ticketAddress.toLowerCase()) {
        const pricePerFullShare = byDecimals(ticketPPFS || '1000000000000000000', 18);
        numericAmount = numericAmount.multipliedBy(pricePerFullShare);
      }

      const underlyingToken = getUnderylingToken(tokenData);
      const price = new BigNumber(prices[underlyingToken.oracleId] || 0);
      const totalPrice = numericAmount.multipliedBy(price);
      const symbol = underlyingToken.symbol;
      const address = underlyingToken.address;
      const nftIds = isNFT ? tokenIds : [];

      if (symbol in tokens) {
        tokens[symbol].amount = tokens[symbol].amount.plus(numericAmount);
        tokens[symbol].value = tokens[symbol].value.plus(totalPrice);

        if (isNFT) {
          tokens[symbol].nftIds = [...tokens[symbol].nftIds, ...nftIds];
        }
      } else {
        tokens[symbol] = {
          address: address,
          symbol: symbol,
          amount: numericAmount,
          value: totalPrice,
          isNFT: isNFT,
          nftIds: nftIds,
        };
      }
    } else {
      console.error(`No token for ${token} on ${network} found`);
    }
  }

  return Object.values(tokens).map(token => ({
    address: token.address,
    symbol: token.symbol,
    amount: token.amount.toNumber(),
    value: token.value.toNumber(),
    isNFT: token.isNFT,
    nftIds: token.nftIds,
  }));
}

function normalizeStaked(stakedAmount, ticketAddress, ticketPPFS, prices) {
  const ticketToken = tokensByNetworkAddress[network][ticketAddress.toLowerCase()];
  const underlyingToken = getUnderylingToken(ticketToken);
  const price = new BigNumber(prices[underlyingToken.oracleId] || 0);
  const pricePerFullShare = byDecimals(ticketPPFS || '1000000000000000000', 18);
  const numericAmount = byDecimals(stakedAmount, ticketToken.decimals)
    .multipliedBy(pricePerFullShare)
    .multipliedBy(ticketToken.stakedMultiplier);

  return {
    staked: numericAmount.toNumber(),
    stakedValue: numericAmount.multipliedBy(price).toNumber(),
  };
}

const useNormalizedWinners = function (winners, drawToken, ticketAddress, ticketPPFS) {
  const prices = useSelector(state => state.prices.prices);

  return useMemo(() => {
    return winners.map(winner => ({
      ...winner,
      awards: normalizeWinnings(winner.awards, drawToken, ticketAddress, ticketPPFS, prices),
      ...normalizeStaked(winner.staked, ticketAddress, ticketPPFS, prices),
    }));
  }, [winners, prices, drawToken, ticketPPFS, ticketAddress]);
};

const Title = memo(function ({ name }) {
  const classes = useStyles();
  return (
    <div className={classes.title}>
      <Translate i18nKey="winners.potDraw" values={{ name }} />
    </div>
  );
});

const NFT = memo(function ({ address, id }) {
  // TODO
  return null;
});

const ValueWon = memo(function ({ currency, amount }) {
  const classes = useStyles();
  const amountFormatted = amount.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

  return (
    <div className={classes.valueWon}>
      <Translate i18nKey="winners.valueWon" values={{ currency, amount: amountFormatted }} />
    </div>
  );
});

const WonTokens = memo(function ({ winners }) {
  const classes = useStyles();
  const allTokens = new Set();

  winners.forEach(winner => winner.awards.forEach(award => allTokens.add(award.symbol)));

  return (
    <div className={classes.wonTotalTokens}>
      <Translate i18nKey="pot.winTotalTokensIn" />
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
  return Number(players).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
});

const PrizePerWinner = memo(function ({ winners }) {
  const classes = useStyles();

  return Object.values(winners[0].awards).map(prize => {
    return (
      <div key={prize.symbol} className={classes.prizePerWinner}>
        <span className={classes.perWinnerToken}>
          {formatDecimals(prize.amount, 2)} {prize.symbol}
        </span>{' '}
        {prize.isNFT ? null : (
          <span className={classes.perWinnerValue}>(${formatDecimals(prize.value, 2)})</span>
        )}
      </div>
    );
  });
});

function getNftsFromAwards(awards) {
  return awards
    .filter(award => award.isNFT)
    .map(award => award.nftIds.map(id => ({ address: award.address, id: id })))
    .flat();
}

const Winners = memo(function ({ network, tokenAddress, winners }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const tokenData = tokensByNetworkAddress[network]?.[tokenAddress.toLowerCase()];

  const sortedWinners = useMemo(() => {
    const entries = winners.map((winner, index) => {
      return {
        id: winner.address + index,
        staked: winner.staked,
        value: winner.stakedValue,
        address: winner.address,
        nfts: getNftsFromAwards(winner.awards),
      };
    });

    return entries.sort((a, b) => (a.staked > b.staked) - (a.staked < b.staked));
  }, [winners]);

  // console.log(sortedWinners);

  return (
    <Grid container spacing={2} className={classes.rowWinners}>
      {sortedWinners.map(winner => {
        const valueFormatted = formatDecimals(winner.value, 2);
        const stakedFormatted = formatDecimals(winner.staked, 2);

        return (
          <Grid item xs={6} key={winner.id}>
            <div className={classes.winnerAddress}>{formatAddressShort(winner.address)}</div>
            <div className={classes.winnerStaked}>
              {t('winners.stakedAmountToken', { amount: stakedFormatted, token: tokenData.symbol })}
            </div>
            <div>(${valueFormatted})</div>
            {winner.nfts.length
              ? winner.nfts.map(nft => (
                  <NFT key={`${nft.address}#${nft.id}`} address={nft.address} id={nft.id} />
                ))
              : null}
          </Grid>
        );
      })}
    </Grid>
  );
});

const UserWonDraw = memo(function ({ winners }) {
  const classes = useStyles();
  const address = useSelector(state => state.wallet.address)?.toLowerCase();

  if (address && winners.find(winner => winner.address.toLowerCase() === address)) {
    return (
      <div className={classes.userWonPrize}>
        <ErrorOutline
          className={clsx(classes.userWonPrizeItem, classes.userWonPrizeIcon)}
          fontSize="inherit"
        />
        <div className={clsx(classes.userWonPrizeItem, classes.userWonPrizeText)}>
          <Translate i18nKey="winners.userWonPrize" />
        </div>
      </div>
    );
  }

  return null;
});

const WonPrizeTokens = memo(function ({ totalPrizeValue, winners }) {
  return (
    <>
      <ValueWon currency="$" amount={totalPrizeValue} />
      <WonTokens winners={winners} />
    </>
  );
});

const WonPrizeNfts = memo(function ({ nfts }) {
  const classes = useStyles();
  const prizes = useMemo(() => listJoin(nfts, '???'), [nfts]);

  return (
    <div className={classes.valueWon}>
      <Translate i18nKey="winners.valueWon" values={{ currency: '', amount: prizes }} />
    </div>
  );
});

const WonPrizeBoth = memo(function ({ nfts, totalPrizeValue, winners }) {
  const classes = useStyles();
  const amountFormatted = useMemo(
    () =>
      '$' +
      totalPrizeValue.toLocaleString(undefined, {
        maximumFractionDigits: 0,
      }),
    [totalPrizeValue]
  );
  const prizes = useMemo(
    () => listJoin([amountFormatted, ...nfts], '???'),
    [amountFormatted, nfts]
  );

  return (
    <>
      <div className={classes.valueWon}>
        <Translate i18nKey="winners.valueWon" values={{ currency: '', amount: prizes }} />
      </div>
      <WonTokens winners={winners} />
    </>
  );
});

function getNftName(network, address, id) {
  const token = tokensByNetworkAddress[network]?.[address.toLowerCase()];
  if (token) {
    if (token.type === 'nft' && token.nfts) {
      for (const range of token.nfts) {
        if (id >= range.min && id <= range.max) {
          return range.name;
        }
      }
    }

    return token.symbol;
  }

  return address + '#' + id;
}

const WonPrize = memo(function ({ network, totalPrizeValue, winners }) {
  const nftsWon = arrayUnique(
    winners
      .map(winner =>
        winner.awards
          .filter(
            award => award.isNFT && award.address.toLowerCase() in tokensByNetworkAddress[network]
          )
          .map(award => award.nftIds.map(id => getNftName(network, award.address, id)))
          .flat()
      )
      .flat()
  );
  const prizeNfts = totalPrizeValue <= 0 && nftsWon.length;
  const prizeBoth = totalPrizeValue > 0 && nftsWon.length;

  if (prizeNfts) {
    return <WonPrizeNfts nfts={nftsWon} />;
  } else if (prizeBoth) {
    return <WonPrizeBoth totalPrizeValue={totalPrizeValue} winners={winners} nfts={nftsWon} />;
  }

  return <WonPrizeTokens totalPrizeValue={totalPrizeValue} winners={winners} />;
});

export const Draw = function ({ draw }) {
  const classes = useStyles();
  // console.log(draw.pot.id, draw.winners);
  const winners = useNormalizedWinners(
    draw.winners,
    draw.pot.token,
    draw.pot.rewardAddress,
    draw.ppfs
  );
  // console.log(draw.pot.id, winners);
  const totalPrizeValue = useTotalPrizeValue(winners);
  const sponsorToken = useDrawSponsor(draw.pot.tokenAddress, draw.pot.rewardAddress, draw.winners);

  return (
    <Card variant="purpleMid">
      <Grid container spacing={2} className={classes.rowLogoWonTotal}>
        <Grid item xs="auto">
          <Logo
            icon={draw.pot.icon || draw.pot.id}
            sponsorToken={sponsorToken || draw.pot.sponsorToken}
          />
        </Grid>
        <Grid item xs="auto" className={classes.columnTitleValueWon}>
          <Title name={draw.pot.name} />
          <WonPrize
            network={draw.pot.network}
            winners={winners}
            totalPrizeValue={totalPrizeValue}
          />
        </Grid>
      </Grid>
      <UserWonDraw winners={draw.winners} />
      <Grid container spacing={2} className={classes.rowDrawStats}>
        <Grid item xs={6}>
          <DrawStat i18nKey="winners.drawDate">
            <DrawDate timestamp={draw.timestamp} />
          </DrawStat>
        </Grid>
        <Grid item xs={6}>
          <DrawStat i18nKey="winners.players">
            <Players players={draw.totalPlayers} />
          </DrawStat>
        </Grid>
        <Grid item xs={12}>
          <DrawStat i18nKey="winners.prizePerWinner">
            <PrizePerWinner winners={winners} />
          </DrawStat>
        </Grid>
      </Grid>
      <CardAccordionGroup>
        <CardAccordionItem titleKey="winners.winners">
          <Winners
            network={draw.pot.network}
            tokenAddress={draw.pot.tokenAddress}
            winners={winners}
          />
          <Link
            href={`https://bscscan.com/tx/${draw.txHash}`}
            target="_blank"
            rel="noreferrer"
            className={classes.txLink}
          >
            <Translate i18nKey="winners.viewTransaction" />
          </Link>
        </CardAccordionItem>
      </CardAccordionGroup>
    </Card>
  );
};
