import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { Link, makeStyles, MenuItem, Select } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { usePot, useSymbolOrList, useTokenAllowance, useTokenBalance } from '../../helpers/hooks';
import reduxActions from '../../features/redux/actions';
import { indexBy, variantClass } from '../../helpers/utils';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import { WalletConnectButton } from '../Buttons/WalletConnectButton';
import { Translate } from '../Translate';
import { tokensByNetworkAddress, tokensByNetworkSymbol } from '../../config/tokens';
import { config } from '../../config/config';
import { TokenIcon } from '../TokenIcon';
import { createZapOutEstimate } from '../../features/redux/actions/zap';
import { MigrationNotice, Stats, WithdrawSteps } from './PotWithdraw';
import styles from './styles';
import { formatDecimals } from '../../helpers/format';

const useStyles = makeStyles(styles);

function useWithdrawTokens(network, lpAddress) {
  return useMemo(() => {
    const lpToken = tokensByNetworkAddress[network][lpAddress.toLowerCase()];
    const supportsZap = 'zap' in lpToken;
    const tokens = [{ ...lpToken, isNative: false, isRemove: false }];

    if (supportsZap) {
      const nativeCurrency = config[network].nativeCurrency;
      const nativeSymbol = nativeCurrency.symbol;
      const nativeWrappedToken =
        tokensByNetworkAddress[network][nativeCurrency.wrappedAddress.toLowerCase()];

      for (const symbol of lpToken.lpDisplayOrder || lpToken.lp) {
        const tokenIsNative = symbol === nativeWrappedToken.symbol;
        const token = tokensByNetworkSymbol[network][symbol];

        if (tokenIsNative) {
          // NOTE: beamOut automatically unwraps WBNB->BNB so we label WBNB as BNB
          tokens.push({
            ...token,
            symbol: nativeSymbol,
            isNative: false,
            isRemove: false,
          });
        } else {
          tokens.push({ ...token, isNative: false, isRemove: false });
        }
      }

      // Withdraw as token0 + token1
      if (lpToken.lp.length === 2) {
        const token0Symbol = lpToken.lp[0];
        const token1Symbol = lpToken.lp[1];
        const token0IsNative = token0Symbol === nativeWrappedToken.symbol;
        const token1IsNative = token1Symbol === nativeWrappedToken.symbol;
        const token0 = tokensByNetworkSymbol[network][token0Symbol];
        const token1 = tokensByNetworkSymbol[network][token1Symbol];

        // NOTE: beamOut automatically unwraps WBNB->BNB so we label WBNB as BNB
        tokens.push({
          ...lpToken,
          address: '',
          symbol: `${token0IsNative ? nativeSymbol : token0.symbol} + ${
            token1IsNative ? nativeSymbol : token1.symbol
          }`,
          isNative: false,
          isRemove: true,
        });
      }

      // Move LP to end of list
      if (lpToken.lpLast) {
        tokens.push(tokens.shift());
      }
    }

    return tokens;
  }, [lpAddress, network]);
}

function DropdownIcon(props) {
  return <KeyboardArrowDownIcon {...props} viewBox="6 8.59000015258789 12 7.409999847412109" />;
}

/*function ZapWithdrawEstimateDebugger({
  zapEstimate,
  userTotalBalance,
  selectedNeedsZap,
  selectedToken,
  pairToken,
}) {
  if (!selectedNeedsZap) {
    return <div>Zap not needed for {selectedToken.symbol}</div>;
  }

  if (!zapEstimate) {
    return <div>No estimate yet</div>;
  }

  if (zapEstimate.pending) {
    return <div>Estimate pending</div>;
  }

  if (zapEstimate.isRemoveOnly) {
    return (
      <div>
        <div>
          Withdraw {userTotalBalance.toString()} {pairToken.symbol} (
          {zapEstimate.userWithdrawableBalance.toString()} {pairToken.symbol} after
          fairplay/withdraw fee)
        </div>
        <div>
          Remove liquidity for {zapEstimate.balance0.toString()} {zapEstimate.token0.symbol} and{' '}
          {zapEstimate.balance1.toString()} {zapEstimate.token1.symbol}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        Withdraw {userTotalBalance.toString()} {pairToken.symbol} (
        {zapEstimate.userWithdrawableBalance.toString()} {pairToken.symbol} after fairplay/withdraw
        fee)
      </div>
      <div>
        Remove liquidity for {zapEstimate.balance0.toString()} {zapEstimate.token0.symbol} and{' '}
        {zapEstimate.balance1.toString()} {zapEstimate.token1.symbol}
      </div>
      <div>
        Swap {zapEstimate.swapInAmount.toString()} {zapEstimate.swapInToken.symbol} for{' '}
        {zapEstimate.swapOutAmount.toString()} {zapEstimate.swapOutToken.symbol}
      </div>
    </div>
  );
}*/

