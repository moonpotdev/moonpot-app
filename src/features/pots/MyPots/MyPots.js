import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, makeStyles } from '@material-ui/core';
import reduxActions from '../../redux/actions';
import NoPotsCard from './components/NoPotsCard/NoPotsCard';
import Pot from './components/Pot/Pot';
import { Cards } from '../../../components/Cards';
import styles from './styles';
import { ClaimableBonusNotification } from '../../../components/ClaimableBonusNotification';
import { MigrationNotices } from '../Moonpots/components/MigrationNotices/MigrationNotices';
import { selectWalletAddress } from '../../wallet/selectors';
import { useFilteredPots } from '../../filter/hooks';

const useStyles = makeStyles(styles);

const MyPots = ({ potStatus, sort }) => {
  const classes = useStyles();
  const pricesLastUpdated = useSelector(state => state.prices.lastUpdated);
  const walletAddress = useSelector(selectWalletAddress);
  const dispatch = useDispatch();
  const filteredIds = useFilteredPots();

  useEffect(() => {
    if (pricesLastUpdated > 0) {
      dispatch(reduxActions.vault.fetchPools());
    }
  }, [dispatch, pricesLastUpdated]);

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
            {potStatus === 'active' ? (
              <>
                <MigrationNotices potType="all" />
                <ClaimableBonusNotification className={classes.claimableBonuses} />
              </>
            ) : null}
            <Cards sameHeight={false} justifyContent="flex-start">
              {filteredIds.length === 0 ? (
                <NoPotsCard selected={potStatus} />
              ) : (
                filteredIds.map(id => <Pot key={id} id={id} />)
              )}
            </Cards>
          </div>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default MyPots;
