import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Grid, makeStyles } from '@material-ui/core';
import styles from './styles';
import { Card, CardAccordionGroup, CardAccordionItem } from '../../../../components/Cards/Cards';
import { BigNumber } from 'bignumber.js';
import { Trans } from 'react-i18next';
import { TransListJoin } from '../../../../components/TransListJoin';
import Countdown from '../../../../components/Countdown';
import { PrimaryButton } from '../../../../components/Buttons/PrimaryButton';
import { investmentOdds } from '../../../../helpers/utils';
import { byDecimals, formatDecimals } from '../../../../helpers/format';
import { TooltipWithIcon } from '../../../../components/Tooltip/tooltip';

const useStyles = makeStyles(styles);

function useTotalPrize(awardBalanceUsd, totalSponsorBalanceUsd) {
  return useMemo(() => {
    const a = new BigNumber(awardBalanceUsd ?? 0);
    const s = new BigNumber(totalSponsorBalanceUsd ?? 0);
    const total = a.plus(s);
    const dp = total.gt(1) ? 0 : 4;

    return total.toNumber().toLocaleString(undefined, {
      minimumFractionDigits: dp,
      maximumFractionDigits: dp,
    });
  }, [awardBalanceUsd, totalSponsorBalanceUsd]);
}

const PotLogo = memo(function ({ name, baseToken, sponsorToken }) {
  const src = require('../../../../images/vault/' +
    baseToken.toLowerCase() +
    '/sponsored/' +
    sponsorToken.toLowerCase() +
    '.svg').default;
  return <img src={src} alt={`${name} Pot`} width="90" height="90" />;
});

const PotTitle = memo(function ({ name }) {
  const classes = useStyles();
  return (
    <div className={classes.title}>
      <Trans i18nKey="pot.title" values={{ name }} />
    </div>
  );
});

const PotWinTotal = memo(function ({ awardBalanceUsd, totalSponsorBalanceUsd }) {
  const classes = useStyles();
  const totalPrize = useTotalPrize(awardBalanceUsd, totalSponsorBalanceUsd);

  return (
    <div className={classes.winTotalPrize}>
      <Trans i18nKey="pot.winTotalPrize" values={{ prize: `$${totalPrize}` }} />
    </div>
  );
});

const PotWinTokens = memo(function ({ depositToken, sponsors }) {
  const classes = useStyles();
  const sponsorTokens = sponsors
    .map(sponsor => sponsor.sponsorToken)
    .filter(token => token !== depositToken);
  const allTokens = [depositToken, ...sponsorTokens];

  return (
    <div className={classes.winTotalTokens}>
      <Trans i18nKey="pot.winTotalTokensIn" />
      <TransListJoin list={allTokens} />
    </div>
  );
});

const PotDrawStat = memo(function ({ baseApy, bonusApy, labelKey, children }) {
  const classes = useStyles();

  //Get tooltip label
  let tooltipi18nkey;
  if (labelKey == 'pot.statInterest') {
    const hasBaseApy = typeof baseApy === 'number' && baseApy > 0;
    const hasBonusApy = typeof bonusApy === 'number' && bonusApy > 0;
    if (hasBaseApy && hasBonusApy) {
      tooltipi18nkey = 'tooltip.intrestCrossedOut';
    } else {
      tooltipi18nkey = 'tooltip.intrest';
    }
  }

  return (
    <>
      <div className={classes.statLabel}>
        <Trans i18nKey={labelKey} />
        {labelKey == 'pot.statInterest' ? <TooltipWithIcon i18nkey={tooltipi18nkey} /> : ''}
      </div>
      <div className={classes.statValue}>{children}</div>
    </>
  );
});

const PotInterest = memo(function ({ baseApy, bonusApy, bonusApr }) {
  const classes = useStyles();
  const hasBaseApy = typeof baseApy === 'number' && baseApy > 0;
  const hasBonusApy = typeof bonusApy === 'number' && bonusApy > 0;
  const hasBonusApr = typeof bonusApr === 'number' && bonusApr > 0;
  const totalApy = (hasBaseApy ? baseApy : 0) + (hasBonusApy ? bonusApy : 0);

  return (
    <>
      <div className={classes.interestValueApy}>
        <Trans i18nKey="pot.statInterestApy" values={{ apy: totalApy.toFixed(2) }} />
      </div>
      {hasBaseApy && hasBonusApy ? (
        <div className={classes.interestValueBaseApy}>
          <Trans i18nKey="pot.statInterestApy" values={{ apy: baseApy.toFixed(2) }} />
        </div>
      ) : null}
      {hasBonusApr ? (
        <div className={classes.interestValueApr}>
          <Trans i18nKey="pot.statInterestApr" values={{ apr: bonusApr.toFixed(2) }} />
        </div>
      ) : null}
    </>
  );
});

