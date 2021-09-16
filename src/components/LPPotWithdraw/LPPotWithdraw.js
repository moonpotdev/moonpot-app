import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePot, useTokenAllowance, useTokenBalance, useTokenEarned } from '../../helpers/hooks';
import { Link, makeStyles, Typography } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { formatDecimals, formatTimeLeft } from '../../helpers/format';
import PrizePoolAbi from '../../config/abi/prizepool.json';
import reduxActions from '../../features/redux/actions';
import { indexBy, isEmpty, variantClass } from '../../helpers/utils';
import Steps from '../../features/vault/components/Steps';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import { WalletConnectButton } from '../Buttons/WalletConnectButton';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Translate } from '../Translate';
import clsx from 'clsx';
import { tokensByNetworkAddress, tokensByNetworkSymbol } from '../../config/tokens';
import { config } from '../../config/config';
import { TokenIcon } from '../TokenIcon';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { createZapOutEstimate } from '../../features/redux/actions/zap';

const useStyles = makeStyles(styles);

// TODO move fairness fee to state/redux
function useTimelockEndsAt(
  contractAddress,
  rewardTokenAddress,
  tokenDecimals,
  prizePoolAddress,
  network
) {
  const rpc = useSelector(state => state.walletReducer.rpc[network]);
  const address = useSelector(state => state.walletReducer.address);
  const depositBalance = useTokenBalance(contractAddress, tokenDecimals);
  const [endsAt, setEndsAt] = useState(0);

  const prizePoolContract = useMemo(() => {
    return new rpc.eth.Contract(PrizePoolAbi, prizePoolAddress);
  }, [prizePoolAddress, rpc]);

  useEffect(() => {
    if (address && depositBalance.gt(0)) {
      (async () => {
        try {
          const lockRemainingSeconds = await prizePoolContract.methods
            .userFairPlayLockRemaining(address, rewardTokenAddress)
            .call();
          const now = Date.now();
          const timeLeft = (lockRemainingSeconds || 0) * 1000;

          setEndsAt(now + timeLeft);
        } catch (e) {
          if (e.message && e.message.includes('SafeMath: subtraction overflow')) {
            setEndsAt(0);
          } else {
            throw e;
          }
        }
      })();
    } else {
      setEndsAt(0);
    }
  }, [address, depositBalance, setEndsAt, rewardTokenAddress, prizePoolContract]);

  return endsAt;
}

const Stat = function ({ label, children }) {
  const classes = useStyles();
  return (
    <div className={classes.stat}>
      <div className={classes.statLabel}>{label}</div>
      <div className={classes.statValue}>{children}</div>
    </div>
  );
};

const StatDeposited = memo(function ({ token, contractAddress, tokenDecimals }) {
  const { t } = useTranslation();
  const userTotalBalance = useTokenBalance(contractAddress, tokenDecimals);
  return <Stat label={t('pot.myToken', { token })}>{formatDecimals(userTotalBalance, 8)}</Stat>;
});

const StatEarned = memo(function ({ id, token, tokenDecimals, labelKey = 'pot.myEarnedToken' }) {
  const { t } = useTranslation();
  const earned = useTokenEarned(id, token, tokenDecimals);

  if (earned.isZero()) {
    return null;
  }

  return <Stat label={t(labelKey, { token })}>{formatDecimals(earned, 8)}</Stat>;
});

const StatTimelock = memo(function ({ endsAt }) {
  const { t } = useTranslation();
  const timeLeft = Math.max(0, endsAt - Date.now());
  return <Stat label={t('pot.myFairplayTimelock')}>{formatTimeLeft(timeLeft)}</Stat>;
});

const StatFee = memo(function ({ endsAt, token, contractAddress, tokenDecimals }) {
  const { t } = useTranslation();
  const address = useSelector(state => state.walletReducer.address);
  const depositBalance = useTokenBalance(contractAddress, tokenDecimals);
  const fairnessFee = useMemo(() => {
    const timeLeft = endsAt - Date.now();
    if (address && depositBalance.gt(0) && timeLeft > 0) {
      const max = 3600 * 24 * 10 * 1000;
      const relative = (timeLeft * 0.025) / max;
      const fee = depositBalance.times(relative);
      return formatDecimals(fee, 8);
    }

    return 0;
  }, [endsAt, depositBalance, address]);

  return (
    <Stat label={t('pot.myFairnessFee')}>
      {fairnessFee} {token}
    </Stat>
  );
});

