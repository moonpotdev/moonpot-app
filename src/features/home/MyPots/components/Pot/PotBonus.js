import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import reduxActions from '../../../../redux/actions';
import { formatDecimals } from '../../../../../helpers/format';
import Steps from '../../../../vault/components/Steps/Steps';
import { isEmpty } from '../../../../../helpers/utils';
import { Translate } from '../../../../../components/Translate';
import { useBonusEarned, useBoostEarned } from '../../../../../helpers/hooks';
import { SecondaryButton } from '../../../../../components/Buttons/SecondaryButton';
import { PrimaryButton } from '../../../../../components/Buttons/PrimaryButton';
import clsx from 'clsx';

const useStyles = makeStyles(styles);

function useBonusTokens(bonusToken, bonusEarned, boostToken, boostEarned) {
  return useMemo(() => {
    const tokens = [];

    if (bonusToken && bonusEarned.gt(0)) {
      tokens.push(bonusToken);
    }

    if (boostToken && boostEarned.gt(0)) {
      tokens.push(boostToken);
    }

    return tokens.join(' & ');
  }, [bonusToken, bonusEarned, boostToken, boostEarned]);
}

function itemSupportsCompound(item) {
  return (
    item.supportsCompound &&
    'bonusRewardId' in item &&
    item.bonusRewardId === 0 &&
    item.bonusAddress === item.tokenAddress
  );
}

const PotBonus = function ({ item, buttonVariant = 'purple' }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const wallet = useSelector(state => state.walletReducer);
  const balance = useSelector(state => state.balanceReducer);
  const prices = useSelector(state => state.pricesReducer);
  const [steps, setSteps] = useState({
    modal: false,
    currentStep: -1,
    items: [],
    finished: false,
  });
  const [stepsItem, setStepsItem] = useState(null);
  const bonusEarned = useBonusEarned(item);
  const boostEarned = useBoostEarned(item);
  const hasBonus = 'bonusRewardId' in item;
  const hasBoost = 'boostRewardId' in item;
  const hasEarned = bonusEarned.gt(0) || boostEarned.gt(0);
  const bonusTokens = useBonusTokens(item.bonusToken, bonusEarned, item.boostToken, boostEarned);
  const canCompound = bonusEarned.gt(0);

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
        action: () => dispatch(reduxActions.wallet.getReward(item.network, item.contractAddress)),
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
          action: () =>
            dispatch(
              reduxActions.wallet.approval(item.network, item.tokenAddress, item.contractAddress)
            ),
          pending: false,
        });
      }

      steps.push({
        step: 'compound',
        message: 'Confirm compound transaction on wallet to complete.',
        action: () => dispatch(reduxActions.wallet.compound(item.network, item.contractAddress)),
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
      {hasBonus ? (
        <>
          {bonusEarned > 0 ? (
            <>
              <Grid item xs={6}>
                <Typography className={classes.myDetailsText} align={'left'}>
                  {t(item.id === 'pots' ? 'bonus.myEarnings' : 'bonus.myBonusEarnings')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className={classes.myDetailsValue} align={'right'}>
                  {bonusEarned ? (
                    <>
                      {formatDecimals(bonusEarned)} {item.bonusToken} ($
                      {formatDecimals(bonusEarned.multipliedBy(prices.prices[item.bonusToken]), 2)})
                    </>
                  ) : (
                    <>0 {item.bonusToken} ($0.00)</>
                  )}
                </Typography>
              </Grid>
            </>
          ) : (
            ''
          )}
        </>
      ) : null}
      {hasBoost ? (
        <>
          {boostEarned > 0 ? (
            <>
              <Grid item xs={6}>
                <Typography className={classes.myDetailsText} align={'left'}>
                  <Translate i18nKey="bonus.myBoostEarnings" />
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className={classes.myDetailsValue} align={'right'}>
                  {boostEarned ? (
                    <>
                      {formatDecimals(boostEarned)} {item.boostToken} ($
                      {formatDecimals(boostEarned.multipliedBy(prices.prices[item.boostToken]), 2)})
                    </>
                  ) : (
                    <>0 {item.boostToken} ($0.00)</>
                  )}
                </Typography>
              </Grid>
            </>
          ) : (
            ''
          )}
        </>
      ) : null}
      <Grid item xs={12} className={classes.bonusExplainerRow}>
        <Typography className={classes.explainerText}>
          {item.id === 'pots'
            ? t('bonus.potsExplainer', { tokens: bonusTokens })
            : t('bonus.bonusExplainer', { tokens: bonusTokens })}
        </Typography>
      </Grid>
      {itemSupportsCompound(item) ? (
        <>
          {bonusEarned > 0 ? (
            <Grid item xs={12} className={classes.bonusCompoundRow}>
              <PrimaryButton
                onClick={() => handleCompoundBonus(item)}
                variant={buttonVariant}
                fullWidth={true}
                disabled={!canCompound}
              >
                {item.compoundIsBonus
                  ? t('bonus.compoundBonusToken', { token: item.token })
                  : t('bonus.compoundToken', { token: item.token })}
              </PrimaryButton>
              <Typography className={clsx(classes.explainerText, classes.compoundExplainerText)}>
                {t('bonus.compoundExplainer', { token: item.token })}
              </Typography>
            </Grid>
          ) : (
            ''
          )}
        </>
      ) : null}
      <Grid item xs={12}>
        <SecondaryButton
          onClick={() => handleWithdrawBonus(item)}
          variant={buttonVariant}
          fullWidth={true}
          disabled={!hasEarned}
        >
          {item.compoundIsBonus
            ? t('bonus.withdrawBonusTokens', { tokens: bonusTokens })
            : t('bonus.withdrawEarnedTokens', { tokens: bonusTokens })}
        </SecondaryButton>
      </Grid>
    </Grid>
  );
};

export default PotBonus;