const PotTVL = memo(function ({ totalStakedUsd }) {
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

const PotDeposit = memo(function ({ depositToken, rewardToken, decimals }) {
  const address = useSelector(state => state.walletReducer.address);
  const balance256 = useSelector(state => state.balanceReducer.tokens[rewardToken]?.balance);
  const balance = useMemo(() => {
    if (address && balance256) {
      return formatDecimals(byDecimals(balance256, decimals), 2);
    }

    return 0;
  }, [address, balance256, decimals]);

  return `${balance} ${depositToken}`;
});

const PotPrizeSplit = function ({
  baseToken,
  awardBalance,
  awardBalanceUsd,
  sponsors,
  numberOfWinners,
}) {
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
  return Object.entries(allPrizes).map(([token, total]) => {
    const tokens = formatDecimals(total.tokens.dividedBy(numberOfWinners), 2);
    const usd = formatDecimals(total.usd.dividedBy(numberOfWinners), 2);

    return (
      <div key={token}>
        <span>
          {tokens} {token}
        </span>{' '}
        (${usd})
      </div>
    );
  });
};

const PotPlay = memo(function ({ id, token, rewardToken }) {
  const address = useSelector(state => state.walletReducer.address);
  const balance = useSelector(state => state.balanceReducer.tokens[rewardToken]?.balance);
  const hasStaked = address && balance;

  return (
    <PrimaryButton to={`/pot/${id}`} variant="teal" fullWidth={true}>
      <Trans i18nKey={hasStaked ? 'pot.playWithMore' : 'pot.playWith'} values={{ token }} />
    </PrimaryButton>
  );
});

const PotOdds = memo(function ({ tvlUsd, depositAmount, winners }) {
  const odds = useMemo(() => {
    return investmentOdds(tvlUsd, new BigNumber(depositAmount), winners);
  }, [tvlUsd, depositAmount, winners]);

  return (
    <Trans i18nKey="pot.oddsPerDeposit" values={{ odds: odds, deposit: '$' + depositAmount }} />
  );
});

const PotBottomSingle = function ({ pot }) {
  return 'TODO';
};

const PotBottomList = function ({ pot }) {
  const classes = useStyles();

  return (
    <>
      <CardAccordionGroup>
        <CardAccordionItem titleKey="pot.prizeSplit" collapsable={false}>
          <Grid container>
            <Grid item xs={3}>
              <Trans i18nKey="pot.prizeSplitWinner" values={{ count: pot.numberOfWinners }} />
            </Grid>
            <Grid item xs={9} className={classes.prizeSplitValue}>
              <PotPrizeSplit
                baseToken={pot.token}
                awardBalance={pot.awardBalance}
                awardBalanceUsd={pot.awardBalanceUsd}
                sponsors={pot.sponsors}
                numberOfWinners={pot.numberOfWinners}
              />
            </Grid>
          </Grid>
        </CardAccordionItem>
      </CardAccordionGroup>
      <div className={classes.rowPlay}>
        <PotPlay id={pot.id} token={pot.token} rewardToken={pot.rewardToken} />
      </div>
      <div className={classes.rowOdds}>
        <PotOdds tvlUsd={pot.totalStakedUsd} depositAmount={1000} winners={pot.numberOfWinners} />
      </div>
    </>
  );
};

export function Pot({ id, single = false }) {
  const classes = useStyles();
  const pot = useSelector(state => state.vaultReducer.pools[id]);
  const cardVariant = single ? 'tealDark' : 'tealLight';
  const PotBottom = single ? PotBottomSingle : PotBottomList;

  return (
    <Card variant={cardVariant}>
      <Grid container spacing={2} className={classes.rowLogoWinTotal}>
        <Grid item xs={4}>
          <PotLogo name={pot.name} baseToken={pot.token} sponsorToken={pot.sponsorToken} />
        </Grid>
        <Grid item xs={8}>
          <PotTitle name={pot.name} />
          <PotWinTotal
            awardBalanceUsd={pot.awardBalanceUsd}
            totalSponsorBalanceUsd={pot.totalSponsorBalanceUsd}
          />
          <PotWinTokens depositToken={pot.token} sponsors={pot.sponsors} />
        </Grid>
      </Grid>
      <Grid container spacing={2} className={classes.rowDrawStats}>
        <Grid item xs={7}>
          <PotDrawStat labelKey="pot.statNextDraw">
            <Countdown until={pot.expiresAt * 1000}>
              <Trans i18nKey="pot.statNextDrawCountdownFinished" />
            </Countdown>
          </PotDrawStat>
        </Grid>
        <Grid item xs={5}>
          <PotDrawStat labelKey="pot.statTVL">
            <PotTVL totalStakedUsd={pot.totalStakedUsd} />
          </PotDrawStat>
        </Grid>
        <Grid item xs={5}>
          <PotDrawStat labelKey="pot.statDeposit">
            <PotDeposit
              depositToken={pot.token}
              rewardToken={pot.rewardToken}
              decimals={pot.tokenDecimals}
            />
          </PotDrawStat>
        </Grid>
        <Grid item xs={7}>
          <PotDrawStat baseApy={pot.apy} bonusApy={pot.bonusApy} labelKey="pot.statInterest">
            <PotInterest baseApy={pot.apy} bonusApy={pot.bonusApy} bonusApr={pot.bonusApr} />
          </PotDrawStat>
        </Grid>
      </Grid>
      <PotBottom pot={pot} />
    </Card>
  );
}
