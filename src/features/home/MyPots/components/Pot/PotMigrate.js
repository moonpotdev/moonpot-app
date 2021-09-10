import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import styles from './styles';
import reduxActions from '../../../../redux/actions';
import { isEmpty } from '../../../../../helpers/utils';
import Steps from '../../../../vault/components/Steps/Steps';
import { Translate } from '../../../../../components/Translate';
import { PrimaryButton } from '../../../../../components/Buttons/PrimaryButton';

const useStyles = makeStyles(styles);

export const PotMigrate = function ({ item }) {
  const wallet = useSelector(state => state.walletReducer);
  const balance = useSelector(state => state.balanceReducer);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [steps, setSteps] = useState({
    modal: false,
    currentStep: -1,
    items: [],
    finished: false,
  });
  const [stepsItem, setStepsItem] = useState(null);

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

  const handleMigrator = item => {
    if (wallet.address) {
      const steps = [];
      const rewardApproved = balance.tokens[item.rewardToken].allowance[item.contractAddress];
      if (!rewardApproved) {
        steps.push({
          step: 'approve',
          message: 'Approval transaction happens once per pot.',
          action: () =>
            dispatch(
              reduxActions.wallet.approval(item.network, item.rewardAddress, item.contractAddress)
            ),
          pending: false,
        });
      }

      steps.push({
        step: 'withdraw',
        message: 'Confirm withdraw transaction on wallet to complete.',
        action: () =>
          dispatch(reduxActions.wallet.withdraw(item.network, item.contractAddress, 0, true)),
        pending: false,
      });

      const tokenApproved = balance.tokens[item.token].allowance[item.migrationContractAddress];
      if (!tokenApproved) {
        steps.push({
          step: 'approve',
          message: 'Approval transaction happens once per pot.',
          action: () =>
            dispatch(
              reduxActions.wallet.approval(
                item.network,
                item.tokenAddress,
                item.migrationContractAddress
              )
            ),
          pending: false,
        });
      }

      steps.push({
        step: 'deposit',
        message: 'Confirm deposit transaction on wallet to complete.',
        action: () =>
          dispatch(
            reduxActions.wallet.deposit(
              item.network,
              item.migrationContractAddress,
              balance.tokens[item.contractAddress].balance,
              false
            )
          ),
        pending: false,
      });

      setStepsItem(item);
      setSteps({ modal: true, currentStep: 0, items: steps, finished: false });
    }
  };

  React.useEffect(() => {
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
    <Grid item xs={12}>
      <Steps item={stepsItem} steps={steps} handleClose={handleClose} />
      <Grid container>
        <Grid item xs={12}>
          <Typography className={classes.myPotsUpgradeText} align={'left'}>
            <Translate i18nKey="upgradeWhy" values={{ token: item.token }} />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.myPotsUpgradeText} align={'left'}>
            <Translate
              i18nKey="upgradeNextSteps"
              values={{
                token: item.token,
                amount: '50,000',
                boostToken: 'BNB',
              }}
            />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.learnMoreText} align={'left'}>
            {item.migrationLearnMoreUrl ? (
              <a
                href={item.migrationLearnMoreUrl}
                className={classes.link}
                target="_blank"
                rel="noreferrer"
              >
                <Translate i18nKey="migrationNoticeLearnMore" />
              </a>
            ) : null}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <PrimaryButton
            onClick={() => handleMigrator(item)}
            className={classes.eolMoveBtn}
            variant="purple"
            fullWidth={true}
            disabled={item.userBalance.lte(0)}
          >
            <Translate
              i18nKey="upgradeMoveWithdraw"
              values={{ base: item.token, bonus: item.bonusToken }}
            />
          </PrimaryButton>
        </Grid>
        <Grid item xs={6} align={'left'}>
          <Typography className={classes.potsItemText} style={{ marginTop: '12px' }}>
            <Translate i18nKey="pot.myFairplayTimelock" />
          </Typography>
        </Grid>
        <Grid item xs={6} align={'right'}>
          <Typography className={classes.potsItemValue}>00d 00h 00m</Typography>
        </Grid>
        <Grid item xs={6} align={'left'}>
          <Typography className={classes.potsItemText}>
            <Translate i18nKey="pot.myFairnessFee" />
          </Typography>
        </Grid>
        <Grid item xs={6} align={'right'}>
          <Typography className={classes.potsItemValue}>0 {item.token}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
