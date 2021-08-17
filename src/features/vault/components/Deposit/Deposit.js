import { Button, Grid, InputBase, makeStyles, Paper } from '@material-ui/core';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import reduxActions from '../../../redux/actions';
import Steps from '../Steps';
import styles from '../../styles';
import BigNumber from 'bignumber.js';
import {
  byDecimals,
  convertAmountToRawNumber,
  stripExtraDecimals,
} from '../../../../helpers/format';
import { isEmpty } from '../../../../helpers/utils';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(styles);

// Only used on "My Pots" currently; see PotDeposit
const Deposit = ({
  formData,
  setFormData,
  item,
  handleWalletConnect,
  updateItemData,
  resetFormData,
  depositMore = false,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { wallet, balance } = useSelector(state => ({
    wallet: state.walletReducer,
    balance: state.balanceReducer,
  }));

  const [state, setState] = React.useState({ balance: 0, allowance: 0 });
  const [steps, setSteps] = React.useState({
    modal: false,
    currentStep: -1,
    items: [],
    finished: false,
  });

  const handleInput = val => {
    const value =
      parseFloat(val) > state.balance
        ? state.balance
        : parseFloat(val) < 0
        ? 0
        : stripExtraDecimals(val);
    setFormData({
      ...formData,
      deposit: { amount: value, max: new BigNumber(value).minus(state.balance).toNumber() === 0 },
    });
  };

  const handleMax = () => {
    if (state.balance > 0) {
      setFormData({ ...formData, deposit: { amount: state.balance, max: true } });
    }
  };

  const handleDeposit = () => {
    const steps = [];
    if (wallet.address && formData.deposit.amount > 0) {
      if (!state.allowance) {
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
        step: 'deposit',
        message: 'Confirm deposit transaction on wallet to complete.',
        action: () =>
          dispatch(
            reduxActions.wallet.deposit(
              item.network,
              item.contractAddress,
              convertAmountToRawNumber(formData.deposit.amount, item.tokenDecimals),
              formData.deposit.max
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
    let amount = 0;
    let approved = 0;
    if (wallet.address && !isEmpty(balance.tokens[item.token])) {
      amount = byDecimals(
        new BigNumber(balance.tokens[item.token].balance),
        item.tokenDecimals
      ).toFixed(8);
      approved = balance.tokens[item.token].allowance[item.contractAddress];
    }
    setState({ balance: amount, allowance: approved });
  }, [wallet.address, item, balance]);

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
      <Paper component="form" className={classes.input}>
        <Grid container spacing={1}>
          <Grid item xs={8}>
            <div style={{ display: 'flex' }}>
              <img
                alt="TokenIcon"
                className={classes.tokenIcon}
                src={
                  require('../../../../images/tokens/' + item.token.toLowerCase() + '.svg').default
                }
              />
              <InputBase
                style={{ margin: '12px 0 0 0 ', height: '24px' }}
                placeholder={t('enterCoinAmount', { coin: item.token })}
                value={formData.deposit.amount}
                onChange={e => handleInput(e.target.value)}
              />
            </div>
          </Grid>
          <Grid item xs={4} align={'right'}>
            <Button className={classes.potsMaxButton} onClick={handleMax}>
              Max
            </Button>
          </Grid>
        </Grid>
      </Paper>
      {wallet.address ? (
        <Button
          onClick={handleDeposit}
          className={classes.enabledActionBtn}
          variant={'contained'}
          disabled={false}
        >
          Deposit{' '}
          {formData.deposit.max && formData.deposit.amount > 0
            ? 'All'
            : formData.deposit.amount > 0
            ? formData.deposit.amount + ' ' + item.token
            : depositMore
            ? 'More ' + item.token
            : ''}
        </Button>
      ) : (
        <Button
          onClick={handleWalletConnect}
          className={classes.connectWalletBtn}
          variant={'contained'}
        >
          {t('wallet.connect')}
        </Button>
      )}
      <Steps item={item} steps={steps} handleClose={handleClose} />
    </React.Fragment>
  );
};

export default Deposit;
