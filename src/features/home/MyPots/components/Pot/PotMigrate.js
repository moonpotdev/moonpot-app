import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import styles from './styles';
import reduxActions from '../../../../redux/actions';
import { isEmpty } from '../../../../../helpers/utils';
import Steps from '../../../../vault/components/Steps/Steps';
import { Translate } from '../../../../../components/Translate';
import { PrimaryButton } from '../../../../../components/Buttons/PrimaryButton';
import { useBonusesEarned, useTokenAllowance, useTokenBalance } from '../../../../../helpers/hooks';
import { convertAmountToRawNumber } from '../../../../../helpers/format';
import { useTranslation } from 'react-i18next';
import { Alert, AlertText } from '../../../../../components/Alert';
import { InfoOutlined } from '@material-ui/icons';

const useStyles = makeStyles(styles);

export const PotMigrate = function ({ item }) {
  const { t, i18n } = useTranslation();
  const wallet = useSelector(state => state.wallet);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [steps, setSteps] = useState({
    modal: false,
    currentStep: -1,
    items: [],
    finished: false,
  });
  const userTotalBalance = useTokenBalance(item.contractAddress + ':total', item.tokenDecimals);
  const ticketBalance = useTokenBalance(item.rewardToken, item.tokenDecimals);
  const ticketWithdrawAllowance = useTokenAllowance(
    item.contractAddress,
    item.rewardToken,
    item.tokenDecimals
  );
  const tokenDepositAllowance = useTokenAllowance(
    item.migrationContractAddress,
    item.token,
    item.tokenDecimals
  );

  const [stepsItem, setStepsItem] = useState(null);
  const bonuses = useBonusesEarned(item.id);
  const bonusTokens = useMemo(
    () =>
      bonuses
        .filter(bonus => bonus.earned > 0)
        .map(bonus => bonus.symbol)
        .join(' & '),
    [bonuses]
  );

  const handleClose = () => {
    updateItemData();

    setStepsItem(null);
    setSteps({ modal: false, currentStep: -1, items: [], finished: false });
  };

  const updateItemData = () => {
    if (wallet.address) {
      dispatch(reduxActions.vault.fetchPools());
      dispatch(reduxActions.balance.fetchBalances());
      dispatch(reduxActions.earned.fetchEarned());
    }
  };

  const handleMigrator = item => {
    if (wallet.address) {
      const steps = [];

      if (ticketWithdrawAllowance.lt(ticketBalance)) {
        steps.push({
          step: 'approve',
          message: 'Approval transactions happen once per pot.',
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
          dispatch(reduxActions.wallet.withdraw(item.network, item.contractAddress, 0, true)),
        pending: false,
      });

      if (tokenDepositAllowance.lt(userTotalBalance)) {
        steps.push({
          step: 'approve',
          message: 'Approval transactions happen once per pot.',
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
              convertAmountToRawNumber(userTotalBalance, item.tokenDecimals),
              false
            )
          ),
        pending: false,
      });

      setStepsItem(item);
      setSteps({ modal: true, currentStep: 0, items: steps, finished: false });
    }
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

  const migrationDetailsKey = i18n.exists(`migration.details.${item.id}`)
    ? `migration.details.${item.id}`
    : 'migration.details.all';

  return (
    <Grid item xs={12}>
      <Steps item={stepsItem} steps={steps} handleClose={handleClose} />
      <Grid container>
        <Grid item xs={12}>
          <Alert Icon={InfoOutlined} variant="purpleLight">
            <AlertText>
              {t(migrationDetailsKey, {
                returnObjects: true,
                token: item.token,
                name: item.name,
              }).map((text, index) => (
                <p key={index}>{text}</p>
              ))}
              {item.migrationLearnMoreUrl ? (
                <p>
                  <a
                    href={item.migrationLearnMoreUrl}
                    className={classes.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Translate i18nKey="migration.learnMore" />
                  </a>
                </p>
              ) : null}
            </AlertText>
          </Alert>
          <PrimaryButton
            onClick={() => handleMigrator(item)}
            className={classes.eolMoveBtn}
            variant="purple"
            fullWidth={true}
            disabled={item.userBalance.lte(0)}
          >
            <Translate
              i18nKey={bonusTokens ? 'migration.migrateTokenAndClaim' : 'migration.migrateToken'}
              values={{ token: item.token, bonus: bonusTokens }}
            />
          </PrimaryButton>
        </Grid>
        <Grid item xs={6} align={'left'}>
          <Typography className={classes.potsItemText} style={{ marginTop: '12px' }}>
            <Translate i18nKey="pot.myFairplayTimelock" />
          </Typography>
        </Grid>
        <Grid item xs={6} align={'right'}>
          <Typography className={classes.potsItemValue}>00d 00h 00m</Typography>
        </Grid>
        <Grid item xs={6} align={'left'}>
          <Typography className={classes.potsItemText}>
            <Translate i18nKey="pot.myFairnessFee" />
          </Typography>
        </Grid>
        <Grid item xs={6} align={'right'}>
          <Typography className={classes.potsItemValue}>0 {item.token}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
