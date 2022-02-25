import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { Redirect, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Container, makeStyles, Typography } from '@material-ui/core';
import styles from './styles';
import reduxActions from '../redux/actions';
import { formatDecimals } from '../../helpers/format';
import { usePot, useTotalPrize } from '../../helpers/hooks';
import { Pot } from './components/Pot/Pot';
import { InfoCards } from './components/InfoCards';
import { PoweredByBeefy } from '../../components/PoweredByBeefy';
import clsx from 'clsx';
import { Translate } from '../../components/Translate';
import SidePotExplainer from '../../components/SidePotExplainer/SidePotExplainer';
import { listJoin } from '../../helpers/utils';

const useStyles = makeStyles(styles);

const VaultTitle = memo(function ({
  className,
  token,
  baseApy,
  bonusApy,
  awardBalanceUsd,
  totalSponsorBalanceUsd,
  nfts,
  isPrizeOnly,
  nftPrizeOnly,
}) {
  const hasNftPrize = nfts && nfts.length > 0;
  const hasTokenPrize = !nftPrizeOnly;
  const hasTokenInterest = !isPrizeOnly;

  const hasBaseApy = typeof baseApy === 'number' && baseApy > 0;
  const hasBonusApy = typeof bonusApy === 'number' && bonusApy > 0;
  const totalApy = (hasBaseApy ? baseApy : 0) + (hasBonusApy ? bonusApy : 0);
  const totalPrize = useTotalPrize(awardBalanceUsd, totalSponsorBalanceUsd);
  const prizes = useMemo(() => {
    const out = [];

    if (hasTokenPrize) {
      out.push('$' + formatDecimals(totalPrize, 0));
    }

    if (hasNftPrize) {
      nfts.forEach(nft => out.push(nft.name));
    }

    if (out.length) {
      return listJoin(out);
    }

    return '???';
  }, [hasTokenPrize, totalPrize, hasNftPrize, nfts]);

  const titleKey = hasTokenInterest ? 'vaultTitle' : 'vaultTitlePrizeOnly';

  return (
    <Typography className={clsx(className)}>
      <Translate
        i18nKey={titleKey}
        values={{
          token,
          apy: formatDecimals(totalApy, 2),
          prizes,
        }}
      />
    </Typography>
  );
});

function isInvalidPot(pot) {
  return !pot || pot.status !== 'active';
}

const VaultDataLoader = memo(function VaultDataLoader({ id }) {
  const dispatch = useDispatch();
  const address = useSelector(state => state.walletReducer.address);
  const pricesLastUpdated = useSelector(state => state.pricesReducer.lastUpdated);

  useEffect(() => {
    if (id && pricesLastUpdated > 0) {
      dispatch(reduxActions.vault.fetchPools());
    }
  }, [dispatch, id, pricesLastUpdated]);

  useEffect(() => {
    if (id && address) {
      dispatch(reduxActions.balance.fetchBalances(id));
      dispatch(reduxActions.earned.fetchEarned(id));
    }
  }, [dispatch, id, address]);

  return null;
});

const Vault = () => {
  const { id } = useParams();
  const classes = useStyles();
  const fairplayRef = React.useRef(null);
  const pot = usePot(id);

  const handleFairplayLearnMore = useCallback(() => {
    if (fairplayRef.current) {
      window.scrollTo(0, fairplayRef.current.offsetTop);
    }
  }, [fairplayRef]);

  if (isInvalidPot(pot)) {
    return <Redirect to="/" />;
  }

  function handleVariant(vaultType) {
    if (vaultType === 'main') {
      return 'tealDark';
    } else if (vaultType === 'community') {
      return 'blueCommunity';
    } else if (vaultType === 'lp') {
      return 'greenDark';
    } else if (vaultType === 'stable') {
      return 'greenStableAlt';
    } else if (vaultType === 'side') {
      return 'greySideAlt';
    } else if (vaultType === 'nft') {
      return 'purpleNftAlt';
    } else if (vaultType === 'xmas') {
      return 'purpleXmasAlt';
    }
  }

  return (
    <div className="App">
      <VaultDataLoader id={id} />
      <Container maxWidth="lg">
        <VaultTitle
          className={classes.mainTitle}
          token={pot.token}
          nftPrizeOnly={pot.nftPrizeOnly}
          isPrizeOnly={pot.isPrizeOnly}
          nfts={pot.nfts}
          bonusApy={pot.bonusApy}
          baseApy={pot.apy}
          totalSponsorBalanceUsd={pot.projectedTotalSponsorBalanceUsd || pot.totalSponsorBalanceUsd}
          awardBalanceUsd={pot.projectedAwardBalanceUsd || pot.awardBalanceUsd}
        />
        <PoweredByBeefy className={classes.poweredBy} />
        {pot.categories.includes('side') ? <SidePotExplainer /> : null}
        <Pot
          id={id}
          onFairplayLearnMore={handleFairplayLearnMore}
          variant={handleVariant(pot.vaultType)}
          oneColumn={true}
        />
        <InfoCards id={id} fairplayRef={fairplayRef} className={classes.infoCards} />
      </Container>
    </div>
  );
};

export default Vault;
