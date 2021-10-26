import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useBonusesEarned, usePot, useTokenAllowance, useTokenBalance } from '../../helpers/hooks';
import { Link, makeStyles } from '@material-ui/core';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import {
  bigNumberTruncate,
  convertAmountToRawNumber,
  formatDecimals,
  formatTimeLeft,
} from '../../helpers/format';
import reduxActions from '../../features/redux/actions';
import { getFairplayFeePercent, isEmpty } from '../../helpers/utils';
import Steps from '../../features/vault/components/Steps';
import { WalletConnectButton } from '../Buttons/WalletConnectButton';
import { Translate } from '../Translate';
import { SecondaryButton } from '../Buttons/SecondaryButton';
import { TokenInput } from '../TokenInput';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import BigNumber from 'bignumber.js';
import { Alert, AlertText } from '../Alert';
import { InfoOutlined } from '@material-ui/icons';

const useStyles = makeStyles(styles);

const bonusStatLabels = {
  bonus: 'withdraw.myBonusToken',
  superBoost: 'withdraw.mySuperBoostToken',
  earned: 'withdraw.myEarnedToken',
};

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
  const userTotalBalance = useTokenBalance(contractAddress + ':total', tokenDecimals);
  return <Stat label={t('pot.myToken', { token })}>{formatDecimals(userTotalBalance, 8)}</Stat>;
});

const StatEarned = memo(function ({ bonus }) {
  const { t } = useTranslation();

  return (
    <Stat label={t(bonusStatLabels[bonus.display], { token: bonus.symbol })}>
      {formatDecimals(bonus.earned, 8)}
    </Stat>
  );
});

const StatTimelock = memo(function ({ contractAddress }) {
  const { t } = useTranslation();
  const timeleft = useSelector(
    state => state.balanceReducer.tokens[contractAddress + ':fee'].timeleft
  );
  const timeleftUpdatedAt = useSelector(
    state => state.balanceReducer.tokens[contractAddress + ':fee'].timeleftUpdated
  );
  const endsAt = (timeleftUpdatedAt + timeleft) * 1000;
  const timeLeft = Math.max(0, endsAt - Date.now());
  return <Stat label={t('pot.myFairplayTimelock')}>{formatTimeLeft(timeLeft)}</Stat>;
});

const StatFee = memo(function ({
  token,
  contractAddress,
  ticketSymbol,
  tokenDecimals,
  fairplayDuration,
  fairplayTicketFee,
}) {
  const { t } = useTranslation();
  const address = useSelector(state => state.walletReducer.address);
  const timeleft = useSelector(
    state => state.balanceReducer.tokens[contractAddress + ':fee'].timeleft
  );
  const timeleftUpdatedAt = useSelector(
    state => state.balanceReducer.tokens[contractAddress + ':fee'].timeleftUpdated
  );
  const endsAt = (timeleftUpdatedAt + timeleft) * 1000;
  const ticketBalance = useTokenBalance(ticketSymbol, tokenDecimals);

  const fairnessFee = useMemo(() => {
    const timeLeft = endsAt - Date.now();

    if (address && ticketBalance.gt(0) && timeLeft > 0) {
      const relative = getFairplayFeePercent(timeLeft / 1000, fairplayDuration, fairplayTicketFee);
      const fee = ticketBalance.times(relative);
      return formatDecimals(fee, 8);
    }

    return 0;
  }, [endsAt, ticketBalance, address, fairplayDuration, fairplayTicketFee]);

  return (
    <Stat label={t('pot.myFairnessFee')}>
      {fairnessFee} {token}
    </Stat>
  );
});

const BonusStats = memo(function BonusStats({ id }) {
  const bonuses = useBonusesEarned(id).filter(bonus => bonus.earned > 0);

  if (bonuses.length) {
    return bonuses.map(bonus => <StatEarned key={`${id}-${bonus.id}`} id={id} bonus={bonus} />);
  }

  return null;
});

export const Stats = function ({ id }) {
  const classes = useStyles();
  const pot = usePot(id);

  return (
    <div className={classes.stats}>
      <StatDeposited
        token={pot.token}
        contractAddress={pot.contractAddress}
        tokenDecimals={pot.tokenDecimals}
      />
      <BonusStats id={id} />
      <StatTimelock contractAddress={pot.contractAddress} />
      <StatFee
        token={pot.token}
        contractAddress={pot.contractAddress}
        tokenDecimals={pot.tokenDecimals}
        ticketSymbol={pot.rewardToken}
        fairplayDuration={pot.fairplayDuration}
        fairplayTicketFee={pot.fairplayTicketFee}
      />
    </div>
  );
};

