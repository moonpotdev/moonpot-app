import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import reduxActions from '../../redux/actions';
import Pot from './components/Pot/Pot';
import { Cards } from '../../../components/Cards';
import { ClaimableBonusNotification } from '../../../components/ClaimableBonusNotification';
import { MigrationNotices } from '../Moonpots/components/MigrationNotices/MigrationNotices';
import { useFilterConfig, useFilteredPots } from '../../filter/hooks';
import { useWalletConnected } from '../../wallet/hooks';
import { NoPotsMatchFilter } from '../components/NoPotsMatchFilter';
import { NoPotsNotConnected } from '../components/NoPotsNotConnected';
import styles from './styles';

const useStyles = makeStyles(styles);

const MyPots = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const pricesLastUpdated = useSelector(state => state.prices.lastUpdated);
  const [address] = useWalletConnected();
  const { status } = useFilterConfig();
  const filteredIds = useFilteredPots();

  useEffect(() => {
    if (pricesLastUpdated > 0) {
      dispatch(reduxActions.vault.fetchPools());
    }
  }, [dispatch, pricesLastUpdated]);

  useEffect(() => {
    if (address) {
      dispatch(reduxActions.balance.fetchBalances());
      dispatch(reduxActions.earned.fetchEarned());
    }
  }, [dispatch, address]);

  return (
    <div className={classes.potsContainer}>
      {status === 'active' && address ? (
        <>
          <MigrationNotices />
          <ClaimableBonusNotification className={classes.claimableBonuses} />
        </>
      ) : null}

      {filteredIds.length ? (
        <Cards sameHeight={false} justifyContent="flex-start">
          {filteredIds.map(id => (
            <Pot key={id} id={id} />
          ))}
        </Cards>
      ) : null}

      {filteredIds.length === 0 && !address ? <NoPotsNotConnected /> : null}
      {filteredIds.length === 0 && address ? <NoPotsMatchFilter /> : null}
    </div>
  );
};

export default memo(MyPots);
