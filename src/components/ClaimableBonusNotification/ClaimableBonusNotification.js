import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { potsByNetworkSupportingClaimAllBonuses } from '../../config/vault';
import { byDecimals, formatDecimals } from '../../helpers/format';
import { sortObjectsDesc } from '../../helpers/utils';
import { Card } from '../Cards';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import Pots from '../../images/tokens/pots.svg';
import reduxActions from '../../features/redux/actions';
import Steps, { StepsProgress } from '../../features/vault/components/Steps';

const useStyles = makeStyles(styles);

function useClaimableBonuses() {
  const address = useSelector(state => state.walletReducer.address);
  const network = useSelector(state => state.walletReducer.network);
  const earnedByPotBonus = useSelector(state => state.earnedReducer.earned, shallowEqual);

  const unclaimedBonuses = useMemo(() => {
    if (network && address) {
      const unclaimed = {};
      for (const pot of potsByNetworkSupportingClaimAllBonuses[network]) {
        for (const bonus of pot.bonuses) {
          const earned = byDecimals(earnedByPotBonus[pot.id][bonus.id] || 0, bonus.decimals);
          if (earned.gt(0)) {
            if (bonus.symbol in unclaimed) {
              unclaimed[bonus.symbol].earned = unclaimed[bonus.symbol].earned.plus(earned);
            } else {
              unclaimed[bonus.symbol] = {
                symbol: bonus.symbol,
                decimals: bonus.decimals,
                earned,
              };
            }
          }
        }
      }
      return unclaimed;
    }

    return null;
  }, [earnedByPotBonus, network, address]);

  return useMemo(() => {
    if (unclaimedBonuses) {
      if ('POTS' in unclaimedBonuses && unclaimedBonuses.POTS.earned.gte(0.00000001)) {
        const { POTS, ...rest } = unclaimedBonuses;
        const others = sortObjectsDesc(Object.values(rest));

        return { pots: POTS, others };
      }
    }

    return null;
  }, [unclaimedBonuses]);
}

export const ClaimableBonusNotification = memo(function ClaimableBonusNotification({
  className,
  ...rest
}) {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const network = useSelector(state => state.walletReducer.network);
  const { pots, others } = useClaimableBonuses() || {};
  const haveOthers = pots && others && others.length > 0;
  const stepsItem = useMemo(
    () => ({
      network,
    }),
    [network]
  );
  const [steps, setSteps] = useState({ modal: false, currentStep: -1, items: [], finished: false });

  const handleClaim = useCallback(() => {
    setSteps({
      modal: true,
      currentStep: 0,
      items: [
        {
          step: 'claimAll',
          message: 'Confirm claim all transaction on wallet to complete.',
          action: () => dispatch(reduxActions.wallet.claimAllBonuses(haveOthers)),
          pending: false,
        },
      ],
      finished: false,
    });
  }, [dispatch, haveOthers, setSteps]);

  const handleClose = useCallback(() => {
    setSteps({ modal: false, currentStep: -1, items: [], finished: false });
    dispatch(reduxActions.earned.fetchEarned());
  }, [setSteps, dispatch]);

  useEffect(() => {
    const id = setInterval(() => {
      dispatch(reduxActions.earned.fetchEarned());
    }, 15000);

    return () => clearInterval(id);
  }, [dispatch]);

  if (pots) {
    return (
      <Card variant="purpleDark" className={clsx(classes.claimable, className)} {...rest}>
        <div className={classes.total}>
          <img src={Pots} width={24} height={24} aria-hidden={true} alt="" />
          <div className={classes.totalText}>{formatDecimals(pots.earned, 8, 8)} POTS</div>
        </div>
        <div className={classes.description}>
          {t('claimableBonuses.explainer', {
            returnObjects: true,
          }).map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>
        <div className={classes.buttons}>
          <PrimaryButton variant="purple" fullWidth={true} onClick={handleClaim}>
            {t('claimableBonuses.claimAll')}
          </PrimaryButton>
        </div>
        <Steps item={stepsItem} steps={steps} handleClose={handleClose} />
        <StepsProgress steps={steps} setSteps={setSteps} />
      </Card>
    );
  }

  return null;
});
