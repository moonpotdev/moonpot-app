import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Grid, makeStyles } from '@material-ui/core';
import styles from './styles';
import { Card, CardAccordionGroup, CardAccordionItem } from '../../../../components/Cards/Cards';
import { BigNumber } from 'bignumber.js';
import { Trans } from 'react-i18next';
import { TransListJoin } from '../../../../components/TransListJoin';
import Countdown from '../../../../components/Countdown';
import { formatTvl } from '../../../../helpers/format';
import { PrimaryButton } from '../../../../components/Buttons/PrimaryButton';
import { investmentOdds } from '../../../../helpers/utils';

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

const PotLogo = memo(function({ name, baseToken, sponsorToken }) {
  const src = require('../../../../images/vault/' + baseToken.toLowerCase() + '/sponsored/' + sponsorToken.toLowerCase() + '.svg').default;
  return <img src={src} alt={`${name} Pot`} width="90" height="90" />;
});

const PotWinTotal = memo(function({ baseToken, awardBalanceUsd, totalSponsorBalanceUsd, sponsors }) {
  const classes = useStyles();
  const totalPrize = useTotalPrize(awardBalanceUsd, totalSponsorBalanceUsd);
  const sponsorTokens = sponsors.map(sponsor => sponsor.sponsorToken).filter(token => token !== baseToken);
  const allTokens = [baseToken, ...sponsorTokens];

  return <div className={classes.winTotal}>
    <div className={classes.winTotalPrize}>
      <span className={classes.winTotalPrizeAmount}>
        <Trans i18nKey="pot.winTotalPrizeAmount" values={{ prize: `$${totalPrize}` }} />
      </span>
      <span className={classes.winTokenPrizeTokens}> <TransListJoin list={allTokens} /></span>
    </div>
    <div className={classes.winTotalNote}>
      <Trans i18nKey="pot.winTotalNote" />
    </div>
  </div>;
});

const PotDrawStat = memo(function({ labelKey, children }) {
  const classes = useStyles();

  return <>
    <div className={classes.statLabel}><Trans i18nKey={labelKey} /></div>
    <div className={classes.statValue}>{children}</div>
  </>;
});

const PotInterest = memo(function({ apy, bonusApy }) {
  if (typeof apy !== 'undefined' || typeof bonusApy !== 'undefined') {
    if (apy > 0 && bonusApy > 0) {
      return <Trans i18nKey="pot.statInterestApyBonus"
                    values={{ old: apy.toFixed(2), new: (apy + bonusApy).toFixed(2) }} />;
    }

    if (apy > 0 || bonusApy > 0) {
      const displayApy = Number(apy > 0 ? apy : bonusApy);
      return <Trans i18nKey="pot.statInterestApy" values={{ apy: displayApy.toFixed(2) }} />;
    }
  }

  return null;
});

const PotTVL = memo(function({ totalStakedUsd }) {
  if (typeof totalStakedUsd !== 'undefined') {
    return formatTvl(totalStakedUsd);
  }

  return null;
});

const PotPrizeSplit = function({ baseToken, awardBalance, sponsors, numberOfWinners }) {
  const allTokens = { [baseToken]: awardBalance };
  for (const sponsor of sponsors) {
    if (sponsor.sponsorToken in allTokens) {
      allTokens[sponsor.sponsorToken] = allTokens[sponsor.sponsorToken].plus(sponsor.sponsorBalance);
    } else {
      allTokens[sponsor.sponsorToken] = sponsor.sponsorBalance;
    }
  }

  const prizeList = Object.entries(allTokens).map(([token, amount]) => {
    return ((amount.div(numberOfWinners).toNumber().toLocaleString(undefined, { maximumFractionDigits: 2 }))) + ' ' + token;
  });

  return <TransListJoin list={prizeList} />;
};

const PotPlay = memo(function({ id, token, rewardToken }) {
  const address = useSelector(state => state.walletReducer.address);
  const balance = useSelector(state => state.balanceReducer.tokens[rewardToken]?.balance);
  const hasStaked = address && balance;

  return <PrimaryButton to={`/pot/${id}`} variant="teal" fullWidth={true}>
    <Trans i18nKey={hasStaked ? 'pot.playWithMore' : 'pot.playWith'} values={{ token }} />
  </PrimaryButton>;
});

const PotOdds = memo(function({tvlUsd, depositAmount, winners}){
  const odds = useMemo(() => {
    return investmentOdds(tvlUsd, new BigNumber(depositAmount), winners);
  }, [tvlUsd, depositAmount, winners]);

  return <Trans i18nKey="pot.oddsPerDeposit" values={{odds: odds, deposit: '$' + depositAmount}} />
});

const PotBottomSingle = function({pot}) {
  return 'TODO';
};

const PotBottomList = function({ pot }) {
  const classes = useStyles();

  return <>
    <CardAccordionGroup>
      <CardAccordionItem titleKey="pot.prizeSplit" startOpen={true}>
        <Grid container>
          <Grid item xs={3}>
            <Trans i18nKey="pot.prizeSplitWinner" values={{ count: pot.numberOfWinners }} />
          </Grid>
          <Grid item xs={9} className={classes.prizeSplitValue}>
            <PotPrizeSplit baseToken={pot.token} awardBalance={pot.awardBalance} sponsors={pot.sponsors}
                           numberOfWinners={pot.numberOfWinners} />
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
  </>;
};

export function Pot({ id, single = false }) {
  const classes = useStyles();
  const pot = useSelector(state => state.vaultReducer.pools[id]);
  const cardVariant = single ? 'tealDark' : 'tealLight';
  const PotBottom = single ? PotBottomSingle : PotBottomList;

  return <Card variant={cardVariant}>
    <Grid container spacing={2} className={classes.rowLogoWinTotal}>
      <Grid item xs={4}>
        <PotLogo name={pot.name} baseToken={pot.token} sponsorToken={pot.sponsorToken} />
      </Grid>
      <Grid item xs={8}>
        <PotWinTotal baseToken={pot.token} awardBalanceUsd={pot.awardBalanceUsd}
                     totalSponsorBalanceUsd={pot.totalSponsorBalanceUsd}
                     sponsors={pot.sponsors} />
      </Grid>
    </Grid>
    <Grid container spacing={2} className={classes.rowDrawStats}>
      <Grid item xs={5}>
        <PotDrawStat labelKey="pot.statNextDraw">
          <Countdown until={pot.expiresAt * 1000}>
            <Trans i18nKey="pot.statNextDrawCountdownFinished" />
          </Countdown>
        </PotDrawStat>
      </Grid>
      <Grid item xs={7}>
        <PotDrawStat labelKey="pot.statInterest">
          <PotInterest apy={pot.apy} bonusApy={pot.bonusApy} />
        </PotDrawStat>
      </Grid>
      <Grid item xs={5}>
        <PotDrawStat labelKey="pot.statTVL">
          <PotTVL totalStakedUsd={pot.totalStakedUsd} />
        </PotDrawStat>
      </Grid>
    </Grid>
    <PotBottom pot={pot}/>
  </Card>;
}