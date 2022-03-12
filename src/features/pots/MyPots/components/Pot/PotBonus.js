import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import reduxActions from '../../../../redux/actions';
import { formatDecimals } from '../../../../../helpers/format';
import Steps from '../../../../vault/components/Steps/Steps';
import { compound, isEmpty } from '../../../../../helpers/utils';
import { useBonusesEarned } from '../../../../../helpers/hooks';
import { SecondaryButton } from '../../../../../components/Buttons/SecondaryButton';
import { PrimaryButton } from '../../../../../components/Buttons/PrimaryButton';
import clsx from 'clsx';
import { WalletRequired } from '../../../../../components/WalletRequired/WalletRequired';
import { approval, getReward } from '../../../../wallet/actions';

const useStyles = makeStyles(styles);

const bonusStatLabels = {
  bonus: 'bonus.myBonusEarnings',
  superBoost: 'bonus.myBoostEarnings',
  earned: 'bonus.myEarnings',
};

const PotBonus = function ({ pot, buttonVariant = 'purple' }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const wallet = useSelector(state => state.wallet);
  const balance = useSelector(state => state.balance);
  const [steps, setSteps] = useState({
    modal: false,
    currentStep: -1,
    items: [],
    finished: false,
  });
  const [stepsItem, setStepsItem] = useState(null);

  const bonuses = useBonusesEarned(pot.id);
  const canWithdrawBonus = useMemo(
    () => bonuses.find(bonus => bonus.earned > 0) !== undefined,
    [bonuses]
  );
  const compoundableBonus = useMemo(
    () => bonuses.find(bonus => bonus.id === 0 && bonus.earned > 0),
    [bonuses]
  );
  const canCompound = compoundableBonus !== undefined;
  const earnedTokens = useMemo(
    () =>
      bonuses
        .filter(bonus => bonus.earned > 0)
        .map(bonus => bonus.symbol)
        .join(' & '),
    [bonuses]
  );
  const activeTokens = useMemo(
    () =>
      bonuses
        .filter(bonus => bonus.active)
        .map(bonus => bonus.symbol)
        .join(' & '),
    [bonuses]
  );

  const handleClose = () => {
    updateItemData();

    setStepsItem(null);
    setSteps({ modal: false, currentStep: -1, items: [], finished: false });
  };

  const updateItemData = () => {
    if (wallet.address) {
      dispatch(reduxActions.vault.fetchPools());
      dispatch(reduxActions.balance.fetchBalances());
      dispatch(reduxActions.earned.fetchEarned());
    }
  };

  const handleWithdrawBonus = item => {
    if (wallet.address) {
      const steps = [];
      steps.push({
        step: 'reward',
        message: 'Confirm withdraw transaction on wallet to complete.',
        action: () => dispatch(getReward(item.network, item.contractAddress)),
        pending: false,
      });

      setStepsItem(item);
      setSteps({ modal: true, currentStep: 0, items: steps, finished: false });
    }
  };

  const handleCompoundBonus = item => {
    if (wallet.address) {
      const steps = [];

      const tokenApproved = balance.tokens[item.token]?.allowance[item.contractAddress];
      if (!tokenApproved) {
        steps.push({
          step: 'approve',
          message: 'Approval transaction happens once per pot.',
          action: () => dispatch(approval(item.network, item.tokenAddress, item.contractAddress)),
          pending: false,
        });
      }

      steps.push({
        step: 'compound',
        message: 'Confirm compound transaction on wallet to complete.',
        action: () => dispatch(compound(item.network, item.contractAddress)),
        pending: false,
      });

      setStepsItem(item);
      setSteps({ modal: true, currentStep: 0, items: steps, finished: false });
    }
  };

  useEffect(() => {
    const index = steps.currentStep;
    if (!isEmpty(steps.items[index]) && steps.modal) {
      const items = steps.items;
      if (!items[index].pending) {
        items[index].pending = true;
        items[index].action();
        setSteps({ ...steps, items: items });
      } else {
        if (wallet.action.result === 'success' && !steps.finished) {
          const nextStep = index + 1;
          if (!isEmpty(items[nextStep])) {
            setSteps({ ...steps, currentStep: nextStep });
          } else {
            setSteps({ ...steps, finished: true });
          }
        }
      }
    }
  }, [steps, wallet.action]);

  return (
    <Grid container>
      <Steps item={stepsItem} steps={steps} handleClose={handleClose} />
      {bonuses.length
        ? bonuses
            .filter(bonus => bonus.active || bonus.earned > 0)
            .map(bonus => (
              <Grid
                item
                key={`${pot.id}-${bonus.id}`}
                xs={12}
                container
                className={clsx(classes.bonusRow, {
                  [classes.bonusRowInactive]: !bonus.active,
                })}
              >
                <Grid item xs={6}>
                  <Typography className={classes.myDetailsText} align={'left'}>
                    {t(bonusStatLabels[bonus.display])}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography className={classes.myDetailsValue} align={'right'}>
                    {formatDecimals(bonus.earned)} {bonus.symbol} ($
                    {formatDecimals(bonus.value, 2)})
                  </Typography>
                </Grid>
              </Grid>
            ))
        : null}
      <Grid item xs={12} className={classes.bonusExplainerRow}>
        <Typography className={classes.explainerText}>
          {pot.id === 'pots'
            ? t('bonus.potsExplainer', { tokens: activeTokens })
            : t('bonus.bonusExplainer', { tokens: activeTokens })}
        </Typography>
      </Grid>
      <WalletRequired network={pot.network} networkRequired={true}>
        {canCompound ? (
          <Grid item xs={12} className={classes.bonusCompoundRow}>
            <PrimaryButton
              onClick={() => handleCompoundBonus(pot)}
              variant={buttonVariant}
              fullWidth={true}
              disabled={!canCompound}
            >
              {t('bonus.compoundBonusToken', { token: pot.token })}
            </PrimaryButton>
            <Typography className={clsx(classes.explainerText, classes.compoundExplainerText)}>
              {t('bonus.compoundExplainer', { token: pot.token })}
            </Typography>
          </Grid>
        ) : null}
        <Grid item xs={12}>
          <SecondaryButton
            onClick={() => handleWithdrawBonus(pot)}
            variant={buttonVariant}
            fullWidth={true}
            disabled={!canWithdrawBonus}
          >
            {t('bonus.withdrawBonusTokens', { tokens: earnedTokens })}
          </SecondaryButton>
        </Grid>
      </WalletRequired>
    </Grid>
  );
};

export default PotBonus;
