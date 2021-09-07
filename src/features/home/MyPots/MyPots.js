import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import reduxActions from '../../redux/actions';
import BigNumber from 'bignumber.js';
import { isEmpty } from '../../../helpers/utils';
import { byDecimals } from '../../../helpers/format';
import NoPotsCard from './components/NoPotsCard/NoPotsCard';
import Pot from './components/Pot/Pot';
import { Cards } from '../../../components/Cards';
import styles from './styles';
import { RoutedButton } from '../../../components/Buttons/BaseButton';
import clsx from 'clsx';

const useStyles = makeStyles(styles);

const MyPots = ({ selected }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { vault, wallet, balance, prices, earned } = useSelector(state => ({
    vault: state.vaultReducer,
    wallet: state.walletReducer,
    balance: state.balanceReducer,
    prices: state.pricesReducer,
    earned: state.earnedReducer,
  }));
  const dispatch = useDispatch();

  const filtered = useMemo(() => {
    let data = [];

    const check = item => {
      if (item.status !== selected) {
        return false;
      }

      if (Number(balance.tokens[item.contractAddress].balance) === 0) {
        return false;
      }

      return item;
    };

    for (const [, item] of Object.entries(vault.pools)) {
      if (check(item)) {
        if (wallet.address && !isEmpty(balance.tokens[item.contractAddress])) {
          item.userBalance = byDecimals(
            new BigNumber(balance.tokens[item.contractAddress].balance),
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

    return data;
  }, [selected, vault.pools, balance, earned, wallet.address]);

  useEffect(() => {
    if (prices.lastUpdated > 0) {
      dispatch(reduxActions.vault.fetchPools());
    }
  }, [dispatch, prices.lastUpdated]);

  useEffect(() => {
    if (wallet.address) {
      dispatch(reduxActions.balance.fetchBalances());
      dispatch(reduxActions.earned.fetchEarned());
    }
  }, [dispatch, wallet.address]);

  return (
    <React.Fragment>
      <Container maxWidth="none" style={{ padding: '0' }}>
        <Grid container spacing={2}>
          <Grid item>
            <RoutedButton
              className={clsx(classes.button, { [classes.buttonActive]: selected === 'active' })}
              to="/my-moonpots"
            >
              {t('buttons.myActivePots')}
            </RoutedButton>
          </Grid>
          <Grid item>
            <RoutedButton
              className={clsx(classes.button, { [classes.buttonActive]: selected === 'eol' })}
              to="/my-moonpots/eol"
            >
              {t('buttons.myPastPots')}
            </RoutedButton>
          </Grid>
        </Grid>

        <div className={classes.potsContainer}>
          <div className={classes.spacer}>
            <Grid container>
              {/*Pots*/}
              <Cards sameHeight={false}>
                {filtered.length === 0 ? (
                  <NoPotsCard />
                ) : (
                  filtered.map(item => (
                    <Pot
                      key={item.id}
                      item={item}
                      wallet={wallet}
                      prices={prices}
                      balance={balance}
                    />
                  ))
                )}
              </Cards>
            </Grid>
          </div>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default MyPots;
