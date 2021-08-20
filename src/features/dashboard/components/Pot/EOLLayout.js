import * as React from 'react';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import AnimateHeight from 'react-animate-height';
import { Button, Divider, Grid, Link, makeStyles, Typography } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import styles from '../../styles';
import { Trans, useTranslation } from 'react-i18next';
import reduxActions from '../../../redux/actions';
import Withdraw from '../../../vault/components/Withdraw';
import { isEmpty } from '../../../../helpers/utils';
import { formatDecimals } from '../../../../helpers/format';
import clsx from 'clsx';

const useStyles = makeStyles(styles);

const EOLLayout = function ({ item }) {
  const { t } = useTranslation();
  const location = useLocation();
  const { vault, wallet, balance, prices, earned } = useSelector(state => ({
    vault: state.vaultReducer,
    wallet: state.walletReducer,
    balance: state.balanceReducer,
    prices: state.pricesReducer,
    earned: state.earnedReducer,
  }));
  const dispatch = useDispatch();
  const classes = useStyles();
  const [bonusOpen, setBonusOpen] = React.useState(location.bonusOpen);
  const [withdrawOpen, setWithdrawOpen] = React.useState(location.withdrawOpen);
  const [prizeSplitOpen, setPrizeSplitOpen] = React.useState(location.prizeSplitOpen);
  const [formData, setFormData] = React.useState({
    deposit: { amount: '', max: false },
    withdraw: { amount: '', max: false },
  });
  const [steps, setSteps] = React.useState({
    modal: false,
    currentStep: -1,
    items: [],
    finished: false,
  });
  const [stepsItem, setStepsItem] = React.useState(null);

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

  const updateItemData = () => {
    if (wallet.address) {
      dispatch(reduxActions.vault.fetchPools());
      dispatch(reduxActions.balance.fetchBalances());
      dispatch(reduxActions.earned.fetchEarned());
    }
  };

  const resetFormData = () => {
    setFormData({ deposit: { amount: '', max: false }, withdraw: { amount: '', max: false } });
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
    <React.Fragment>
      <Grid item xs={8}>
        <Typography className={classes.potUsdTop} align={'right'}>
          Retired {item.token}
        </Typography>
        <Typography className={classes.potUsd} align={'right'}>
          Moonpot
        </Typography>
        <Typography className={classes.myPotsNextWeeklyDrawText} align={'right'}>
          {t('prize')}: <span>Closed</span>
        </Typography>
      </Grid>
      <Grid item xs={12} align={'left'}>
        <Typography className={classes.dividerText}>{t('myDetails')} </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={6}>
            <Typography className={classes.myDetailsText} align={'left'}>
              <Trans i18nKey="myToken" values={{ token: item.token }} />
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.myDetailsValue} align={'right'}>
              {formatDecimals(item.userBalance)} {item.token} ($
              {formatDecimals(item.userBalance.multipliedBy(prices.prices[item.oracleId]), 2)})
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.myDetailsText} align={'left'}>
              {t('myInterestRate')}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.myDetailsValue} align={'right'}>
              0% APY
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              className={classes.myDetailsText}
              align={'left'}
              style={{ marginBottom: '20px' }}
            >
              <Trans i18nKey="myBonusEarnings" />
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.myDetailsValue} align={'right'}>
              {formatDecimals(item.earned)} {item.bonusToken} ($
              {formatDecimals(item.earned.multipliedBy(prices.prices[item.bonusToken]), 2)})
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      {item.migrationContractAddress ? (
        <React.Fragment>
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
          <Grid item xs={12}>
            <Divider className={classes.divider} />
          </Grid>

          <Grid item xs={9} align={'left'}>
            <Typography
              className={classes.dividerText}
              onClick={() => {
                setWithdrawOpen(!withdrawOpen);
              }}
            >
              <Trans
                i18nKey="withdrawTokenAndBonusToken"
                values={{ token: item.token, bonusToken: item.bonusToken }}
              />
            </Typography>
          </Grid>
          <Grid item xs={3} align={'right'} style={{ paddingRight: 0 }}>
            <Link
              onClick={() => {
                setWithdrawOpen(!withdrawOpen);
              }}
              className={classes.expandToggle}
            >
              {withdrawOpen ? <ExpandLess /> : <ExpandMore />}
            </Link>
          </Grid>
          <Grid item xs={12}>
            <AnimateHeight
              duration={500}
              height={withdrawOpen ? 'auto' : 0}
              style={{ marginBottom: '12px' }}
            >
              <Withdraw
                item={item}
                handleWalletConnect={null}
                formData={formData}
                setFormData={setFormData}
                updateItemData={updateItemData}
                resetFormData={resetFormData}
                retiredFlag={true}
              />
            </AnimateHeight>
          </Grid>
        </React.Fragment>
      ) : (
        // ----------------
        // Standard eol pot
        // ----------------
        <React.Fragment>
          <Grid item xs={12}>
            <Divider className={classes.divider} />
          </Grid>
          <Grid item xs={9} align={'left'} style={{ paddingBottom: 0 }}>
            <Typography
              className={classes.dividerText}
              style={{ marginBottom: '16px' }}
              onClick={() => {
                setBonusOpen(!bonusOpen);
              }}
            >
              <Trans i18nKey="bonusEarnings" />
            </Typography>
          </Grid>
          <Grid item xs={3} align={'right'} style={{ paddingBottom: 0 }}>
            <Link
              onClick={() => {
                setBonusOpen(!bonusOpen);
              }}
              className={classes.expandToggle}
            >
              {bonusOpen ? <ExpandLess /> : <ExpandMore />}
            </Link>
          </Grid>
          <Grid item xs={12}>
            <AnimateHeight duration={500} height={bonusOpen ? 'auto' : 0}>
              <Grid container>
                <Grid item xs={6}>
                  <Typography className={classes.myDetailsText} align={'left'}>
                    <Trans i18nKey="myBonusEarnings" />
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography className={classes.myDetailsValue} align={'right'}>
                    {formatDecimals(item.earned)} {item.bonusToken} ($
                    {formatDecimals(item.earned.multipliedBy(prices.prices[item.bonusToken]), 2)})
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography className={classes.myDetailsText} align={'left'}>
                    <Trans i18nKey="myBoostEarnings" />
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography className={classes.myDetailsValue} align={'right'}>
                    {formatDecimals(item.boosted)} {item.boostToken} ($
                    {formatDecimals(item.boosted.multipliedBy(prices.prices[item.boostToken]), 2)})
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    style={{ marginTop: '4px' }}
                    className={classes.actionBtn}
                    onClick={() => handleWithdrawBonus(item)}
                    variant={'contained'}
                    disabled={item.earned.lte(0)}
                  >
                    Claim Bonus {item.bonusToken} {item.boostToken ? 'and ' + item.boostToken : ''}
                  </Button>
                </Grid>
              </Grid>
            </AnimateHeight>
          </Grid>
        </React.Fragment>
      )}

      <Grid item xs={12}>
        <Divider className={classes.divider} />
      </Grid>
      <Grid item xs={9} align={'left'} style={{ height: '20px' }}>
        <Typography
          className={classes.dividerText}
          style={{ marginBottom: 0 }}
          onClick={() => {
            setPrizeSplitOpen(!prizeSplitOpen);
          }}
        >
          {t('prizeWinners')}{' '}
        </Typography>
      </Grid>
      <Grid item xs={3} align={'right'} style={{ height: '20px' }}>
        <Link
          onClick={() => {
            setPrizeSplitOpen(!prizeSplitOpen);
          }}
          className={classes.expandToggle}
          style={{ marginBottom: '0' }}
        >
          {prizeSplitOpen ? <ExpandLess /> : <ExpandMore />}
        </Link>
      </Grid>
      <Grid item xs={12} style={{ padding: 0 }}>
        <AnimateHeight duration={500} height={prizeSplitOpen ? 'auto' : 0}>
          <Grid container>
            <Grid item xs={6} align={'left'}>
              <Typography className={classes.potsItemText} style={{ marginBottom: 0 }}>
                <Trans i18nKey="winners" />
              </Typography>
            </Grid>
            <Grid item xs={6} align={'right'}>
              <Typography className={classes.potsPrizeWinnersTransaction}>
                <Link href={`https://bscscan.com/tx/${item.winnersTransaction}`}>
                  <Trans i18nKey="winningTransactions" />
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </AnimateHeight>
      </Grid>
    </React.Fragment>
  );
};

export default EOLLayout;
