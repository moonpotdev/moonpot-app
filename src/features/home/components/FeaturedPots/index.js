import React, { memo, useMemo } from 'react';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { createSelector } from 'reselect';
import { sortBy, take } from 'lodash';
import { Logo } from '../../../../components/Pot';
import { PrimaryButton } from '../../../../components/Buttons/PrimaryButton';
import { useSelector } from 'react-redux';
import { translateToken, useTotalPrize } from '../../../../helpers/hooks';
import { Translate } from '../../../../components/Translate';
import { listJoin } from '../../../../helpers/utils';
import styles from './styles';
import clsx from 'clsx';
import {
  SegmentedCountdown,
  StaticSegmentedCountdown,
} from '../../../../components/SegmentedCountdown';

const useStyles = makeStyles(styles);

// TODO move selectors to own file
const selectFeaturedPots = createSelector(
  state => state.vault.pools,
  pots => Object.values(pots).filter(pot => pot.featured)
);

const selectUpcomingFeaturedPots = createSelector(selectFeaturedPots, pots =>
  pots.filter(pot => pot.expiresAt * 1000 > Date.now())
);

const selectNextThreeUpcomingFeaturedPots = createSelector(selectUpcomingFeaturedPots, pots =>
  take(sortBy(pots, ['expiresAt']), 3)
);

const Card = memo(function Card({ className, children }) {
  const classes = useStyles();

  return <div className={clsx(classes.card, className)}>{children}</div>;
});

function useWinTokens(depositToken, awardBalanceUsd, sponsors, nfts = []) {
  const { t, i18n } = useTranslation();
  const awardsDepositToken = depositToken && awardBalanceUsd.gte(0.01);

  return useMemo(() => {
    const sponsorTokens = sponsors
      .filter(sponsor => sponsor.sponsorBalanceUsd.gte(0.01))
      .map(sponsor => sponsor.sponsorToken);
    const sponsorTokensWithoutDepositToken = sponsorTokens.filter(token => token !== depositToken);
    const tokens = awardsDepositToken
      ? [depositToken, ...sponsorTokensWithoutDepositToken, ...nfts]
      : [...sponsorTokens, ...nfts];
    return tokens.map(symbol => translateToken(symbol, i18n, t));
  }, [awardsDepositToken, depositToken, sponsors, t, i18n, nfts]);
}

function useWinTokensList(depositToken, awardBalanceUsd, sponsors, nfts = []) {
  const tokens = useWinTokens(depositToken, awardBalanceUsd, sponsors, nfts);
  return useMemo(() => {
    return listJoin(tokens);
  }, [tokens]);
}

const WinFeatureTokens = memo(function WinFeatureTokens({
  awardBalanceUsd,
  totalSponsorBalanceUsd,
  sponsors,
  depositToken,
}) {
  const totalPrize = useTotalPrize(awardBalanceUsd, totalSponsorBalanceUsd);
  const tokens = useWinTokensList(depositToken, awardBalanceUsd, sponsors);

  return (
    <Translate
      i18nKey="featuredPot.winPrizeInToken"
      values={{ prize: `$${totalPrize}`, token: tokens }}
    />
  );
});

const WinFeatureNFTs = memo(function WinFeatureNFTs({ nfts }) {
  const prizeList = useMemo(() => {
    const nftNames = nfts.map(nft => nft.name);
    return listJoin(nftNames);
  }, [nfts]);

  return <Translate i18nKey="featuredPot.winPrize" values={{ prize: prizeList }} />;
});

const WinFeatureBoth = memo(function WinFeatureBoth({
  awardBalanceUsd,
  totalSponsorBalanceUsd,
  sponsors,
  nfts,
  depositToken,
}) {
  const totalPrize = useTotalPrize(awardBalanceUsd, totalSponsorBalanceUsd);
  const tokens = useWinTokensList(depositToken, awardBalanceUsd, sponsors);
  const nftNames = useMemo(() => {
    return listJoin(nfts.map(nft => nft.name));
  }, [nfts]);

  return (
    <Translate
      i18nKey="featuredPot.winNFTandPrizeInToken"
      values={{ prize: `$${totalPrize}`, token: tokens, nft: nftNames }}
    />
  );
});

const WinFeature = memo(function WinFeature({
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
    return <WinFeatureNFTs nfts={nfts} />;
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

const PotCard = memo(function PotCard({ pot }) {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Card className={classes.pot}>
      <div className={classes.cardTop}>
        <div className={classes.cardText}>
          <div className={classes.cardWin}>
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
          </div>
          <div className={classes.cardCountdown}>
            <SegmentedCountdown when={pot.expiresAt * 1000} />
          </div>
        </div>
        <div className={classes.cardImage}>
          <Logo icon={pot.icon || pot.id} sponsorToken={pot.sponsorToken} />
        </div>
      </div>
      <div className={classes.cardBottom}>
        <PrimaryButton to={`/pot/${pot.id}`} variant={'teal'}>
          {t('pot.playWith', { token: pot.token })}
        </PrimaryButton>
      </div>
    </Card>
  );
});

const PlaceholderCard = memo(function PlaceholderCard() {
  const classes = useStyles();

  return (
    <Card className={classes.placeholder}>
      <div className={classes.cardTop}>
        <div className={classes.cardText}>
          <div className={classes.cardWin}>Win</div>
          <div className={classes.cardCountdown}>
            <StaticSegmentedCountdown days={0} hours={0} minutes={0} />
          </div>
        </div>
        <div className={classes.cardImage}>
          <Logo icon="pots" />
        </div>
      </div>
      <div className={classes.cardBottom}>
        <div className={classes.placeholderButton} />
      </div>
    </Card>
  );
});

export const FeaturedPots = memo(function FeaturedPots() {
  const classes = useStyles();
  const { t } = useTranslation();
  const upcomingPots = useSelector(selectNextThreeUpcomingFeaturedPots);
  const pots = useMemo(() => {
    return upcomingPots.length ? upcomingPots : [null, null, null];
  }, [upcomingPots]);

  return (
    <div className={classes.featuredPots}>
      <div className={classes.container}>
        <h2 className={classes.title}>{t('home.featuredPots.title')}</h2>
        <div className={classes.row}>
          {pots.map((pot, i) => (
            <div className={classes.column} key={pot?.id || i}>
              {pot ? <PotCard pot={pot} /> : <PlaceholderCard />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
