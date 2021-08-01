import { Grid, Box, Button, InputBase, makeStyles, Paper, Typography } from '@material-ui/core';
import { Trans, useTranslation } from 'react-i18next';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BigNumber from 'bignumber.js';
import {
  byDecimals,
  convertAmountToRawNumber,
  stripExtraDecimals,
} from '../../../../helpers/format';
import styles from '../../styles';
import reduxActions from '../../../redux/actions';
import { isEmpty } from '../../../../helpers/utils';
import Steps from '../Steps';
import PrizePoolAbi from '../../../../config/abi/prizepool.json';

const useStyles = makeStyles(styles);

const Withdraw = ({
  item,
  handleWalletConnect,
  formData,
  setFormData,
  updateItemData,
  resetFormData,
  retiredFlag = false,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { wallet, balance, earned, vault } = useSelector(state => ({
    wallet: state.walletReducer,
    balance: state.balanceReducer,
    earned: state.earnedReducer,
  }));
  const [state, setState] = React.useState({ balance: 0, allowance: 0 });
  const [steps, setSteps] = React.useState({
    modal: false,
    currentStep: -1,
    items: [],
    finished: false,
  });
  const [fairplayTimelock, setFairplayTimelock] = React.useState(0);
  const [fairnessFee, setFairnessFee] = React.useState(0);
  const handleInput = val => {
    const value =
      parseFloat(val) > state.balance
        ? state.balance
        : parseFloat(val) < 0
        ? 0
        : stripExtraDecimals(state.balance);
    setFormData({
      ...formData,
      withdraw: { amount: value, max: new BigNumber(value).minus(state.balance).toNumber() === 0 },
    });
  };

  const handleMax = () => {
    if (state.balance > 0) {
      setFormData({ ...formData, withdraw: { amount: state.balance, max: true } });
    }
  };

  const handleWithdraw = () => {
    const steps = [];
    if (wallet.address) {
      if (!state.allowance) {
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

      const amount = new BigNumber(formData.withdraw.amount)
        .dividedBy(byDecimals(item.pricePerShare, item.tokenDecimals))
        .toFixed(8);
      steps.push({
        step: 'withdraw',
        message: 'Confirm withdraw transaction on wallet to complete.',
        action: () =>
          dispatch(
            reduxActions.wallet.withdraw(
              item.network,
              item.contractAddress,
              convertAmountToRawNumber(amount, item.tokenDecimals),
              formData.withdraw.max
            )
          ),
        pending: false,
      });

      setSteps({ modal: true, currentStep: 0, items: steps, finished: false });
    }
  };

  const handleClose = () => {
    updateItemData();
    resetFormData();
    setSteps({ modal: false, currentStep: -1, items: [], finished: false });
  };

  React.useEffect(() => {
    const getData = async () => {
      if (wallet.address) {
        const prizePoolContract = new wallet.rpc[item.network].eth.Contract(
          PrizePoolAbi,
          item.prizePoolAddress
        );
        const userFairPlayLockRemaining = await prizePoolContract.methods
          .userFairPlayLockRemaining(wallet.address, item.rewardAddress)
          .call();
        setFairplayTimelock(Number(userFairPlayLockRemaining) * 1000);
      } else {
        setFairplayTimelock(0);
      }
    };

    getData();
  });

  const formatTimelock = time => {
    const day = Math.floor(time / (1000 * 60 * 60 * 24))
      .toString()
      .padStart(2, '0');
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24)
      .toString()
      .padStart(2, '0');
    const minutes = Math.floor((time / (1000 * 60)) % 60)
      .toString()
      .padStart(2, '0');

    return `${day}day ${hours}h ${minutes}min`;
  };

  React.useEffect(() => {
    const max = 3600 * 24 * 10 * 1000;
    let relativeFee = 0;
    let userBalance = 0;

    if (wallet.address && !isEmpty(balance.tokens[item.rewardToken])) {
      userBalance = byDecimals(
        new BigNumber(balance.tokens[item.rewardToken].balance),
        item.tokenDecimals
      ).toFixed(8);
    }

    if (fairplayTimelock !== 0) {
      relativeFee = (fairplayTimelock * 0.025) / max;
    }

    setFairnessFee(BigNumber(relativeFee).times(BigNumber(userBalance)).toFixed(10));
  });

  React.useEffect(() => {
    let amount = 0;
    let approved = 0;
    let earnedBonus = 0;
    let earnedBoosted = 0;
    if (wallet.address && !isEmpty(balance.tokens[item.rewardToken])) {
      amount = byDecimals(
        new BigNumber(balance.tokens[item.rewardToken].balance),
        item.tokenDecimals
      ).toFixed(8);
      approved = balance.tokens[item.rewardToken].allowance[item.contractAddress];
    }
    if (wallet.address && !isEmpty(earned.earned[item.id])) {
      const earnedAmount = earned.earned[item.id][item.sponsorToken] ?? 0;
      earnedBonus = byDecimals(new BigNumber(earnedAmount), item.sponsorTokenDecimals).toFixed(8);
      const boostAmount = earned.earned[item.id][item.boostToken] ?? 0;
      earnedBoosted = byDecimals(new BigNumber(boostAmount), item.boostTokenDecimals).toFixed(8);
    }
    setState({ balance: amount, allowance: approved, earned: earnedBonus, boosted: earnedBoosted });
  }, [wallet.address, item, balance, earned]);

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
    <React.Fragment>
      <Grid container>
        {retiredFlag ? (
          <React.Fragment>
            <Grid item xs={12}>
              <Box className={classes.eolWithdrawWarningBox}>
                <Grid container>
                  <Grid item xs={1}>
                    <Box className={classes.warningIcon}>
                      <img
                        alt={`Warning`}
                        srcSet={`
                                    images/state/warning@4x.png 4x,
                                    images/state/warning@3x.png 3x,
                                    images/state/warning@2x.png 2x,
                                    images/state/warning@1x.png 1x
                                    `}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={10}>
                    <Trans
                      className={classes.eolWithdrawWarning}
                      i18nKey="eolWithdrawWarning"
                      values={{ token: item.token }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button onClick={handleWithdraw} className={classes.eolWithdrawBtn}>
                Withdraw {item.token} and {item.sponsorToken}
              </Button>
              <Steps item={item} steps={steps} handleClose={handleClose} />
            </Grid>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Grid item xs={4} align={'left'}>
              <Typography className={classes.withdrawItemText}>
                <Trans i18nKey="myToken" values={{ token: item.token }} />
              </Typography>
            </Grid>
            <Grid item xs={8} align={'right'}>
              <Typography className={classes.withdrawItemValue}>
                {state.balance} {item.token}
              </Typography>
            </Grid>
            <Grid item xs={4} align={'left'}>
              <Typography className={classes.withdrawItemText}>
                <Trans i18nKey="mySponsorToken" values={{ sponsorToken: item.sponsorToken }} />
              </Typography>
            </Grid>
            <Grid item xs={8} align={'right'}>
              <Typography className={classes.withdrawItemValue}>
                {state.earned} {item.sponsorToken}
              </Typography>
            </Grid>
            <Grid item xs={4} align={'left'}>
              <Typography className={classes.withdrawItemText}>
                <Trans i18nKey="myBoostToken" values={{ boostToken: item.boostToken }} />
              </Typography>
            </Grid>
            <Grid item xs={8} align={'right'}>
              {/* BNB boost value needs populating state.boosted */}
              <Typography className={classes.withdrawItemValue}>
                {state.boosted} {item.boostToken}
              </Typography>
            </Grid>
            <Grid item xs={4} align={'left'}>
              <Typography className={classes.withdrawItemText}>
                <Trans i18nKey="myFairplayTimelock" />
              </Typography>
            </Grid>
            <Grid item xs={8} align={'right'}>
              <Typography className={classes.withdrawItemValue}>
                {formatTimelock(fairplayTimelock)}
              </Typography>
            </Grid>
            <Grid item xs={4} align={'left'}>
              <Typography className={classes.withdrawItemText}>
                <Trans i18nKey="myCurrentFairnessFee" />
              </Typography>
            </Grid>
            <Grid item xs={8} align={'right'}>
              <Typography className={classes.withdrawItemValue}>
                {fairnessFee} {item.token}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Paper component="form" className={classes.input}>
                <Grid container spacing={1}>
                  <Grid item xs={2}>
                    <img
                      alt="TokenIcon"
                      className={classes.tokenIcon}
                      src={require('../../../../images/tokens/cakeMoonMiniIcon.svg').default}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <InputBase
                      disabled={true}
                      placeholder={state.balance.toString()}
                      value={state.balance}
                      onChange={e => handleInput(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={4} align={'right'}></Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              {wallet.address ? (
                <Button
                  onClick={handleWithdraw}
                  className={
                    formData.withdraw.amount < 0
                      ? classes.disabledActionBtn
                      : classes.enabledActionBtn
                  }
                  variant={'contained'}
                  disabled={state.balance <= 0}
                >
                  Withdraw{' '}
                  {state.balance > 0
                    ? 'All'
                    : formData.withdraw.amount > 0
                    ? formData.withdraw.amount + ' ' + item.token
                    : ''}
                </Button>
              ) : (
                <Button
                  onClick={handleWalletConnect}
                  className={classes.connectWalletBtn}
                  variant={'contained'}
                >
                  {t('buttons.connectWallet')}
                </Button>
              )}
              <Steps item={item} steps={steps} handleClose={handleClose} />
            </Grid>
            <Grid item xs={12}>
              <a
                href="https://docs.moonpot.com/faq/moonpot-rules#can-i-withdraw-my-funds-at-any-time"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.docsLink}
              >
                <Typography className={classes.withdrawPenaltyWarning}>
                  <Trans i18nKey="vaultWithdrawPenaltyWarning" values={{ token: item.token }} />
                </Typography>
              </a>
            </Grid>
          </React.Fragment>
        )}
      </Grid>
    </React.Fragment>
  );
};

export default Withdraw;