// TODO DRY, move to one global steps component; use state/actions
export const WithdrawSteps = function ({ pot, steps, setSteps, onClose, onFinish }) {
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

export const MigrationNotice = function ({ id, name, token }) {
  const { t, i18n } = useTranslation();
  const classes = useStyles();

  const migrationWithdrawKey = i18n.exists(`migration.withdraw.${id}`)
    ? `migration.withdraw.${id}`
    : 'migration.withdraw.all';

  return (
    <Alert Icon={InfoOutlined} variant="purpleLight" className={classes.migrationNotice}>
      <AlertText>
        {t(migrationWithdrawKey, {
          returnObjects: true,
          token: token,
          name: name,
        }).map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </AlertText>
    </Alert>
  );
};

export const PotWithdraw = function ({ id, onLearnMore, variant = 'teal' }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const pot = usePot(id);
  const [inputValue, setInputValue] = useState('');
  const [isPartialWithdrawAll, setIsPartialWithdrawAll] = useState(false);
  const [partialWithdrawAmount, setPartialWithdrawAmount] = useState(() => new BigNumber(0));
  const [canWithdrawPartial, setCanWithdrawPartial] = useState(false);
  const address = useSelector(state => state.walletReducer.address);
  const totalBalance = useTokenBalance(pot.contractAddress + ':total', pot.tokenDecimals);
  const ticketBalance = useTokenBalance(pot.rewardToken, pot.tokenDecimals);
  const ticketAllowance = useTokenAllowance(
    pot.contractAddress,
    pot.rewardToken,
    pot.tokenDecimals
  );
  const mooTokenAllowance = useTokenAllowance(
    pot.contractAddress,
    pot.mooTokenAddress,
    pot.tokenDecimals
  );
  const [steps, setSteps] = React.useState(() => ({
    modal: false,
    currentStep: -1,
    items: [],
    finished: false,
  }));
  const canWithdrawAll = address && totalBalance.gt(0);
  const supportsPartialWithdraw = pot.supportsPartialWithdraw;

  const handleWithdraw = () => {
    const steps = [];
    if (address && totalBalance.gt(0)) {
      if (ticketAllowance.lt(ticketBalance) || ticketAllowance.lte(0)) {
        steps.push({
          step: 'approve',
          message: 'Approval transactions happen once per pot.',
          action: () =>
            dispatch(
              reduxActions.wallet.approval(pot.network, pot.rewardAddress, pot.contractAddress)
            ),
          pending: false,
        });
      }

      // Approve mooToken for partial withdraw by Ziggy
      if ('mooTokenAddress' in pot && mooTokenAllowance.lte(0)) {
        steps.push({
          step: 'approve',
          message: 'Approval transactions happen once per pot.',
          action: () =>
            dispatch(
              reduxActions.wallet.approval(pot.network, pot.mooTokenAddress, pot.contractAddress)
            ),
          pending: false,
        });
      }

      const amount = supportsPartialWithdraw
        ? convertAmountToRawNumber(partialWithdrawAmount, pot.tokenDecimals)
        : 0;
      const isMax = !supportsPartialWithdraw || isPartialWithdrawAll;
      steps.push({
        step: 'withdraw',
        message: 'Confirm withdraw transaction on wallet to complete.',
        action: () =>
          dispatch(reduxActions.wallet.withdraw(pot.network, pot.contractAddress, amount, isMax)),
        pending: false,
      });

      setSteps({ modal: true, currentStep: 0, items: steps, finished: false });
    }
  };

  // input string to bignumber
  useEffect(() => {
    const value = bigNumberTruncate(inputValue, 8);
    setPartialWithdrawAmount(value);
    setCanWithdrawPartial(address && totalBalance.gt(0) && value.gt(0));
  }, [inputValue, address, totalBalance]);

  return (
    <>
      <Stats id={id} />
      {canWithdrawAll && pot.migrationNeeded ? <MigrationNotice token={pot.token} /> : null}
      {supportsPartialWithdraw ? (
        <>
          <div className={classes.inputHolder}>
            <TokenInput
              variant={variant}
              token={pot.token}
              value={inputValue}
              max={totalBalance}
              setValue={setInputValue}
              setIsMax={setIsPartialWithdrawAll}
            />
          </div>
          <div className={classes.buttonHolder}>
            {address ? (
              <SecondaryButton
                variant={variant}
                onClick={handleWithdraw}
                disabled={!canWithdrawPartial}
                fullWidth={true}
              >
                <Translate
                  i18nKey={isPartialWithdrawAll ? 'withdraw.allToken' : 'withdraw.token'}
                  values={{ token: pot.token }}
                />
              </SecondaryButton>
            ) : (
              <WalletConnectButton variant={variant} fullWidth={true} />
            )}
          </div>
        </>
      ) : (
        <div className={classes.buttonHolder}>
          {address ? (
            <PrimaryButton
              variant={variant}
              onClick={handleWithdraw}
              disabled={!canWithdrawAll}
              fullWidth={true}
            >
              <Translate i18nKey="withdraw.allToken" values={{ token: pot.token }} />
            </PrimaryButton>
          ) : (
            <WalletConnectButton variant={variant} fullWidth={true} />
          )}
        </div>
      )}
      <WithdrawSteps pot={pot} steps={steps} setSteps={setSteps} />
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
