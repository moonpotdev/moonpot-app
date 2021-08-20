import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import reduxActions from '../redux/actions';
import BigNumber from 'bignumber.js';
import { isEmpty } from '../../helpers/utils';
import { byDecimals } from '../../helpers/format';
import Steps from '../vault/components/Steps';
import NoPotsCard from './components/NoPotsCard/NoPotsCard';
import Pot from './components/Pot/Pot';

const VALID_STATUSES = ['active', 'eol'];
const defaultFilter = {
  status: 'active',
};
const getDefaultFilter = (params = {}) => {
  if ('status' in params && VALID_STATUSES.includes(params.status)) {
    return { ...defaultFilter, status: params.status };
  }

  return defaultFilter;
};

const Dashboard = () => {
  const { t } = useTranslation();
  const { vault, wallet, balance, prices, earned } = useSelector(state => ({
    vault: state.vaultReducer,
    wallet: state.walletReducer,
    balance: state.balanceReducer,
    prices: state.pricesReducer,
    earned: state.earnedReducer,
  }));
  const params = useParams();
  const dispatch = useDispatch();
  const [sortConfig, setSortConfig] = React.useState(getDefaultFilter(params));
  const [filtered, setFiltered] = React.useState([]);
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

  React.useEffect(() => {
    let data = [];

    const sorted = items => {
      return items.sort((a, b) => {
        if (sortConfig.key === 'name') {
          if (a[sortConfig.key].toUpperCase() < b[sortConfig.key].toUpperCase()) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (a[sortConfig.key].toUpperCase() > b[sortConfig.key].toUpperCase()) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
        } else {
          return sortConfig.direction === 'asc'
            ? a[sortConfig.key] - b[sortConfig.key]
            : b[sortConfig.key] - a[sortConfig.key];
        }
      });
    };
    const check = item => {
      if (item.status !== sortConfig.status) {
        return false;
      }

      if (Number(balance.tokens[item.rewardToken].balance) === 0) {
        return false;
      }

      return item;
    };

    for (const [, item] of Object.entries(vault.pools)) {
      if (check(item)) {
        if (wallet.address && !isEmpty(balance.tokens[item.rewardToken])) {
          item.userBalance = byDecimals(
            new BigNumber(balance.tokens[item.rewardToken].balance),
            item.tokenDecimals
          );
        }
        if (wallet.address && !isEmpty(earned.earned[item.id])) {
          const amount = earned.earned[item.id][item.bonusToken] ?? 0;
          const boostAmount = earned.earned[item.id][item.boostToken] ?? 0;
          item.earned = byDecimals(new BigNumber(amount), item.bonusTokenDecimals);
          item.boosted = byDecimals(new BigNumber(boostAmount), item.boostTokenDecimals);
        }
        data.push(item);
      }
    }

    if (sortConfig !== null) {
      data = sorted(data);
    }

    setFiltered(data);
  }, [sortConfig, vault.pools, balance, earned, wallet.address]);

  React.useEffect(() => {
    if (prices.lastUpdated > 0) {
      dispatch(reduxActions.vault.fetchPools());
    }
  }, [dispatch, prices.lastUpdated]);

  React.useEffect(() => {
    if (wallet.address) {
      dispatch(reduxActions.balance.fetchBalances());
      dispatch(reduxActions.earned.fetchEarned());
    }
  }, [dispatch, wallet.address]);

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
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant={'outlined'}
              color={sortConfig.status === 'active' ? 'primary' : 'default'}
              onClick={() => setSortConfig({ ...sortConfig, status: 'active' })}
            >
              {t('buttons.myActivePots')}
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant={'outlined'}
              color={sortConfig.status !== 'active' ? 'primary' : 'default'}
              onClick={() => setSortConfig({ ...sortConfig, status: 'eol' })}
            >
              {t('buttons.myPastPots')}
            </Button>
          </Grid>
        </Grid>
        <Grid container>
          <Steps item={stepsItem} steps={steps} handleClose={handleClose} />
          {/*No Active Pots Layout*/}
          {filtered.length === 0 ? <NoPotsCard /> : filtered.map(item => <Pot item={item} />)}
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default Dashboard;
