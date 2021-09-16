import { Grid, Link, makeStyles } from '@material-ui/core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles';
import BigNumber from 'bignumber.js';
import { bigNumberTruncate, convertAmountToRawNumber, formatDecimals } from '../../helpers/format';
import reduxActions from '../../features/redux/actions';
import Steps from '../../features/vault/components/Steps';
import { indexBy, isEmpty } from '../../helpers/utils';
import { LPTokenInput } from '../LPTokenInput/LPTokenInput';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import { TooltipWithIcon } from '../Tooltip/tooltip';
import { WalletConnectButton } from '../Buttons/WalletConnectButton';
import { usePot, useTokenAllowance, useTokenBalance } from '../../helpers/hooks';
import { Translate } from '../Translate';
import { tokensByNetworkAddress, tokensByNetworkSymbol } from '../../config/tokens';
import { config } from '../../config/config';
import { createZapInEstimate } from '../../features/redux/actions/zap';

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

function useDepositTokens(network, lpAddress) {
  return useMemo(() => {
    const lpToken = tokensByNetworkAddress[network][lpAddress.toLowerCase()];
    const supportsZap = 'zap' in lpToken;
    const tokens = [{ ...lpToken, isNative: false }];

    if (supportsZap) {
      const nativeCurrency = config[network].nativeCurrency;
      const nativeSymbol = nativeCurrency.symbol;
      const nativeDecimals = nativeCurrency.decimals;
      const nativeWrappedToken =
        tokensByNetworkAddress[network][nativeCurrency.wrappedAddress.toLowerCase()];
      const token0Symbol = lpToken.lp[0];
      const token1Symbol = lpToken.lp[1];
      const token0IsNative = token0Symbol === nativeWrappedToken.symbol;
      const token1IsNative = token1Symbol === nativeWrappedToken.symbol;
      const token0 = tokensByNetworkSymbol[network][token0Symbol];
      const token1 = tokensByNetworkSymbol[network][token1Symbol];

      if (token0IsNative) {
        tokens.push({
          ...token0,
          address: '',
          symbol: nativeSymbol,
          decimals: nativeDecimals,
          isNative: true,
        });
        tokens.push({ ...token0, isNative: false });
      } else {
        tokens.push({ ...token0, isNative: false });
      }

      if (token1IsNative) {
        tokens.push({
          ...token1,
          address: '',
          symbol: nativeSymbol,
          decimals: nativeDecimals,
          isNative: true,
        });
        tokens.push({ ...token1, isNative: false });
      } else {
        tokens.push({ ...token1, isNative: false });
      }
    }

    return tokens;
  }, [lpAddress, network]);
}