function useUnwrappedTokensSymbols(network, tokens) {
  return useMemo(() => {
    const nativeCurrency = config[network].nativeCurrency;
    const nativeSymbol = nativeCurrency.symbol;
    const nativeWrappedSymbol = nativeCurrency.wrappedSymbol;

    return tokens.map(symbol => {
      if (symbol === nativeWrappedSymbol) {
        return nativeSymbol;
      }

      return symbol;
    });
  }, [network, tokens]);
}

export const ZapPotWithdraw = function ({ id, onLearnMore, variant = 'green' }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const pot = usePot(id);
  const address = useSelector(state => state.walletReducer.address);
  const network = pot.network;
  const lpAddress = pot.tokenAddress;
  const potAddress = pot.contractAddress;
  const potId = pot.id;
  const pairToken = tokensByNetworkAddress[pot.network][lpAddress.toLowerCase()];
  const unwrappedTokenSymbols = useUnwrappedTokensSymbols(
    pot.network,
    pairToken.lpDisplayOrder || pairToken.lp
  );
  const withdrawSingleSymbols = useSymbolOrList(unwrappedTokenSymbols);
  const withdrawTokens = useWithdrawTokens(network, lpAddress);
  const withdrawTokensBySymbol = useMemo(() => indexBy(withdrawTokens, 'symbol'), [withdrawTokens]);
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState(withdrawTokens[0].symbol);
  const selectedToken = useMemo(
    () => withdrawTokensBySymbol[selectedTokenSymbol],
    [withdrawTokensBySymbol, selectedTokenSymbol]
  );
  const ticketBalance = useTokenBalance(pot.rewardToken, pot.tokenDecimals);
  const userTotalBalance = useTokenBalance(pot.contractAddress + ':total', pot.tokenDecimals);
  const selectedNeedsZap = selectedToken.address.toLowerCase() !== pot.tokenAddress.toLowerCase();
  const [zapRequestId, setZapRequestId] = useState(null);
  const zapEstimate = useSelector(state =>
    zapRequestId ? state.zapReducer[zapRequestId] ?? null : null
  );
  const canWithdraw = useMemo(() => {
    if (!address || !userTotalBalance.gt(0)) {
      return false;
    }

    if (selectedNeedsZap) {
      if (!zapEstimate || zapEstimate.pending !== false) {
        return false;
      }

      if (!zapEstimate.balance0.gt(0) || !zapEstimate.balance1.gt(0)) {
        return false;
      }

      if (!zapEstimate.isRemoveOnly) {
        return zapEstimate.swapOutAmount.gt(0);
      }
    }

    return true;
  }, [address, userTotalBalance, selectedNeedsZap, zapEstimate]);
  const potTicketAllowance = useTokenAllowance(potAddress, pot.rewardToken, pot.tokenDecimals);
  const zapTicketAllowance = useTokenAllowance(pairToken.zap, pot.rewardToken, pot.tokenDecimals);
  const zapLPAllowance = useTokenAllowance(pairToken.zap, pot.token, pot.tokenDecimals);
  const [steps, setSteps] = React.useState(() => ({
    modal: false,
    currentStep: -1,
    items: [],
    finished: false,
  }));

  useEffect(() => {
    if (selectedNeedsZap && userTotalBalance.gt(0)) {
      // dispatch zap estimate
      const [requestId, action] = createZapOutEstimate(potId, selectedToken.address);
      dispatch(action);
      setZapRequestId(requestId);
    } else {
      // clear zap estimate
      setZapRequestId(null);
    }
  }, [dispatch, selectedToken, userTotalBalance, selectedNeedsZap, potId, setZapRequestId]);

  const handleSelect = useCallback(
    event => {
      setSelectedTokenSymbol(event.target.value);
    },
    [setSelectedTokenSymbol]
  );

  const handleWithdraw = () => {
    const steps = [];
    if (address && canWithdraw) {
      if (selectedNeedsZap) {
        // Approve Zap to spend Tickets
        if (zapTicketAllowance.lt(ticketBalance)) {
          steps.push({
            step: 'approve',
            message: 'Approval transactions happen once per pot.',
            action: () =>
              dispatch(reduxActions.wallet.approval(pot.network, pot.rewardAddress, pairToken.zap)),
            pending: false,
          });
        }

        // Approve Zap to spend LP
        if (zapLPAllowance.lt(userTotalBalance)) {
          steps.push({
            step: 'approve',
            message: 'Approval transactions happen once per pot.',
            action: () =>
              dispatch(reduxActions.wallet.approval(pot.network, pot.tokenAddress, pairToken.zap)),
            pending: false,
          });
        }

        // Zap
        steps.push({
          step: 'withdraw',
          message: 'Confirm withdraw transaction on wallet to complete.',
          action: () =>
            dispatch(reduxActions.wallet.zapOut(pot.network, pot.contractAddress, zapEstimate)),
          pending: false,
        });
      } else {
        if (potTicketAllowance.lt(ticketBalance)) {
          steps.push({
            step: 'approve',
            message: 'Approval transactions happen once per pot',
            action: () =>
              dispatch(reduxActions.wallet.approval(pot.network, pot.rewardAddress, potAddress)),
            pending: false,
          });
        }

        steps.push({
          step: 'withdraw',
          message: 'Confirm withdraw transaction on wallet to complete.',
          action: () => dispatch(reduxActions.wallet.withdraw(pot.network, potAddress, 0, true)),
          pending: false,
        });
      }

      setSteps({ modal: true, currentStep: 0, items: steps, finished: false });
    }
  };

  return (
    <>
      <Stats id={id} />
      {canWithdraw && pot.migrationNeeded ? <MigrationNotice token={pot.token} /> : null}
      <div className={classes.buttonHolder}>
        <div className={classes.zapInfoHolder}>
          <Translate i18nKey="withdraw.zapExplainer" values={{ tokens: withdrawSingleSymbols }} />
          {/*<TooltipWithIcon i18nKey="withdraw.zapTooltip" />*/}
        </div>
        {/*<div style={{ border: 'solid 1px red', padding: '10px', margin: '15px 0' }}>*/}
        {/*  <div>DEBUG</div>*/}
        {/*  <ZapWithdrawEstimateDebugger*/}
        {/*    zapEstimate={zapEstimate}*/}
        {/*    selectedNeedsZap={selectedNeedsZap}*/}
        {/*    selectedToken={selectedToken}*/}
        {/*    userTotalBalance={userTotalBalance}*/}
        {/*    pairToken={pairToken}*/}
        {/*  />*/}
        {/*</div>*/}
        <div className={classes.fieldsHolder}>
          {address ? (
            <div className={classes.selectField}>
              <Select
                className={clsx(
                  classes.tokenSelect,
                  variantClass(classes, 'inputVariant', variant)
                )}
                disableUnderline
                IconComponent={DropdownIcon}
                value={selectedTokenSymbol}
                onChange={handleSelect}
                MenuProps={{
                  classes: {
                    paper: clsx(
                      classes.tokenDropdown,
                      variantClass(classes, 'tokenDropdownVariant', variant)
                    ),
                  },
                  anchorOrigin: { horizontal: 'left', vertical: 'bottom' },
                  transformOrigin: { horizontal: 'left', vertical: 'top' },
                  getContentAnchorEl: null,
                }}
              >
                {withdrawTokens.map(token => (
                  <MenuItem key={token.symbol} value={token.symbol} className={classes.tokenItem}>
                    <TokenIcon token={token} />
                    <span className={classes.tokenItemSymbol}>{token.symbol}</span>
                  </MenuItem>
                ))}
              </Select>
            </div>
          ) : null}
          <div className={classes.inputField}>
            {address ? (
              <PrimaryButton
                variant={variant}
                onClick={handleWithdraw}
                disabled={!canWithdraw}
                fullWidth={true}
              >
                <Translate
                  i18nKey={selectedNeedsZap ? 'withdraw.allTokenAs' : 'withdraw.all'}
                  values={{ token: selectedTokenSymbol }}
                />
              </PrimaryButton>
            ) : (
              <WalletConnectButton variant={variant} fullWidth={true} />
            )}
          </div>
        </div>
        <WithdrawSteps pot={pot} steps={steps} setSteps={setSteps} />
      </div>
      {pot.withdrawFee ? (
        <div className={classes.fairplayNotice}>
          <Translate
            i18nKey="withdraw.withdrawFeeNotice"
            values={{ percent: formatDecimals(pot.withdrawFee * 100, 2) }}
          />
        </div>
      ) : null}
      <div className={classes.fairplayNotice}>
        <Translate i18nKey="withdraw.fairplayNotice" />{' '}
        {onLearnMore ? (
          <Link onClick={onLearnMore} className={classes.learnMore}>
            <Translate i18nKey="buttons.learnMore" />
          </Link>
        ) : null}
      </div>
    </>
  );
};
