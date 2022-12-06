import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Grid, makeStyles } from '@material-ui/core';
import { Card } from '../Cards';
import Countdown from '../Countdown';
import { byDecimals, formatDecimals, slug } from '../../helpers/format';
import { InterestTooltip, ProjectedPrizeTooltip } from '../Tooltip/tooltip';
import {
  translateToken,
  useDeposit,
  usePot,
  useTokenBalance,
  useTotalPrize,
} from '../../helpers/hooks';
import { DrawStat, DrawStatNextDraw } from '../DrawStat';
import { Translate } from '../Translate';
import { investmentOdds, listJoin, variantClass, ZERO } from '../../helpers/utils';
import { useTranslation } from 'react-i18next';
import styles from './styles';
import { getPotIconSrc } from '../../helpers/getPotIconSrc';
import { useHistory } from 'react-router';
import { TransListJoin } from '../TransListJoin';
import BigNumber from 'bignumber.js';
import clsx from 'clsx';
import { selectWalletAddress } from '../../features/wallet/selectors';

const useStyles = makeStyles(styles);

export const Logo = memo(function ({ icon }) {
  const iconSlug = slug(icon);
  const src = getPotIconSrc(iconSlug, false);

  if (src) {
    return <img src={src} alt="" width="90" height="90" aria-hidden={true} />;
  }

  throw new Error(`No pot icon available for ${iconSlug}.`);
});

const Title = memo(function ({ name }) {
  const classes = useStyles();
  return (
    <div className={classes.title}>
      <Translate i18nKey="pot.title" values={{ name }} />
    </div>
  );
});

const WinFeatureTokens = memo(function WinFeatureTokens({
  awardBalanceUsd,
  totalSponsorBalanceUsd,
  sponsors,
  depositToken,
}) {
  const classes = useStyles();
  const totalPrize = useTotalPrize(awardBalanceUsd, totalSponsorBalanceUsd);

  return (
    <>
      <div className={classes.winTotalPrize}>
        <Translate i18nKey="pot.winTotalPrize" values={{ prize: `$${totalPrize}` }} />
      </div>
      <WinTokens
        depositToken={depositToken}
        awardBalanceUsd={awardBalanceUsd}
        sponsors={sponsors}
      />
    </>
  );
});

const WinFeatureNFTs = memo(function WinFeatureNFTs({ nfts, depositToken }) {
  const classes = useStyles();
  const prizeList = useMemo(() => {
    const nftNames = nfts.map(nft => nft.name);
    return listJoin(nftNames);
  }, [nfts]);

  return (
    <>
      <div className={classes.winTotalPrize}>
        <Translate i18nKey="pot.winTotalPrize" values={{ prize: prizeList }} />
      </div>
      <div className={classes.winTotalTokens}>
        <Translate i18nKey="pot.stakeToken" values={{ token: depositToken }} />
      </div>
    </>
  );
});

const WinFeatureBoth = memo(function WinFeatureBoth({
  awardBalanceUsd,
  totalSponsorBalanceUsd,
  sponsors,
  nfts,
  depositToken,
}) {
  const classes = useStyles();
  const totalPrize = useTotalPrize(awardBalanceUsd, totalSponsorBalanceUsd);
  const nftNames = useMemo(() => {
    return nfts.map(nft => nft.name);
  }, [nfts]);

  return (
    <>
      <div className={classes.winTotalPrize}>
        <Translate i18nKey="pot.winTotalPrize" values={{ prize: `$${totalPrize}` }} />
      </div>
      <WinTokens
        depositToken={depositToken}
        awardBalanceUsd={awardBalanceUsd}
        sponsors={sponsors}
        nfts={nftNames}
      />
    </>
  );
});

export const WinFeature = memo(function WinFeature({
  awardBalanceUsd,
  totalSponsorBalanceUsd,
  nfts,
  depositToken,
  sponsors,
  nftPrizeOnly,
}) {
  // No NFTs -> Tokens Only
  if (!nfts || nfts.length === 0) {
    return (
      <WinFeatureTokens
        totalSponsorBalanceUsd={totalSponsorBalanceUsd}
        awardBalanceUsd={awardBalanceUsd}
        sponsors={sponsors}
        depositToken={depositToken}
      />
    );
  }

  // No Tokens -> NFTs only
  if (nftPrizeOnly) {
    return <WinFeatureNFTs nfts={nfts} depositToken={depositToken} />;
  }

  // Both
  return (
    <WinFeatureBoth
      nfts={nfts}
      awardBalanceUsd={awardBalanceUsd}
      sponsors={sponsors}
      totalSponsorBalanceUsd={totalSponsorBalanceUsd}
      depositToken={depositToken}
    />
  );
});

