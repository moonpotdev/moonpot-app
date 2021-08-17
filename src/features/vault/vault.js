import React, { memo, useCallback, useEffect } from 'react';
import { Redirect, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Container, makeStyles, Typography } from '@material-ui/core';
import styles from './styles';
import { Trans } from 'react-i18next';
import reduxActions from '../redux/actions';
import { formatDecimals } from '../../helpers/format';
import { usePot, useTotalPrize } from '../../helpers/hooks';
import { Pot } from './components/Pot/Pot';
import { InfoCards } from './components/InfoCards';
import { PoweredByBeefy } from '../../components/PoweredByBeefy';
import clsx from 'clsx';

const useStyles = makeStyles(styles);

const VaultTitle = memo(function ({
  className,
  token,
  baseApy,
  bonusApy,
  awardBalanceUsd,
  totalSponsorBalanceUsd,
}) {
  const hasBaseApy = typeof baseApy === 'number' && baseApy > 0;
  const hasBonusApy = typeof bonusApy === 'number' && bonusApy > 0;
  const totalApy = (hasBaseApy ? baseApy : 0) + (hasBonusApy ? bonusApy : 0);
  const totalPrize = useTotalPrize(awardBalanceUsd, totalSponsorBalanceUsd);

  return (
    <Typography className={clsx(className)}>
      <Trans
        i18nKey="vaultTitle"
        values={{
          token,
          apy: formatDecimals(totalApy, 2),
          currency: '$',
          amount: formatDecimals(totalPrize, 0),
        }}
      />
    </Typography>
  );
});

function isInvalidPot(pot) {
  return !pot || pot.status !== 'active';
}

const Vault = () => {
  const { id } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const address = useSelector(state => state.walletReducer.address);
  const pricesLastUpdated = useSelector(state => state.pricesReducer.lastUpdated);
  const fairplayRef = React.useRef(null);
  const pot = usePot(id);

  const handleFairplayLearnMore = useCallback(() => {
    if (fairplayRef.current) {
      window.scrollTo(0, fairplayRef.current.offsetTop);
    }
  }, [fairplayRef]);

  useEffect(() => {
    if (pot && pricesLastUpdated > 0) {
      dispatch(reduxActions.vault.fetchPools(pot));
    }
  }, [dispatch, pot, pricesLastUpdated]);

  useEffect(() => {
    if (pot && address) {
      dispatch(reduxActions.balance.fetchBalances(pot));
      dispatch(reduxActions.earned.fetchEarned(pot));
    }
  }, [dispatch, pot, address]);

  if (isInvalidPot(pot)) {
    return <Redirect to="/" />;
  }

  return (
    <div className="App">
      <Container maxWidth="lg">
        <VaultTitle
          className={classes.mainTitle}
          token={pot.token}
          bonusApy={pot.bonusApy}
          baseApy={pot.apy}
          totalSponsorBalanceUsd={pot.totalSponsorBalanceUsd}
          awardBalanceUsd={pot.awardBalanceUsd}
        />
        <PoweredByBeefy className={classes.poweredBy} />
        <Pot id={id} onFairplayLearnMore={handleFairplayLearnMore} />
        <InfoCards id={id} fairplayRef={fairplayRef} className={classes.infoCards} />
      </Container>
    </div>
  );
};

export default Vault;