const Stats = function ({ id }) {
  const classes = useStyles();
  const pot = usePot(id);
  const timelockEndsAt = useTimelockEndsAt(
    pot.contractAddress,
    pot.rewardAddress,
    pot.tokenDecimals,
    pot.prizePoolAddress,
    pot.network
  );

  return (
    <div className={classes.stats}>
      <StatDeposited
        token={pot.token}
        contractAddress={pot.contractAddress}
        tokenDecimals={pot.tokenDecimals}
      />
      {pot.bonusToken ? (
        <StatEarned
          id={id}
          token={pot.bonusToken}
          tokenDecimals={pot.bonusTokenDecimals}
          labelKey={
            id === 'pots' && pot.bonusToken === 'POTS' ? 'pot.myEarnedToken' : 'pot.myBonusToken'
          }
        />
      ) : null}
      {pot.boostToken ? (
        <StatEarned
          id={id}
          token={pot.boostToken}
          tokenDecimals={pot.boostTokenDecimals}
          labelKey={
            id === 'pots' && pot.boostToken === 'POTS' ? 'pot.myEarnedToken' : 'pot.myBonusToken'
          }
        />
      ) : null}
      <StatTimelock endsAt={timelockEndsAt} />
      <StatFee
        endsAt={timelockEndsAt}
        token={pot.token}
        contractAddress={pot.contractAddress}
        tokenDecimals={pot.tokenDecimals}
      />
    </div>
  );
};

// TODO DRY, move to one global steps component; use state/actions
const WithdrawSteps = function ({ pot, steps, setSteps, onClose, onFinish }) {
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

const MigrationNotice = function ({ token }) {
  const classes = useStyles();
  return (
    <Alert severity={'warning'} className={classes.migrationNotice}>
      <AlertTitle>
        <Translate i18nKey="withdraw.migrationNotice.title" />
      </AlertTitle>
      <Typography>
        <Translate i18nKey="withdraw.migrationNotice.message" values={{ token }} />
      </Typography>
    </Alert>
  );
};

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
      const token0Symbol = lpToken.lp[0];
      const token1Symbol = lpToken.lp[1];
      const token0IsNative = token0Symbol === nativeWrappedToken.symbol;
      const token1IsNative = token1Symbol === nativeWrappedToken.symbol;
      const token0 = tokensByNetworkSymbol[network][token0Symbol];
      const token1 = tokensByNetworkSymbol[network][token1Symbol];

      if (token0IsNative) {
        // NOTE: beamOut automatically unwraps WBNB->BNB so we label WBNB as BNB
        tokens.push({
          ...token0,
          symbol: nativeSymbol,
          isNative: false,
          isRemove: false,
        });
      } else {
        tokens.push({ ...token0, isNative: false, isRemove: false });
      }

      if (token1IsNative) {
        // NOTE: beamOut automatically unwraps WBNB->BNB so we label WBNB as BNB
        tokens.push({
          ...token1,
          symbol: nativeSymbol,
          isNative: false,
          isRemove: false,
        });
      } else {
        tokens.push({ ...token1, isNative: false, isRemove: false });
      }

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

    return tokens;
  }, [lpAddress, network]);
}

function DropdownIcon(props) {
  return <KeyboardArrowDownIcon {...props} viewBox="6 8.59000015258789 12 7.409999847412109" />;
}

export const LPPotWithdraw = function ({ id, onLearnMore, variant = 'green' }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const pot = usePot(id);
  const address = useSelector(state => state.walletReducer.address);
  const network = pot.network;
  const lpAddress = pot.tokenAddress;
  const potAddress = pot.contractAddress;
  const potId = pot.id;
  const pairToken = tokensByNetworkAddress[pot.network][lpAddress.toLowerCase()];
  const withdrawTokens = useWithdrawTokens(network, lpAddress);
  const withdrawTokensBySymbol = useMemo(() => indexBy(withdrawTokens, 'symbol'), [withdrawTokens]);
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState(withdrawTokens[0].symbol);
  const selectedToken = useMemo(
    () => withdrawTokensBySymbol[selectedTokenSymbol],
    [withdrawTokensBySymbol, selectedTokenSymbol]
  );
  const ticketBalance = useTokenBalance(pot.rewardToken, pot.tokenDecimals);
  const userTotalBalance = useTokenBalance(pot.contractAddress, pot.tokenDecimals);
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

  const ticketAllowance = useTokenAllowance(potAddress, pot.rewardToken, pot.tokenDecimals);
  const [steps, setSteps] = React.useState(() => ({
    modal: false,
    currentStep: -1,
    items: [],
    finished: false,
  }));

  useEffect(() => {
    if (selectedNeedsZap) {
      // dispatch zap estimate
      const [requestId, action] = createZapOutEstimate(
        potId,
        selectedToken.address,
        userTotalBalance
      );
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
        // TODO approve LP and Ticket to the Zap Contract.
        // TODO zap
      } else {
        if (ticketAllowance.lt(ticketBalance)) {
          steps.push({
            step: 'approve',
            message: 'Approval transaction happens once per pot.',
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
          <Translate
            i18nKey="withdraw.zapExplainer"
            values={{ token0: pairToken.lp[0], token1: pairToken.lp[1] }}
          />
          {/*<TooltipWithIcon i18nKey="withdraw.zapTooltip" />*/}
        </div>
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
