import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePot, useTokenAllowance, useTokenBalance, useTokenEarned } from '../../helpers/hooks';
import { Link, makeStyles, Typography } from '@material-ui/core';
import styles from './styles';
import { Trans, useTranslation } from 'react-i18next';
import { formatDecimals, formatTimeLeft } from '../../helpers/format';
import PrizePoolAbi from '../../config/abi/prizepool.json';
import reduxActions from '../../features/redux/actions';
import { isEmpty } from '../../helpers/utils';
import Steps from '../../features/vault/components/Steps';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import { WalletConnectButton } from '../Buttons/WalletConnectButton';
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles(styles);

// TODO move fairness fee to state/redux
function useTimelockEndsAt(
  rewardToken,
  rewardTokenAddress,
  tokenDecimals,
  prizePoolAddress,
  network
) {
  const rpc = useSelector(state => state.walletReducer.rpc[network]);
  const address = useSelector(state => state.walletReducer.address);
  const ticketBalance = useTokenBalance(rewardToken, tokenDecimals);
  const [endsAt, setEndsAt] = useState(0);

  const prizePoolContract = useMemo(() => {
    return new rpc.eth.Contract(PrizePoolAbi, prizePoolAddress);
  }, [prizePoolAddress, rpc]);

  useEffect(() => {
    if (address && ticketBalance.gt(0)) {
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
  }, [address, ticketBalance, setEndsAt, rewardTokenAddress, prizePoolContract]);

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

const StatDeposited = memo(function ({ token, rewardToken, tokenDecimals }) {
  const { t } = useTranslation();
  const ticketBalance = useTokenBalance(rewardToken, tokenDecimals);
  return <Stat label={t('pot.myToken', { token })}>{formatDecimals(ticketBalance, 8)}</Stat>;
});

const StatEarned = memo(function ({ id, token, tokenDecimals }) {
  const { t } = useTranslation();
  const earned = useTokenEarned(id, token, tokenDecimals);
  return <Stat label={t('pot.myEarnedToken', { token })}>{formatDecimals(earned, 8)}</Stat>;
});

const StatTimelock = memo(function ({ endsAt }) {
  const { t } = useTranslation();
  const timeLeft = Math.max(0, endsAt - Date.now());
  return <Stat label={t('pot.myFairplayTimelock')}>{formatTimeLeft(timeLeft)}</Stat>;
});

const StatFee = memo(function ({ endsAt, token, rewardToken, tokenDecimals }) {
  const { t } = useTranslation();
  const address = useSelector(state => state.walletReducer.address);
  const ticketBalance = useTokenBalance(rewardToken, tokenDecimals);
  const fairnessFee = useMemo(() => {
    const timeLeft = endsAt - Date.now();
    if (address && ticketBalance.gt(0) && timeLeft > 0) {
      const max = 3600 * 24 * 10 * 1000;
      const relative = (timeLeft * 0.025) / max;
      const fee = ticketBalance.times(relative);
      return formatDecimals(fee, 8);
    }

    return 0;
  }, [endsAt, ticketBalance, address]);

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
    pot.rewardToken,
    pot.rewardAddress,
    pot.tokenDecimals,
    pot.prizePoolAddress,
    pot.network
  );

  return (
    <div className={classes.stats}>
      <StatDeposited
        token={pot.token}
        rewardToken={pot.rewardToken}
        tokenDecimals={pot.tokenDecimals}
      />
      {pot.bonusToken ? (
        <StatEarned id={id} token={pot.bonusToken} tokenDecimals={pot.bonusTokenDecimals} />
      ) : null}
      {pot.boostToken ? (
        <StatEarned id={id} token={pot.boostToken} tokenDecimals={pot.boostTokenDecimals} />
      ) : null}
      <StatTimelock endsAt={timelockEndsAt} />
      <StatFee
        endsAt={timelockEndsAt}
        token={pot.token}
        rewardToken={pot.rewardToken}
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
        <Trans i18nKey="withdraw.migrationNotice.title" />
      </AlertTitle>
      <Typography>
        <Trans i18nKey="withdraw.migrationNotice.message" values={{ token }} />
      </Typography>
    </Alert>
  );
};

export const PotWithdraw = function ({ id, onLearnMore }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const pot = usePot(id);
  const address = useSelector(state => state.walletReducer.address);
  const ticketBalance = useTokenBalance(pot.rewardToken, 18);
  const ticketAllowance = useTokenAllowance(pot.contractAddress, pot.rewardToken, 18);
  const [steps, setSteps] = React.useState(() => ({
    modal: false,
    currentStep: -1,
    items: [],
    finished: false,
  }));
  const canWithdraw = address && ticketBalance.gt(0);

  const handleWithdraw = () => {
    const steps = [];
    if (address && ticketBalance.gt(0)) {
      if (ticketAllowance.lt(ticketBalance)) {
        steps.push({
          step: 'approve',
          message: 'Approval transaction happens once per pot.',
          action: () =>
            dispatch(
              reduxActions.wallet.approval(pot.network, pot.rewardAddress, pot.contractAddress)
            ),
          pending: false,
        });
      }

      steps.push({
        step: 'withdraw',
        message: 'Confirm withdraw transaction on wallet to complete.',
        action: () =>
          dispatch(reduxActions.wallet.withdraw(pot.network, pot.contractAddress, 0, true)),
        pending: false,
      });

      setSteps({ modal: true, currentStep: 0, items: steps, finished: false });
    }
  };

  return (
    <>
      <Stats id={id} />
      {canWithdraw && pot.migrationNeeded ? <MigrationNotice token={pot.token} /> : null}
      <div className={classes.buttonHolder}>
        {address ? (
          <PrimaryButton
            variant="teal"
            onClick={handleWithdraw}
            disabled={!canWithdraw}
            fullWidth={true}
          >
            <Trans i18nKey="withdraw.all" />
          </PrimaryButton>
        ) : (
          <WalletConnectButton variant="teal" fullWidth={true} />
        )}
        <WithdrawSteps pot={pot} steps={steps} setSteps={setSteps} />
      </div>
      <div className={classes.fairplayNotice}>
        <Trans i18nKey="withdraw.fairplayNotice" />{' '}
        {onLearnMore ? (
          <Link onClick={onLearnMore} className={classes.learnMore}>
            <Trans i18nKey="buttons.learnMore" />
          </Link>
        ) : null}
      </div>
    </>
  );
};
