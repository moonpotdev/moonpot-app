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
  formatAddressShort,
  getNetworkExplorerUrl,
  listJoin,
  variantClass,
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
import { ApiAward, ApiWinner } from '../../../data/apis/draws';
import { NetworkEntity } from '../../../data/entities/network';
import { uniq } from 'lodash';

const useStyles = makeStyles(styles);

const useTotalPrizeValue = function (winners: Winner[]) {
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

interface Winnings {
  address: string;
  symbol: string;
  amount: number;
  value: number;
  isNFT: boolean;
  nftIds: number[];
}

function normalizeWinnings(
  awards: ApiAward[],
  drawToken: string,
  ticketAddress: string,
  ticketPPFS: BigNumber,
  prices: Record<string, number>,
  network: string
): Winnings[] {
  const tokens: Record<
    string,
    {
      address: string;
      symbol: string;
      amount: BigNumber;
      value: BigNumber;
      isNFT: boolean;
      nftIds: number[];
    }
  > = {};

  for (const { token, amount, tokenIds } of awards) {
    const isNFT = !!(tokenIds && tokenIds.length > 0);
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
  stakedAmount: BigNumber,
  ticketAddress: string,
  ticketPPFS: BigNumber,
  prices: Record<string, number>,
  network: string
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

interface Winner {
  address: string;
  stakedValue: number;
  awards: Winnings[];
  staked: number;
}

const useNormalizedWinners = function (
  winners: ApiWinner[],
  drawToken: string,
  ticketAddress: string,
  ticketPPFS: BigNumber,
  network: NetworkEntity['id']
): Winner[] {
  const prices: Record<string, number> = useAppSelector(state => state.prices.prices);

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

type TitleProps = PropsWithChildren<{
  name: string;
}>;
const Title = memo<TitleProps>(function ({ name }) {
  const classes = useStyles();
  return (
    <div className={classes.title}>
      <Translate i18nKey="winners.potDraw" values={{ name }} />
    </div>
  );
});

type NFTProps = PropsWithChildren<{
  address: string;
  id: number;
}>;
const NFT = memo<NFTProps>(function ({ address, id }) {
  // TODO
  return null;
});

type ValueWonProps = PropsWithChildren<{
  currency: string;
  amount: number;
}>;
const ValueWon = memo<ValueWonProps>(function ({ currency, amount }) {
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

type WonTokensProps = PropsWithChildren<{ winners: Winner[] }>;
const WonTokens = memo<WonTokensProps>(function ({ winners }) {
  const classes = useStyles();
  const allTokens = new Set();

  winners.forEach(winner => winner.awards.forEach(award => allTokens.add(award.symbol)));

  return (
    <div className={classes.wonTotalTokens}>
      <Translate i18nKey="pot.winTotalTokensIn" />
      <TransListJoin list={Array.from(allTokens)} />
    </div>
  );
});

type DrawDateProps = PropsWithChildren<{
  timestamp: number;
}>;
const DrawDate = memo<DrawDateProps>(function ({ timestamp }) {
  const date = new Date(timestamp * 1000);
  const formatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'short' });
  return <>{formatter.format(date)}</>;
});

type PlayersProps = PropsWithChildren<{
  players: number;
}>;
const Players = memo<PlayersProps>(function ({ players }) {
  return (
    <>
      {Number(players).toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })}
    </>
  );
});

type PrizePerWinnerProps = PropsWithChildren<{ winners: Winner[] }>;
const PrizePerWinner = memo<PrizePerWinnerProps>(function ({ winners }) {
  const classes = useStyles();

  return (
    <>
      {Object.values(winners[0].awards).map(prize => {
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

function getNftsFromAwards(awards: Winner['awards']) {
  return awards
    .filter(award => award.isNFT)
    .map(award => award.nftIds.map(id => ({ address: award.address, id: id })))
    .flat();
}

type WinnersProps = PropsWithChildren<{
  network: string;
  tokenAddress: string;
  winners: Winner[];
}>;
const Winners = memo<WinnersProps>(function ({ network, tokenAddress, winners }) {
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

    // @ts-ignore
    return entries.sort((a, b) => (a.staked > b.staked) - (a.staked < b.staked));
  }, [winners]);

  // console.log(sortedWinners);

  return (
    <Grid container spacing={2} className={classes.rowWinners}>
      {sortedWinners.map(winner => {
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

type UserWonDrawProps = PropsWithChildren<{
  winners: ApiWinner[];
}>;
const UserWonDraw = memo<UserWonDrawProps>(function ({ winners }) {
  const classes = useStyles();
  const address = useAppSelector(selectWalletAddress)?.toLowerCase();

  if (address && winners.find(winner => winner.address.toLowerCase() === address)) {
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

type WonPrizeTokensProps = PropsWithChildren<{
  totalPrizeValue: number;
  winners: Winner[];
}>;
const WonPrizeTokens = memo<WonPrizeTokensProps>(function ({ totalPrizeValue, winners }) {
  return (
    <>
      <ValueWon currency="$" amount={totalPrizeValue} />
      <WonTokens winners={winners} />
    </>
  );
});

type WonPrizeNftsProps = PropsWithChildren<{ nfts: string[] }>;
const WonPrizeNfts = memo<WonPrizeNftsProps>(function ({ nfts }) {
  const classes = useStyles();
  const prizes = useMemo(() => listJoin(nfts, '???'), [nfts]);

  return (
    <div className={classes.valueWon}>
      <Translate i18nKey="winners.valueWon" values={{ currency: '', amount: prizes }} />
    </div>
  );
});

type WonPrizeBothProps = PropsWithChildren<{
  nfts: string[];
  totalPrizeValue: number;
  winners: Winner[];
}>;
const WonPrizeBoth = memo<WonPrizeBothProps>(function ({ nfts, totalPrizeValue, winners }) {
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

function getNftName(network: string, address: string, id: number): string {
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

type WonPrizeProps = PropsWithChildren<{
  network: string;
  totalPrizeValue: number;
  winners: Winner[];
}>;
const WonPrize = memo<WonPrizeProps>(function ({ network, totalPrizeValue, winners }) {
  const nftsWon = uniq(
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
  const prizeNfts = !!(totalPrizeValue <= 0 && nftsWon.length);
  const prizeBoth = !!(totalPrizeValue > 0 && nftsWon.length);

  if (prizeNfts) {
    return <WonPrizeNfts nfts={nftsWon} />;
  } else if (prizeBoth) {
    return <WonPrizeBoth totalPrizeValue={totalPrizeValue} winners={winners} nfts={nftsWon} />;
  }

  return <WonPrizeTokens totalPrizeValue={totalPrizeValue} winners={winners} />;
});

type DrawNetworkProps = PropsWithChildren<{
  network: string;
}>;
const DrawNetwork = memo<DrawNetworkProps>(function PotNetwork({ network }) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.network, variantClass(classes, 'network', network))}>
      <img
        src={require(`../../../../images/networks/${network}.svg`).default}
        width="24"
        height="24"
        alt={network}
      />
    </div>
  );
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
      <DrawNetwork network={pot.network} />
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
