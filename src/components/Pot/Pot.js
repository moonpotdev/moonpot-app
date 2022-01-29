import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Grid, makeStyles } from '@material-ui/core';
import { Card } from '../Cards';
import Countdown from '../Countdown';
import { byDecimals, formatDecimals } from '../../helpers/format';
import { InterestTooltip } from '../Tooltip/tooltip';
import {
  translateToken,
  useDeposit,
  usePot,
  useTokenBalance,
  useTotalPrize,
} from '../../helpers/hooks';
import { DrawStat, DrawStatNextDraw } from '../DrawStat';
import { Translate } from '../Translate';
import { investmentOdds, listJoin, ZERO } from '../../helpers/utils';
import { useTranslation } from 'react-i18next';
import styles from './styles';
import { getPotIconSrc } from '../../helpers/getPotIconSrc';
import { useHistory } from 'react-router';
import { TransListJoin } from '../TransListJoin';
import BigNumber from 'bignumber.js';

const useStyles = makeStyles(styles);

function slug(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-{2,}/g, '-');
}

export const Logo = memo(function ({ icon, sponsorToken }) {
  const iconSlug = slug(icon);
  const sponsorSlug = sponsorToken ? slug(sponsorToken) : 'unsponsored';

  const possibilities = [`${iconSlug}/${sponsorSlug}`, `${iconSlug}/unsponsored`];

  for (const key of possibilities) {
    const src = getPotIconSrc(key, false);
    if (src) {
      return (
        <img
          src={src}
          alt=""
          width="90"
          height="90"
          aria-hidden={true}
          style={{ cursor: 'pointer' }}
        />
      );
    }
  }

  throw new Error(`No pot icon available for ${iconSlug}/${sponsorSlug} or any fallbacks.`);
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

function useDepositOdds(ticketTotalSupply, winners, ticketToken, tokenDecimals) {
  const address = useSelector(state => state.wallet.address);
  const depositedTickets = useTokenBalance(ticketToken, tokenDecimals);

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
}) {
  const classes = useStyles();
  const deposit = useDeposit(contractAddress, tokenDecimals);
  const odds = useDepositOdds(ticketTotalSupply, winners, ticketToken, tokenDecimals);

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

export function Pot({ id, variant, bottom, simple }) {
  const classes = useStyles();
  const pot = usePot(id);
  const history = useHistory();

  return (
    <Card variant={variant} style={{ height: 'fit-content' }}>
      <Grid container spacing={2} className={classes.rowLogoWinTotal}>
        <Grid item xs="auto" onClick={() => history.push(`/pot/${pot.id}`)}>
          <Logo icon={pot.icon || pot.id} sponsorToken={pot.sponsorToken} />
        </Grid>
        <Grid item xs="auto" className={classes.columnTitleWinTotal}>
          <Title name={pot.name} onClick={() => history.push(`/pot/${pot.id}`)} />
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
        </Grid>
      </Grid>
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
            <Grid item xs={5}>
              <DrawStat i18nKey="pot.statDeposit">
                <DepositWithOdds
                  contractAddress={pot.contractAddress}
                  depositToken={pot.token}
                  tokenDecimals={pot.tokenDecimals}
                  ticketToken={pot.rewardToken}
                  ticketTotalSupply={pot.totalTickets}
                  winners={pot.numberOfWinners}
                />
              </DrawStat>
            </Grid>
          </>
        ) : null}
        <Grid item xs={simple ? 6 : 7}>
          <DrawStat
            i18nKey="pot.statInterest"
            tooltip={pot.isPrizeOnly ? null : <InterestTooltip pot={pot} />}
          >
            <Interest baseApy={pot.apy} bonusApy={pot.bonusApy} prizeOnly={pot.isPrizeOnly} />
          </DrawStat>
        </Grid>
      </Grid>
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
    <>
      {allNfts ? null : (
        <div className={classes.prizeSplitTotal}>
          <Translate
            i18nKey={numberOfWinners === 1 ? 'pot.amount' : 'pot.amountEach'}
            values={{ symbol: '$', amount: formatDecimals(totalPrizeEach, 2, 2) }}
          />
        </div>
      )}
      {prizesOverZero.map(([token, total]) => {
        const tokens = formatDecimals(total.tokens.dividedBy(numberOfWinners), 2);
        const usd = total.isNft ? null : formatDecimals(total.usd.dividedBy(numberOfWinners), 2);

        return (
          <div key={token} className={classes.prizeSplitToken}>
            <span>
              {tokens} {token}
            </span>{' '}
            {total.isNft ? null : <>(${usd})</>}
          </div>
        );
      })}
    </>
  );
};
