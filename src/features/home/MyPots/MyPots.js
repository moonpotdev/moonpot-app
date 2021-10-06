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
import { ClaimableBonusNotification } from '../../../components/ClaimableBonusNotification';

const useStyles = makeStyles(styles);

const MyPots = ({ selected }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { vault, prices } = useSelector(state => ({
    vault: state.vaultReducer,
    prices: state.pricesReducer,
  }));
  const walletAddress = useSelector(state => state.walletReducer.address);
  const tokenBalances = useSelector(state => state.balanceReducer.tokens);
  const dispatch = useDispatch();

  const filtered = useMemo(() => {
    let data = [];

    const check = item => {
      if (item.status !== selected) {
        return false;
      }

      if (Number(tokenBalances[item.contractAddress + ':total'].balance) === 0) {
        return false;
      }

      return item;
    };

    for (const [, item] of Object.entries(vault.pools)) {
      if (check(item)) {
        if (walletAddress && !isEmpty(tokenBalances[item.contractAddress + ':total'])) {
          item.userBalance = byDecimals(
            new BigNumber(tokenBalances[item.contractAddress + ':total'].balance),
            item.tokenDecimals
          );
        }
        data.push(item);
      }
    }

    return data;
  }, [selected, vault.pools, tokenBalances, walletAddress]);

  useEffect(() => {
    if (prices.lastUpdated > 0) {
      dispatch(reduxActions.vault.fetchPools());
    }
  }, [dispatch, prices.lastUpdated]);

  useEffect(() => {
    if (walletAddress) {
      dispatch(reduxActions.balance.fetchBalances());
      dispatch(reduxActions.earned.fetchEarned());
    }
  }, [dispatch, walletAddress]);

  return (
    <React.Fragment>
      <Container maxWidth={false} style={{ padding: '0' }}>
        <Grid container spacing={2}>
          <Grid item>
            <RoutedButton
              className={clsx(classes.button, { [classes.buttonActive]: selected === 'active' })}
              to={{ pathname: '/my-moonpots', state: { tabbed: true } }}
            >
              {t('buttons.myActivePots')}
            </RoutedButton>
          </Grid>
          <Grid item>
            <RoutedButton
              className={clsx(classes.button, { [classes.buttonActive]: selected === 'eol' })}
              to={{ pathname: '/my-moonpots/eol', state: { tabbed: true } }}
            >
              {t('buttons.myPastPots')}
            </RoutedButton>
          </Grid>
        </Grid>

        <div className={classes.potsContainer}>
          <div className={classes.spacer}>
            <Grid container>
              {selected === 'active' ? (
                <ClaimableBonusNotification className={classes.claimableBonuses} />
              ) : null}
              <Cards sameHeight={false}>
                {filtered.length === 0 ? (
                  <NoPotsCard selected={selected} />
                ) : (
                  filtered.map(item => <Pot key={item.id} item={item} />)
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
