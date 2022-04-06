import React, { memo, PropsWithChildren, useMemo } from 'react';
import { Card, CardAccordionGroup, CardAccordionItem } from '../../../../components/Cards';
import { Grid, Link, makeStyles } from '@material-ui/core';
import { Logo } from '../../../../components/Pot';
import { useTranslation } from 'react-i18next';
import { getUnderylingToken, tokensByNetworkAddress } from '../../../../config/tokens';
import { DrawStat } from '../../../../components/DrawStat';
import { TransListJoin } from '../../../../components/TransListJoin';
import { byDecimals, formatDecimals } from '../../../../helpers/format';
import {
  arrayUnique,
  formatAddressShort,
  getNetworkExplorerUrl,
  listJoin,
} from '../../../../helpers/utils';
import { ErrorOutline } from '@material-ui/icons';
import BigNumber from 'bignumber.js';
import clsx from 'clsx';
import styles from './styles';
import { Translate } from '../../../../components/Translate';
import { selectWalletAddress } from '../../../wallet/selectors';
import { useAppSelector } from '../../../../store';
import { selectPotById } from '../../../data/selectors/pots';
import { selectDrawById } from '../../../data/selectors/draws';
import { DrawEntity } from '../../../data/entities/draws';
import { ApiWinner } from '../../../data/apis/draws';
import { NetworkEntity } from '../../../data/entities/network';

const useStyles = makeStyles(styles);

