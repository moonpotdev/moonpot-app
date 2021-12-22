import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, makeStyles } from '@material-ui/core';
import reduxActions from '../../redux/actions';
import BigNumber from 'bignumber.js';
import { isEmpty } from '../../../helpers/utils';
import { byDecimals } from '../../../helpers/format';
import NoPotsCard from './components/NoPotsCard/NoPotsCard';
import Pot from './components/Pot/Pot';
import { Cards } from '../../../components/Cards';
import styles from './styles';
import { ClaimableBonusNotification } from '../../../components/ClaimableBonusNotification';
import { MigrationNotices } from '../Moonpots/components/MigrationNotices/MigrationNotices';

const useStyles = makeStyles(styles);

const MyPots = ({ selected, bottom }) => {
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

      if (item.vaultType !== bottom && bottom !== 'all') {
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
  }, [selected, vault.pools, tokenBalances, walletAddress, bottom]);

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
        <div className={classes.potsContainer}>
          <div className={classes.spacer}>
            {selected === 'active' ? (
              <>
                <MigrationNotices potType="all" />
                <ClaimableBonusNotification className={classes.claimableBonuses} />
              </>
            ) : null}
            <Cards sameHeight={false}>
              {filtered.length === 0 ? (
                <NoPotsCard selected={selected} />
              ) : (
                filtered.map(item => <Pot key={item.id} item={item} />)
              )}
            </Cards>
          </div>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default MyPots;
