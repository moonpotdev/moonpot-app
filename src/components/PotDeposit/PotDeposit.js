import { Link, makeStyles } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles';
import BigNumber from 'bignumber.js';
import { bigNumberTruncate, convertAmountToRawNumber } from '../../helpers/format';
import reduxActions from '../../features/redux/actions';
import Steps from '../../features/vault/components/Steps';
import { isEmpty } from '../../helpers/utils';
import { TokenInput } from '../TokenInput';
import { PrimaryButton } from '../Buttons/PrimaryButton';

import { WalletConnectButton } from '../Buttons/WalletConnectButton';
import { usePot, useTokenAllowance, useTokenBalance } from '../../helpers/hooks';
import { Translate } from '../Translate';

const useStyles = makeStyles(styles);

// TODO DRY, move to one global steps component; use state/actions
const DepositSteps = function ({ pot, steps, setSteps, onClose, onFinish }) {
  const dispatch = useDispatch();
  const action = useSelector(state => state.walletReducer.action);

  const handleClose = useCallback(() => {
    dispatch(reduxActions.balance.fetchBalances(pot));
    dispatch(reduxActions.earned.fetchEarned(pot));
    setSteps({ modal: false, currentStep: -1, items: [], finished: false });

    if (onClose) {
      onClose();
    }
  }, [dispatch, pot, setSteps, onClose]);

  const handleFinish = useCallback(() => {
    dispatch(reduxActions.balance.fetchBalances(pot));
    dispatch(reduxActions.earned.fetchEarned(pot));

    if (onFinish) {
      onFinish();
    }
  }, [dispatch, pot, onFinish]);

  useEffect(() => {
    const index = steps.currentStep;
    if (!isEmpty(steps.items[index]) && steps.modal) {
      const items = steps.items;
      if (!items[index].pending) {
        items[index].pending = true;
        items[index].action();
        setSteps({ ...steps, items: items });
      } else {
        if (action.result === 'success' && !steps.finished) {
          const nextStep = index + 1;
          if (!isEmpty(items[nextStep])) {
            setSteps({ ...steps, currentStep: nextStep });
          } else {
            setSteps({ ...steps, finished: true });
            handleFinish();
          }
        }
      }
    }
  }, [steps, action, setSteps, handleFinish]);

  return <Steps item={pot} steps={steps} handleClose={handleClose} />;
};

export const PotDeposit = function ({ id, onLearnMore, variant = 'teal' }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const pot = usePot(id);
  const address = useSelector(state => state.walletReducer.address);
  const balance = useTokenBalance(pot.token, pot.tokenDecimals);
  const allowance = useTokenAllowance(pot.contractAddress, pot.token, pot.tokenDecimals);
  const [inputValue, setInputValue] = useState('');
  const [depositAmount, setDepositAmount] = useState(() => new BigNumber(0));
  const [isDepositAll, setIsDepositAll] = useState(false);
  const [canDeposit, setCanDeposit] = useState(false);
  const [steps, setSteps] = React.useState(() => ({
    modal: false,
    currentStep: -1,
    items: [],
    finished: false,
  }));

  const handleDeposit = () => {
    const steps = [];
    if (address && depositAmount.gt(0)) {
      if (allowance.lt(depositAmount)) {
        steps.push({
          step: 'approve',
          message: 'Approval transaction happens once per pot.',
          action: () =>
            dispatch(
              reduxActions.wallet.approval(pot.network, pot.tokenAddress, pot.contractAddress)
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
              pot.network,
              pot.contractAddress,
              convertAmountToRawNumber(depositAmount, pot.tokenDecimals),
              isDepositAll
            )
          ),
        pending: false,
      });

      setSteps({ modal: true, currentStep: 0, items: steps, finished: false });
    }
  };

  // clear input on steps modal close
  const handleStepsClose = useCallback(() => {
    setInputValue('');
  }, [setInputValue]);

  // input string to bignumber
  useEffect(() => {
    const value = bigNumberTruncate(inputValue, 8);
    setDepositAmount(value);
    setCanDeposit(address && balance.gt(0) && value.gt(0));
  }, [inputValue, address, balance]);

  return (
    <>
      <div className={classes.inputHolder}>
        <TokenInput
          variant={variant}
          token={pot.token}
          value={inputValue}
          max={balance}
          setValue={setInputValue}
          setIsMax={setIsDepositAll}
        />
      </div>
      <div className={classes.buttonHolder}>
        {address ? (
          <PrimaryButton
            variant={variant}
            onClick={handleDeposit}
            disabled={!canDeposit}
            fullWidth={true}
          >
            <Translate
              i18nKey={
                isDepositAll
                  ? 'deposit.allToken'
                  : depositAmount.gt(0)
                  ? 'deposit.amountToken'
                  : 'deposit.token'
              }
              values={{ token: pot.token, amount: depositAmount.toString() }}
            />
          </PrimaryButton>
        ) : (
          <WalletConnectButton variant="teal" fullWidth={true} />
        )}
        <DepositSteps
          pot={pot}
          steps={steps}
          setSteps={setSteps}
          onClose={handleStepsClose}
          onFinish={handleStepsClose}
        />
      </div>
      <div className={classes.fairplayNotice}>
        <Translate i18nKey="deposit.fairplayNotice" />{' '}
        {onLearnMore ? (
          <Link onClick={onLearnMore} className={classes.learnMore}>
            <Translate i18nKey="buttons.learnMore" />
          </Link>
        ) : null}
      </div>
    </>
  );
};