const useTotalPrizeValue = function (winners: any) {
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

function normalizeWinnings(
  awards: any,
  drawToken: any,
  ticketAddress: any,
  ticketPPFS: any,
  prices: any,
  network: any
) {
  const tokens: Record<string, any> = {};

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
      const symbol = underlyingToken.symbol as string;
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

function normalizeStaked(
  stakedAmount: any,
  ticketAddress: any,
  ticketPPFS: any,
  prices: any,
  network: any
) {
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

const useNormalizedWinners = function (
  winners: ApiWinner[],
  drawToken: any,
  ticketAddress: any,
  ticketPPFS: BigNumber,
  network: NetworkEntity['id']
) {
  const prices = useAppSelector(state => state.prices.prices);

  return useMemo(() => {
    return winners.map(winner => ({
      ...winner,
      awards: normalizeWinnings(
        winner.awards,
        drawToken,
        ticketAddress,
        ticketPPFS,
        prices,
        network
      ),
      ...normalizeStaked(winner.staked, ticketAddress, ticketPPFS, prices, network),
    }));
  }, [winners, prices, drawToken, ticketPPFS, ticketAddress, network]);
};

// TODO: types
const Title = memo(function ({ name }: any) {
  const classes = useStyles();
  return (
    <div className={classes.title}>
      <Translate i18nKey="winners.potDraw" values={{ name }} />
    </div>
  );
});

// TODO: types
const NFT = memo(function ({ address, id }: any) {
  // TODO
  return null;
});

// TODO: types
const ValueWon = memo(function ({ currency, amount }: any) {
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

// TODO: types
const WonTokens = memo(function ({ winners }: any) {
  const classes = useStyles();
  const allTokens = new Set();

  winners.forEach((winner: any) =>
    winner.awards.forEach((award: any) => allTokens.add(award.symbol))
  );

  return (
    <div className={classes.wonTotalTokens}>
      <Translate i18nKey="pot.winTotalTokensIn" />
      <TransListJoin list={Array.from(allTokens)} />
    </div>
  );
});

// TODO: types
const DrawDate = memo(function ({ timestamp }: any) {
  const date = new Date(timestamp * 1000);
  const formatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'short' });
  return <>{formatter.format(date)}</>;
});

// TODO: types
const Players = memo(function ({ players }: any) {
  return (
    <>
      {Number(players).toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })}
    </>
  );
});

// TODO: types
const PrizePerWinner = memo(function ({ winners }: any) {
  const classes = useStyles();

  return (
    <>
      {Object.values(winners[0].awards).map((prize: any) => {
        return (
          <div key={prize.symbol}>
            <span className={classes.perWinnerToken}>
              {formatDecimals(prize.amount, 2 as any)} {prize.symbol}
            </span>{' '}
            {prize.isNFT ? null : (
              <span className={classes.perWinnerValue}>
                (${formatDecimals(prize.value, 2 as any)})
              </span>
            )}
          </div>
        );
      })}
    </>
  );
});

// TODO: types
function getNftsFromAwards(awards: any) {
  return awards
    .filter((award: any) => award.isNFT)
    .map((award: any) => award.nftIds.map((id: any) => ({ address: award.address, id: id })))
    .flat();
}

// TODO: types
const Winners = memo(function ({ network, tokenAddress, winners }: any) {
  const { t } = useTranslation();
  const classes = useStyles();
  const tokenData = tokensByNetworkAddress[network]?.[tokenAddress.toLowerCase()];

  const sortedWinners = useMemo(() => {
    const entries = winners.map((winner: any, index: any) => {
      return {
        id: winner.address + index,
        staked: winner.staked,
        value: winner.stakedValue,
        address: winner.address,
        nfts: getNftsFromAwards(winner.awards),
      };
    });

    // @ts-ignore
    return entries.sort((a: any, b: any) => (a.staked > b.staked) - (a.staked < b.staked));
  }, [winners]);

  // console.log(sortedWinners);

  return (
    <Grid container spacing={2} className={classes.rowWinners}>
      {sortedWinners.map((winner: any) => {
        const valueFormatted = formatDecimals(winner.value, 2 as any);
        const stakedFormatted = formatDecimals(winner.staked, 2 as any);

        return (
          <Grid item xs={6} key={winner.id}>
            <div className={classes.winnerAddress}>{formatAddressShort(winner.address)}</div>
            <div className={classes.winnerStaked}>
              {t('winners.stakedAmountToken', { amount: stakedFormatted, token: tokenData.symbol })}
            </div>
            <div>(${valueFormatted})</div>
            {winner.nfts.length
              ? winner.nfts.map((nft: any) => (
                  <NFT key={`${nft.address}#${nft.id}`} address={nft.address} id={nft.id} />
                ))
              : null}
          </Grid>
        );
      })}
    </Grid>
  );
});

const UserWonDraw = memo(function ({ winners }: any) {
  const classes = useStyles();
  const address = useAppSelector(selectWalletAddress)?.toLowerCase();

  if (address && winners.find((winner: any) => winner.address.toLowerCase() === address)) {
    return (
      <div className={classes.userWonPrize}>
        <ErrorOutline className={clsx(classes.userWonPrizeIcon)} fontSize="inherit" />
        <div className={clsx(classes.userWonPrizeText)}>
          <Translate i18nKey="winners.userWonPrize" />
        </div>
      </div>
    );
  }

  return null;
});

const WonPrizeTokens = memo(function ({ totalPrizeValue, winners }: any) {
  return (
    <>
      <ValueWon currency="$" amount={totalPrizeValue} />
      <WonTokens winners={winners} />
    </>
  );
});

const WonPrizeNfts = memo(function ({ nfts }: any) {
  const classes = useStyles();
  const prizes = useMemo(() => listJoin(nfts, '???'), [nfts]);

  return (
    <div className={classes.valueWon}>
      <Translate i18nKey="winners.valueWon" values={{ currency: '', amount: prizes }} />
    </div>
  );
});

const WonPrizeBoth = memo(function ({ nfts, totalPrizeValue, winners }: any) {
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

function getNftName(network: any, address: any, id: any) {
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

const WonPrize = memo(function ({ network, totalPrizeValue, winners }: any) {
  const nftsWon = arrayUnique(
    winners
      .map((winner: any) =>
        winner.awards
          .filter(
            (award: any) =>
              award.isNFT && award.address.toLowerCase() in tokensByNetworkAddress[network]
          )
          .map((award: any) =>
            award.nftIds.map((id: any) => getNftName(network, award.address, id))
          )
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

export type DrawProps = PropsWithChildren<{
  id: DrawEntity['id'];
}>;
export const Draw = memo(function Draw({ id }: DrawProps) {
  const classes = useStyles();
  const draw = useAppSelector(state => selectDrawById(state, id));
  const pot = useAppSelector(state => selectPotById(state, draw.potId));
  const winners = useNormalizedWinners(
    draw.winners,
    pot.token,
    pot.rewardAddress,
    draw.ppfs,
    draw.networkId
  );
  const totalPrizeValue = useTotalPrizeValue(winners);

  return (
    <Card variant="purpleMid">
      <Grid container spacing={2} className={classes.rowLogoWonTotal}>
        <Grid item xs="auto">
          {/* @ts-ignore */}
          <Logo icon={pot.icon || pot.id} />
        </Grid>
        <Grid item xs="auto" className={classes.columnTitleValueWon}>
          <Title name={pot.name} />
          <WonPrize network={pot.network} winners={winners} totalPrizeValue={totalPrizeValue} />
        </Grid>
      </Grid>
      <UserWonDraw winners={draw.winners} />
      <Grid container spacing={2} className={classes.rowDrawStats}>
        <Grid item xs={6}>
          {/* @ts-ignore */}
          <DrawStat i18nKey="winners.drawDate">
            <DrawDate timestamp={draw.timestamp} />
          </DrawStat>
        </Grid>
        <Grid item xs={6}>
          {/* @ts-ignore */}
          <DrawStat i18nKey="winners.players">
            <Players players={draw.totalPlayers} />
          </DrawStat>
        </Grid>
        <Grid item xs={12}>
          {/* @ts-ignore */}
          <DrawStat i18nKey="winners.prizePerWinner">
            <PrizePerWinner winners={winners} />
          </DrawStat>
        </Grid>
      </Grid>
      <CardAccordionGroup>
        <CardAccordionItem titleKey="winners.winners">
          <Winners network={pot.network} tokenAddress={pot.tokenAddress} winners={winners} />
          <Link
            href={getNetworkExplorerUrl(draw.networkId, `/tx/${draw.txHash}`)}
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
});