export const LPPotDeposit = function ({ id, onLearnMore, variant = 'teal' }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const pot = usePot(id);
  const address = useSelector(state => state.walletReducer.address);
  const network = pot.network;
  const lpAddress = pot.tokenAddress;
  const potAddress = pot.contractAddress;
  const potId = pot.id;
  const pairToken = tokensByNetworkAddress[pot.network][lpAddress.toLowerCase()];
  const depositTokens = useDepositTokens(network, lpAddress);
  const depositTokensBySymbol = useMemo(() => indexBy(depositTokens, 'symbol'), [depositTokens]);
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState(depositTokens[0].symbol);
  const selectedToken = useMemo(
    () => depositTokensBySymbol[selectedTokenSymbol],
    [depositTokensBySymbol, selectedTokenSymbol]
  );
  const balance = useTokenBalance(
    selectedTokenSymbol,
    depositTokensBySymbol[selectedTokenSymbol].decimals
  );
  const potAllowance = useTokenAllowance(
    potAddress,
    selectedTokenSymbol,
    depositTokensBySymbol[selectedTokenSymbol].decimals
  );
  const [inputValue, setInputValue] = useState('');
  const [depositAmount, setDepositAmount] = useState(() => new BigNumber(0));
  const [isDepositAll, setIsDepositAll] = useState(false);
  const [steps, setSteps] = useState(() => ({
    modal: false,
    currentStep: -1,
    items: [],
    finished: false,
  }));
  const selectedNeedsZap = selectedToken.address.toLowerCase() !== pot.tokenAddress.toLowerCase();
  const [zapRequestId, setZapRequestId] = useState(null);
  const zapEstimate = useSelector(state =>
    zapRequestId ? state.zapReducer[zapRequestId] ?? null : null
  );
  const canDeposit = useMemo(() => {
    const hasBalance = address && balance.gt(0) && depositAmount.gt(0);

    if (hasBalance && selectedNeedsZap) {
      return (
        zapEstimate &&
        zapEstimate.pending === false &&
        zapEstimate.swapInAmount.gt(0) &&
        zapEstimate.swapOutAmount.gt(0)
      );
    }

    return hasBalance;
  }, [address, balance, depositAmount, selectedNeedsZap, zapEstimate]);
  const zapAllowance = useTokenAllowance(
    canDeposit ? zapEstimate.zapAddress : null,
    canDeposit ? zapEstimate.swapInToken.symbol : null,
    canDeposit ? zapEstimate.swapInToken.decimals : null
  );

  useEffect(() => {
    if (selectedNeedsZap && depositAmount.gt(0)) {
      // dispatch zap estimate
      const [requestId, action] = createZapInEstimate(potId, selectedToken.address, depositAmount);
      dispatch(action);
      setZapRequestId(requestId);
    } else {
      // clear zap estimate
      setZapRequestId(null);
    }
  }, [dispatch, selectedToken, selectedNeedsZap, depositAmount, potId, setZapRequestId]);

  const handleDeposit = () => {
    const steps = [];
    if (canDeposit) {
      if (selectedNeedsZap) {
        // approve selectedToken on zap contract
        // call beamIn or beamInETH (native)

        const { zapAddress, isNative, swapInToken } = zapEstimate;

        if (!isNative && zapAllowance.lt(depositAmount)) {
          steps.push({
            step: 'approve',
            message: 'Approval transaction happens once per pot.',
            action: () =>
              dispatch(reduxActions.wallet.approval(pot.network, swapInToken.address, zapAddress)),
            pending: false,
          });
        }

        steps.push({
          step: 'deposit',
          message: 'Confirm deposit transaction on wallet to complete.',
          action: () =>
            dispatch(reduxActions.wallet.zapIn(pot.contractAddress, zapEstimate, isDepositAll)),
          pending: false,
        });
      } else {
        if (potAllowance.lt(depositAmount)) {
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
      }

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
  }, [inputValue]);

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <div className={classes.subHeaderHolder}>
            <Translate
              i18nKey="deposit.zapExplainer"
              values={{ token0: pairToken.lp[0], token1: pairToken.lp[1] }}
            />
            <TooltipWithIcon i18nKey="deposit.zapTooltip" />
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.label}>
            <Translate i18nKey="deposit.inYourWallet" />
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.label} style={{ textAlign: 'right' }}>
            <Translate i18nKey="deposit.provider" />
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.value}>
            {formatDecimals(balance)} {selectedTokenSymbol}
          </div>
        </Grid>
        <Grid item xs={6} style={{ textAlign: 'right' }}>
          <div className={classes.value}>{pot.provider}</div>
        </Grid>
      </Grid>
      <div className={classes.inputHolder}>
        {selectedNeedsZap ? 'needs zap' : 'not zap'}
        {selectedNeedsZap && zapEstimate && zapEstimate.pending === false ? (
          <>
            <div>
              deposit:
              <div>
                {zapEstimate.depositAmount.toString()} {zapEstimate.swapInToken.symbol}
              </div>
            </div>
            <div>
              swap in:
              <div>
                {zapEstimate.swapInAmount.toString()} {zapEstimate.swapInToken.symbol}
              </div>
            </div>
            <div>
              swap out:
              <div>
                {zapEstimate.swapOutAmount.toString()} {zapEstimate.swapOutToken.symbol}
              </div>
            </div>
          </>
        ) : null}
        <LPTokenInput
          tokens={depositTokens}
          selected={selectedTokenSymbol}
          value={inputValue}
          max={balance}
          setValue={setInputValue}
          setIsMax={setIsDepositAll}
          setSelected={setSelectedTokenSymbol}
          variant={variant}
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
              values={{ token: selectedTokenSymbol, amount: depositAmount.toString() }}
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
