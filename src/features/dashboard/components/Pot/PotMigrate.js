import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import styles from '../../styles';
import { Trans } from 'react-i18next';
import reduxActions from '../../../redux/actions';
import { isEmpty } from '../../../../helpers/utils';
import clsx from 'clsx';

const useStyles = makeStyles(styles);

export const PotMigrate = function ({ item, wallet, balance }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [steps, setSteps] = React.useState({
    modal: false,
    currentStep: -1,
    items: [],
    finished: false,
  });
  const [stepsItem, setStepsItem] = React.useState(null);

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
          dispatch(
            reduxActions.wallet.withdraw(
              item.network,
              item.contractAddress,
              balance.tokens[item.rewardToken].balance,
              true
            )
          ),
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
              balance.tokens[item.rewardToken].balance,
              false
            )
          ),
        pending: false,
      });

      setStepsItem(item);
      setSteps({ modal: true, currentStep: 0, items: steps, finished: false });
    }
  };

  return (
    <Grid item xs={12}>
      <Grid container>
        <Grid item xs={12}>
          <Typography className={classes.myPotsUpgradeText} align={'left'}>
            <Trans i18nKey="upgradeWhy" values={{ token: item.token }} />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.myPotsUpgradeText} align={'left'}>
            <Trans
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
            <Trans i18nKey="learnMore" />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            onClick={() => handleMigrator(item)}
            className={clsx(classes.actionBtn, classes.eolMoveBtn)}
            variant={'contained'}
            disabled={item.userBalance.lte(0)}
          >
            Move {item.token} and Withdraw {item.bonusToken}
          </Button>
        </Grid>
        <Grid item xs={6} align={'left'}>
          <Typography className={classes.potsItemText} style={{ marginTop: '12px' }}>
            <Trans i18nKey="myFairplayTimelock" />
          </Typography>
        </Grid>
        <Grid item xs={6} align={'right'}>
          <Typography className={classes.potsItemValue}>00d 00h 00m</Typography>
        </Grid>
        <Grid item xs={6} align={'left'}>
          <Typography className={classes.potsItemText}>
            <Trans i18nKey="myCurrentFairnessFee" />
          </Typography>
        </Grid>
        <Grid item xs={6} align={'right'}>
          <Typography className={classes.potsItemValue}>0 {item.token}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
