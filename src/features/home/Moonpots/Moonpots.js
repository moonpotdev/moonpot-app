import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import styles from './styles';
import reduxActions from '../../redux/actions';
import { MigrationNotices } from './components/MigrationNotices/MigrationNotices';
import ZiggyMaintenance from '../../../images/ziggy/maintenance.svg';
import SocialMediaBlock from './components/SocialMediaBlock/SocialMediaBlock';
import { useFilterConfig, useFilteredPots, useSortKey } from './hooks/filter';
import { Pot } from './components/Pot';
import { Cards } from '../../../components/Cards';
import { Translate } from '../../../components/Translate';
import SidePotExplainer from '../../../components/SidePotExplainer/SidePotExplainer';

const useStyles = makeStyles(styles);

const Moonpots = ({ selectedCategory, sort }) => {
  const dispatch = useDispatch();
  const pricesLastUpdated = useSelector(state => state.prices.lastUpdated);
  const address = useSelector(state => state.wallet.address);
  //cannot use shallowEqual as we need the page to reevaluate the sort once the apy/prize/draw data loads
  const pots = useSelector(state => state.vault.pools);
  const classes = useStyles();
  const [filterConfig, setFilterConfig] = useFilterConfig();
  const filtered = useFilteredPots(pots, selectedCategory, filterConfig);
  const [sortKey, sortDir] = useSortKey(sort);

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

  useEffect(() => {
    if (sortKey !== filterConfig.sortKey || sortDir !== filterConfig.sortDir) {
      setFilterConfig({ ...filterConfig, sortKey, sortDir });
    }
  }, [filterConfig, setFilterConfig, sortKey, sortDir, pots]);

  return (
    <React.Fragment>
      <div className={classes.potsContainer}>
        <div className={classes.spacer}>
          <MigrationNotices
            selectedCategory={selectedCategory}
            className={classes.potsMigrationNotice}
          />
          {selectedCategory === 'side' ? <SidePotExplainer /> : null}
          <Cards justifyContent="flex-start">
            {filtered.map(pot => (
              <Pot key={pot.id} variant={'tealLight'} id={pot.id} />
            ))}
          </Cards>
          {selectedCategory === 'community' ? (
            <Grid item xs={12} style={{ marginTop: '32px' }}>
              <Grid container className={classes.communityJoin}>
                <Grid item xs={12}>
                  <Box className={classes.ziggyMaintenance}>
                    <img
                      alt=""
                      width="100"
                      height="100"
                      src={ZiggyMaintenance}
                      aria-hidden={true}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography className={classes.communityTitle}>
                    <Translate i18nKey="homeJoinCommunityTitle" />
                  </Typography>
                  <Typography className={classes.communityDescription}>
                    <Translate i18nKey="homeJoinCommunityBody" />
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.socialMediaSection}>
                <Grid item xs={12} md={3}>
                  <SocialMediaBlock type="telegram" />
                </Grid>
                <Grid item xs={12} md={3}>
                  <SocialMediaBlock type="discord" />
                </Grid>
                <Grid item xs={12} md={3}>
                  <SocialMediaBlock type="twitter" />
                </Grid>
              </Grid>
            </Grid>
          ) : null}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Moonpots;
