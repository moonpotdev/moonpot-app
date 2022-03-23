import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import styles from './styles';
import reduxActions from '../../redux/actions';
import { MigrationNotices } from './components/MigrationNotices/MigrationNotices';
import { Pot } from './components/Pot';
import { Cards } from '../../../components/Cards';
import { selectWalletAddress } from '../../wallet/selectors';
import { useFilterConfig, useFilteredPots } from '../../filter/hooks';
import { NoPotsMatchFilter } from '../components/NoPotsMatchFilter';

const useStyles = makeStyles(styles);

const Moonpots = () => {
  const dispatch = useDispatch();
  const pricesLastUpdated = useSelector(state => state.prices.lastUpdated);
  const address = useSelector(selectWalletAddress);
  const classes = useStyles();
  const filterConfig = useFilterConfig();
  const filteredIds = useFilteredPots();

  useEffect(() => {
    if (pricesLastUpdated > 0) {
      dispatch(reduxActions.vault.fetchPools());
    }
  }, [dispatch, pricesLastUpdated]);

  useEffect(() => {
    if (address) {
      dispatch(reduxActions.balance.fetchBalances());
    }
  }, [dispatch, address]);

  return (
    <div className={classes.potsContainer}>
      <div className={classes.spacer}>
        <MigrationNotices
          selectedCategory={filterConfig.category}
          className={classes.potsMigrationNotice}
        />
        {filteredIds.length === 0 ? (
          <NoPotsMatchFilter />
        ) : (
          <Cards justifyContent="flex-start">
            {filteredIds.map(id => (
              <Pot key={id} variant={'tealLight'} id={id} />
            ))}
          </Cards>
        )}
      </div>
    </div>
  );
};

export default memo(Moonpots);
