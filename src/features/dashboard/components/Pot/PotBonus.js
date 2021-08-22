import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import styles from '../../styles';
import { Trans, useTranslation } from 'react-i18next';
import reduxActions from '../../../redux/actions';
import { formatDecimals } from '../../../../helpers/format';
import Steps from '../../../vault/components/Steps/Steps';
import { isEmpty } from '../../../../helpers/utils';

const useStyles = makeStyles(styles);

const getItemBonusTokens = item => {
  const tokens = [];

  if (item.bonusToken) {
    tokens.push(item.bonusToken);
  }

  if (item.boostToken) {
    tokens.push(item.boostToken);
  }

  return tokens.join(' & ');
};

const itemSupportsCompound = item => {
  return (
    item.supportsCompound &&
    'bonusRewardId' in item &&
    item.bonusRewardId === 0 &&
    item.bonusAddress === item.tokenAddress
  );
};

const PotBonus = function ({ item, prices, wallet, balance }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [steps, setSteps] = React.useState({
    modal: false,
    currentStep: -1,
    items: [],
    finished: false,
  });
  const [stepsItem, setStepsItem] = React.useState(null);

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

  const handleCompoundBonus = item => {
    if (wallet.address) {
      const steps = [];

      const tokenApproved = balance.tokens[item.token]?.allowance[item.contractAddress];
      if (!tokenApproved) {
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
        step: 'compound',
        message: 'Confirm compound transaction on wallet to complete.',
        action: () => dispatch(reduxActions.wallet.compound(item.network, item.contractAddress)),
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

  return (
    <Grid container className={classes.bonusEarningsInner}>
      <Steps item={stepsItem} steps={steps} handleClose={handleClose} />
      <Grid item xs={6}>
        <Typography className={classes.myDetailsText} align={'left'} style={{ marginBottom: 0 }}>
          <Trans i18nKey="myBonusEarnings" />
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography className={classes.myDetailsValue} align={'right'} style={{ marginBottom: 0 }}>
          {formatDecimals(item.earned)} {item.bonusToken} ($
          {formatDecimals(item.earned.multipliedBy(prices.prices[item.bonusToken]), 2)})
        </Typography>
      </Grid>
      {item.boostToken ? (
        <React.Fragment>
          <Grid item xs={6}>
            <Typography
              className={classes.myDetailsText}
              align={'left'}
              style={{ marginTop: '16px' }}
            >
              <Trans i18nKey="myBoostEarnings" />
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              className={classes.myDetailsValue}
              align={'right'}
              style={{ marginTop: '16px' }}
            >
              {formatDecimals(item.boosted)} {item.boostToken} ($
              {formatDecimals(item.boosted.multipliedBy(prices.prices[item.boostToken]), 2)})
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.myPotsInfoText} align={'left'}>
              <Trans
                i18nKey="bonusExtraInfo"
                values={{
                  bonusToken: item.bonusToken,
                  boostToken: item.boostToken,
                }}
              />
            </Typography>
          </Grid>
        </React.Fragment>
      ) : (
        ''
      )}
      <Grid item xs={12} className={classes.bonusExplainerRow}>
        <Typography className={classes.explainerText}>
          {t('bonusExplainer', { tokens: getItemBonusTokens(item) })}
        </Typography>
      </Grid>
      {itemSupportsCompound(item) ? (
        <>
          <Grid item xs={12} className={classes.bonusCompoundRow}>
            <Button
              onClick={() => handleCompoundBonus(item)}
              className={classes.actionBtn}
              variant={'contained'}
              disabled={item.earned.lte(0)}
            >
              {t('buttons.compoundToken', { token: item.token })}
            </Button>
            <Typography className={classes.explainerText}>
              {t('compoundExplainer', { token: item.token })}
            </Typography>
          </Grid>
        </>
      ) : null}
      <Grid item xs={12}>
        <Button
          onClick={() => handleWithdrawBonus(item)}
          className={classes.altActionBtn}
          fullWidth={true}
          disabled={item.earned.lte(0)}
        >
          {t('buttons.withdrawBonusTokens', {
            tokens: getItemBonusTokens(item),
          })}
        </Button>
      </Grid>
    </Grid>
  );
};

export default PotBonus;
