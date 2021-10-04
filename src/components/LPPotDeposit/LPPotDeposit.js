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
import { usePot, useSymbolOrList, useTokenAllowance, useTokenBalance } from '../../helpers/hooks';
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

      for (const symbol of lpToken.lpDisplayOrder || lpToken.lp) {
        const tokenIsNative = symbol === nativeWrappedToken.symbol;
        const token = tokensByNetworkSymbol[network][symbol];

        if (tokenIsNative) {
          tokens.push({
            ...token,
            address: '',
            symbol: nativeSymbol,
            decimals: nativeDecimals,
            isNative: true,
          });
          tokens.push({ ...token, isNative: false });
        } else {
          tokens.push({ ...token, isNative: false });
        }
      }

      // Move LP to end of list
      if (lpToken.lpLast) {
        tokens.push(tokens.shift());
      }
    }

    return tokens;
  }, [lpAddress, network]);
}

/*function ZapDepositEstimateDebugger({
  selectedNeedsZap,
  zapEstimate,
  selectedToken,
  depositAmount,
  pairToken,
}) {
  if (!selectedNeedsZap) {
    return <div>Zap not needed for {selectedToken.symbol}</div>;
  }

  if (!depositAmount.gt(0)) {
    return <div>zero deposit amount</div>;
  }

  if (!zapEstimate) {
    return <div>No estimate yet</div>;
  }

  if (zapEstimate.pending) {
    return <div>Estimate pending</div>;
  }

  return (
    <>
      <div>
        Deposit {depositAmount.toString()} {selectedToken.symbol}
      </div>
      <div>
        Swap {zapEstimate.swapInAmount.toString()} {zapEstimate.swapInToken.symbol} for{' '}
        {zapEstimate.swapOutAmount.toString()} {zapEstimate.swapOutToken.symbol}
      </div>
      <div>Add {pairToken.symbol} liquidity</div>
    </>
  );
}*/

export const LPPotDeposit = function ({ id, onLearnMore, variant = 'green' }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const pot = usePot(id);
  const address = useSelector(state => state.walletReducer.address);
  const network = pot.network;
  const lpAddress = pot.tokenAddress;
  const potAddress = pot.contractAddress;
  const potId = pot.id;
  const pairToken = tokensByNetworkAddress[pot.network][lpAddress.toLowerCase()];
  const depositSingleSymbols = useSymbolOrList(pairToken.lpDisplayOrder || pairToken.lp);
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
    canDeposit && selectedNeedsZap ? zapEstimate.zapAddress : null,
    canDeposit && selectedNeedsZap ? zapEstimate.swapInToken.symbol : null,
    canDeposit && selectedNeedsZap ? zapEstimate.swapInToken.decimals : null
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
        const { zapAddress, isNative, swapInToken } = zapEstimate;

        // Approve Zap to spend token user is depositing
        if (!isNative && zapAllowance.lt(depositAmount)) {
          steps.push({
            step: 'approve',
            message: 'Approval transactions happen once per pot.',
            action: () =>
              dispatch(reduxActions.wallet.approval(pot.network, swapInToken.address, zapAddress)),
            pending: false,
          });
        }

        // Zap in
        steps.push({
          step: 'deposit',
          message: 'Confirm deposit transaction on wallet to complete.',
          action: () =>
            dispatch(
              reduxActions.wallet.zapIn(pot.network, pot.contractAddress, zapEstimate, isDepositAll)
            ),
          pending: false,
        });
      } else {
        if (potAllowance.lt(depositAmount)) {
          steps.push({
            step: 'approve',
            message: 'Approval transactions happen once per pot.',
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
            <Translate i18nKey="deposit.zapExplainer" values={{ tokens: depositSingleSymbols }} />
            <TooltipWithIcon
              i18nKey={id === '4belt' ? 'deposit.zapTooltip4Belt' : 'deposit.zapTooltip'}
            />
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
      {/*<div style={{ border: 'solid 1px red', padding: '10px', margin: '15px 0' }}>*/}
      {/*  <div>DEBUG</div>*/}
      {/*  <ZapDepositEstimateDebugger*/}
      {/*    zapEstimate={zapEstimate}*/}
      {/*    selectedToken={selectedToken}*/}
      {/*    selectedNeedsZap={selectedNeedsZap}*/}
      {/*    depositAmount={depositAmount}*/}
      {/*    pairToken={pairToken}*/}
      {/*  />*/}
      {/*</div>*/}
      <div className={classes.inputHolder}>
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
          <WalletConnectButton variant={variant} fullWidth={true} />
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