const WinTokens = memo(function WinTokens({ depositToken, awardBalanceUsd, sponsors, nfts = [] }) {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const awardsDepositToken = depositToken && awardBalanceUsd.gte(0.01);
  const allTokens = useMemo(() => {
    const sponsorTokens = sponsors
      .filter(sponsor => sponsor.sponsorBalanceUsd.gte(0.01))
      .map(sponsor => sponsor.sponsorToken);
    const sponsorTokensWithoutDepositToken = sponsorTokens.filter(token => token !== depositToken);
    const tokens = awardsDepositToken
      ? [depositToken, ...sponsorTokensWithoutDepositToken, ...nfts]
      : [...sponsorTokens, ...nfts];
    return tokens.map(symbol => translateToken(symbol, i18n, t));
  }, [awardsDepositToken, depositToken, sponsors, t, i18n, nfts]);

  return allTokens.length ? (
    <div className={classes.winTotalTokens}>
      <Translate i18nKey="pot.winTotalTokensIn" />
      <TransListJoin list={allTokens} />
    </div>
  ) : null;
});

const Interest = memo(function ({ baseApy, bonusApy, prizeOnly }) {
  const classes = useStyles();
  const hasBaseApy = typeof baseApy === 'number' && baseApy > 0;
  const hasBonusApy = typeof bonusApy === 'number' && bonusApy > 0;
  const totalApy = (hasBaseApy ? baseApy : 0) + (hasBonusApy ? bonusApy : 0);

  return (
    <>
      {prizeOnly ? (
        <div className={classes.interestValueApy}>
          <Translate i18nKey="pot.prizeOnly" />
        </div>
      ) : (
        <div className={classes.interestValueApy}>
          <Translate i18nKey="pot.statInterestApy" values={{ apy: totalApy.toFixed(2) }} />
        </div>
      )}
    </>
  );
});

const TVL = memo(function ({ totalStakedUsd }) {
  if (typeof totalStakedUsd !== 'undefined') {
    return (
      '$' +
      totalStakedUsd.toNumber().toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })
    );
  }

  return '$0';
});

function useDepositOdds(ticketTotalSupply, winners, ticketToken, tokenDecimals, network) {
  const address = useSelector(selectWalletAddress);
  const depositedTickets = useTokenBalance(ticketToken, tokenDecimals, network);

  return useMemo(() => {
    const totalTickets = byDecimals(ticketTotalSupply, tokenDecimals);

    if (depositedTickets.isZero() || totalTickets.isZero() || !address) {
      return null;
    }

    return investmentOdds(totalTickets, winners, depositedTickets);
  }, [ticketTotalSupply, depositedTickets, winners, tokenDecimals, address]);
}

const DepositWithOdds = memo(function ({
  depositToken,
  contractAddress,
  ticketTotalSupply,
  winners,
  ticketToken,
  tokenDecimals,
  network,
}) {
  const classes = useStyles();
  const deposit = useDeposit(contractAddress, tokenDecimals, network);
  const odds = useDepositOdds(ticketTotalSupply, winners, ticketToken, tokenDecimals, network);

  return (
    <div>
      <div>
        {deposit} {depositToken}
      </div>
      {odds ? (
        <div className={classes.depositOdds}>
          <Translate i18nKey="pot.oddsOdds" values={{ odds }} />
        </div>
      ) : null}
    </div>
  );
});

const DepositWithoutOdds = memo(function ({
  depositToken,
  contractAddress,
  tokenDecimals,
  network,
}) {
  const deposit = useDeposit(contractAddress, tokenDecimals, network);

  return (
    <div>
      <div>
        {deposit} {depositToken}
      </div>
    </div>
  );
});

export const PotNetwork = memo(function PotNetwork({ network }) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.network, variantClass(classes, 'network', network))}>
      <img
        src={require(`../../images/networks/${network}.svg`).default}
        width="24"
        height="24"
        alt={network}
      />
    </div>
  );
});

