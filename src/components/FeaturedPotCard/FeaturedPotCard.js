import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SegmentedCountdown } from '../SegmentedCountdown';
import { Logo } from '../Pot';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import { makeStyles } from '@material-ui/core';
import { useTotalPrize } from '../../helpers/hooks';
import { Translate } from '../Translate';
import { listJoin } from '../../helpers/utils';
import { useWinTokensList } from './hooks';
import clsx from 'clsx';
import styles from './styles';

const useStyles = makeStyles(styles);

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

export const FeaturedPotCard = memo(function FeaturedPotCard({ pot }) {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={clsx(classes.card, classes.pot)}>
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
        <PrimaryButton to={`/pot/${pot.id}`} variant="purple" fullWidth={true}>
          {t('pot.playWith', { token: pot.token })}
        </PrimaryButton>
      </div>
    </div>
  );
});
