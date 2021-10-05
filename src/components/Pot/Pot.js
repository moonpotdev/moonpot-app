import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Grid, makeStyles } from '@material-ui/core';
import { Card } from '../Cards';
import { BigNumber } from 'bignumber.js';
import { TransListJoin } from '../TransListJoin';
import Countdown from '../Countdown';
import { byDecimals, formatDecimals } from '../../helpers/format';
import { InterestTooltip } from '../Tooltip/tooltip';
import { translateToken, usePot, useTokenBalance, useTotalPrize } from '../../helpers/hooks';
import { DrawStat, DrawStatNextDraw } from '../DrawStat';
import { Translate } from '../Translate';
import { investmentOdds } from '../../helpers/utils';
import { useTranslation } from 'react-i18next';
import styles from './styles';

const useStyles = makeStyles(styles);

function slug(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-{2,}/g, '-');
}

export const Logo = memo(function ({ name, baseToken, sponsorToken }) {
  const src = require('../../images/vault/' +
    slug(baseToken) +
    '/sponsored/' +
    slug(sponsorToken) +
    '.svg').default;
  return <img src={src} alt="" width="90" height="90" aria-hidden={true} />;
});

const Title = memo(function ({ name }) {
  const classes = useStyles();
  return (
    <div className={classes.title}>
      <Translate i18nKey="pot.title" values={{ name }} />
    </div>
  );
});

export const WinTotal = memo(function ({ awardBalanceUsd, totalSponsorBalanceUsd }) {
  const classes = useStyles();
  const totalPrize = useTotalPrize(awardBalanceUsd, totalSponsorBalanceUsd);

  return (
    <div className={classes.winTotalPrize}>
      <Translate i18nKey="pot.winTotalPrize" values={{ prize: `$${totalPrize}` }} />
    </div>
  );
});

const WinTokens = memo(function ({ depositToken, sponsors }) {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const sponsorTokens = sponsors
    .filter(sponsor => sponsor.sponsorBalanceUsd.gte(0.01))
    .map(sponsor => sponsor.sponsorToken)
    .filter(token => token !== depositToken);
  const allTokens = [depositToken, ...sponsorTokens].map(symbol => translateToken(symbol, i18n, t));

  return (
    <div className={classes.winTotalTokens}>
      <Translate i18nKey="pot.winTotalTokensIn" />
      <TransListJoin list={allTokens} />
    </div>
  );
});

const Interest = memo(function ({ baseApy, bonusApy }) {
  const classes = useStyles();
  const hasBaseApy = typeof baseApy === 'number' && baseApy > 0;
  const hasBonusApy = typeof bonusApy === 'number' && bonusApy > 0;
  const totalApy = (hasBaseApy ? baseApy : 0) + (hasBonusApy ? bonusApy : 0);

  return (
    <>
      <div className={classes.interestValueApy}>
        <Translate i18nKey="pot.statInterestApy" values={{ apy: totalApy.toFixed(2) }} />
      </div>
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

function useDeposit(contractAddress, decimals) {
  const address = useSelector(state => state.walletReducer.address);
  const balance256 = useSelector(
    state => state.balanceReducer.tokens[contractAddress + ':total']?.balance
  );

  return useMemo(() => {
    if (address && balance256) {
      return formatDecimals(byDecimals(balance256, decimals), 2);
    }

    return 0;
  }, [address, balance256, decimals]);
}

function useDepositOdds(ticketTotalSupply, winners, ticketToken, tokenDecimals) {
  const address = useSelector(state => state.walletReducer.address);
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

export function Pot({ id, variant, bottom }) {
  const classes = useStyles();
  const pot = usePot(id);

  return (
    <Card variant={variant}>
      <Grid container spacing={2} className={classes.rowLogoWinTotal}>
        <Grid item xs={4}>
          <Logo name={pot.name} baseToken={pot.token} sponsorToken={pot.sponsorToken} />
        </Grid>
        <Grid item xs={8}>
          <Title name={pot.name} />
          <WinTotal
            awardBalanceUsd={pot.projectedAwardBalanceUsd || pot.awardBalanceUsd}
            totalSponsorBalanceUsd={
              pot.projectedTotalSponsorBalanceUsd || pot.totalSponsorBalanceUsd
            }
          />
          <WinTokens depositToken={pot.token} sponsors={pot.projectedSponsors || pot.sponsors} />
        </Grid>
      </Grid>
      <Grid container spacing={2} className={classes.rowDrawStats}>
        <Grid item xs={7}>
          <DrawStatNextDraw duration={pot.duration}>
            <Countdown until={pot.expiresAt * 1000}>
              <Translate i18nKey="pot.statNextDrawCountdownFinished" />
            </Countdown>
          </DrawStatNextDraw>
        </Grid>
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
        <Grid item xs={7}>
          <DrawStat i18nKey="pot.statInterest" tooltip={<InterestTooltip pot={pot} />}>
            <Interest baseApy={pot.apy} bonusApy={pot.bonusApy} />
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
}) {
  const classes = useStyles();

  const allPrizes = {
    [baseToken]: {
      tokens: awardBalance || new BigNumber(0),
      usd: awardBalanceUsd || new BigNumber(0),
    },
  };

  for (const sponsor of sponsors) {
    if (sponsor.sponsorToken in allPrizes) {
      allPrizes[sponsor.sponsorToken].tokens = allPrizes[sponsor.sponsorToken].tokens.plus(
        sponsor.sponsorBalance || new BigNumber(0)
      );
      allPrizes[sponsor.sponsorToken].usd = allPrizes[sponsor.sponsorToken].usd.plus(
        sponsor.sponsorBalanceUsd || new BigNumber(0)
      );
    } else {
      allPrizes[sponsor.sponsorToken] = {
        tokens: sponsor.sponsorBalance || new BigNumber(0),
        usd: sponsor.sponsorBalanceUsd || new BigNumber(0),
      };
    }
  }

  const prizesOverZero = Object.entries(allPrizes)
    .filter(([, total]) => total.usd.gte(0.01))
    .sort(([, totalA], [, totalB]) => totalB.usd.comparedTo(totalA.usd))
    .sort(([tokenA]) => (tokenA === baseToken ? -1 : 1));
  const totalPrizeEach = prizesOverZero
    .reduce((overallTotal, [, prizeTotal]) => overallTotal.plus(prizeTotal.usd), new BigNumber(0))
    .dividedBy(numberOfWinners);

  return (
    <>
      <div className={classes.prizeSplitTotal}>
        <Translate
          i18nKey="pot.amountEach"
          values={{ symbol: '$', amount: formatDecimals(totalPrizeEach, 2, 2) }}
        />
      </div>
      {prizesOverZero.map(([token, total]) => {
        const tokens = formatDecimals(total.tokens.dividedBy(numberOfWinners), 2);
        const usd = formatDecimals(total.usd.dividedBy(numberOfWinners), 2);

        return (
          <div key={token} className={classes.prizeSplitToken}>
            <span>
              {tokens} {token}
            </span>{' '}
            (${usd})
          </div>
        );
      })}
    </>
  );
};