export function Pot({ id, variant, bottom, simple, oneColumn }) {
  const classes = useStyles();
  const pot = usePot(id);
  const history = useHistory();

  return (
    <Card variant={variant} style={{ height: 'fit-content' }} oneColumn={oneColumn}>
      <PotNetwork network={pot.network} />
      <Grid container spacing={2} className={classes.rowLogoWinTotal}>
        <Grid item xs="auto" onClick={() => history.push(`/pot/${pot.id}`)}>
          <Logo icon={pot.icon || pot.id} />
        </Grid>
        <Grid item xs="auto" className={classes.columnTitleWinTotal}>
          <Title name={pot.name} onClick={() => history.push(`/pot/${pot.id}`)} />
          {pot.rewardToken ? (
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
          ) : null}
        </Grid>
      </Grid>
      {pot.rewardToken ? (
        <Grid container spacing={2} className={classes.rowDrawStats}>
          <Grid item xs={simple ? 6 : 7}>
            <DrawStatNextDraw duration={pot.duration}>
              <Countdown until={pot.expiresAt * 1000}>
                <Translate i18nKey="pot.statNextDrawCountdownFinished" />
              </Countdown>
            </DrawStatNextDraw>
          </Grid>
          {!simple ? (
            <>
              <Grid item xs={5}>
                <DrawStat i18nKey="pot.statTVL">
                  <TVL totalStakedUsd={pot.totalStakedUsd} />
                </DrawStat>
              </Grid>
              <Grid item xs={6}>
                <DrawStat i18nKey="pot.statDeposit">
                  <DepositWithOdds
                    contractAddress={pot.contractAddress}
                    depositToken={pot.token}
                    tokenDecimals={pot.tokenDecimals}
                    ticketToken={pot.rewardToken}
                    ticketTotalSupply={pot.totalTickets}
                    winners={pot.numberOfWinners}
                    network={pot.network}
                  />
                </DrawStat>
              </Grid>
            </>
          ) : null}
          <Grid item xs={6}>
            <DrawStat
              i18nKey="pot.statInterest"
              tooltip={pot.isPrizeOnly ? null : <InterestTooltip pot={pot} />}
            >
              <Interest baseApy={pot.apy} bonusApy={pot.bonusApy} prizeOnly={pot.isPrizeOnly} />
            </DrawStat>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2} className={classes.rowDrawStats}>
          <Grid item xs={12}>
            <DrawStat i18nKey="pot.statDeposit">
              <DepositWithoutOdds
                contractAddress={pot.contractAddress}
                depositToken={pot.token}
                tokenDecimals={pot.tokenDecimals}
                network={pot.network}
              />
            </DrawStat>
          </Grid>
        </Grid>
      )}
      {bottom ? bottom : null}
    </Card>
  );
}

export const PrizeSplit = function ({
  baseToken,
  awardBalance,
  awardBalanceUsd,
  sponsors,
  numberOfWinners,
  nfts,
  nftPrizeOnly,
}) {
  const classes = useStyles();

  const allPrizes = {
    [baseToken]: {
      tokens: nftPrizeOnly ? ZERO : awardBalance || ZERO,
      usd: nftPrizeOnly ? ZERO : awardBalanceUsd || ZERO,
      isNft: false,
    },
  };

  if (!nftPrizeOnly) {
    for (const sponsor of sponsors) {
      if (sponsor.sponsorToken in allPrizes) {
        allPrizes[sponsor.sponsorToken].tokens = allPrizes[sponsor.sponsorToken].tokens.plus(
          sponsor.sponsorBalance || ZERO
        );
        allPrizes[sponsor.sponsorToken].usd = allPrizes[sponsor.sponsorToken].usd.plus(
          sponsor.sponsorBalanceUsd || ZERO
        );
      } else {
        allPrizes[sponsor.sponsorToken] = {
          tokens: sponsor.sponsorBalance || ZERO,
          usd: sponsor.sponsorBalanceUsd || ZERO,
          isNft: false,
        };
      }
    }
  }

  if (nfts && nfts.length) {
    for (const nft of nfts) {
      allPrizes[nft.name] = {
        tokens: new BigNumber(numberOfWinners),
        usd: ZERO,
        isNft: true,
      };
    }
  }

  const prizesOverZero = Object.entries(allPrizes)
    .filter(([, total]) => total.isNft || total.usd.gte(0.01))
    .sort(([, totalA], [, totalB]) => totalB.usd.comparedTo(totalA.usd))
    .sort(([tokenA]) => (tokenA === baseToken ? -1 : 1));
  const totalPrizeEach = prizesOverZero
    .reduce((overallTotal, [, prizeTotal]) => overallTotal.plus(prizeTotal.usd), ZERO)
    .dividedBy(numberOfWinners);
  const allNfts = prizesOverZero.every(([, total]) => total.isNft);

  return (
    <div className={classes.prizeSplit}>
      {allNfts ? (
        <>
          <div className={classes.prizeSplitText}>
            <Translate i18nKey="pot.prizeSplitWinners" values={{ count: numberOfWinners }} />
          </div>
          <ProjectedPrizeTooltip prizes={prizesOverZero} numberOfWinners={numberOfWinners} />
        </>
      ) : (
        <>
          <div className={classes.prizeSplitText}>
            <Translate
              i18nKey="pot.prizeSplitWinnersOfAmount"
              values={{ count: numberOfWinners, amount: formatDecimals(totalPrizeEach, 2, 2) }}
            />
          </div>
          <ProjectedPrizeTooltip prizes={prizesOverZero} numberOfWinners={numberOfWinners} />
        </>
      )}
    </div>
  );
};
