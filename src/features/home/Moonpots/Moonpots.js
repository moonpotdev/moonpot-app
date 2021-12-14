import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import styles from './styles';
import Filter from './components/Filter';
import reduxActions from '../../redux/actions';
import { MigrationNotices } from './components/MigrationNotices/MigrationNotices';
import ZiggyMaintenance from '../../../images/ziggy/maintenance.svg';
import SocialMediaBlock from './components/SocialMediaBlock/SocialMediaBlock';
import { useFilterConfig, useFilteredPots } from './hooks/filter';
import { Pot } from './components/Pot';
import { Cards } from '../../../components/Cards';
import { Translate } from '../../../components/Translate';
import SidePotExplainer from '../../../components/SidePotExplainer/SidePotExplainer';

const useStyles = makeStyles(styles);

const Moonpots = ({ selected }) => {
  const dispatch = useDispatch();
  const pricesLastUpdated = useSelector(state => state.pricesReducer.lastUpdated);
  const address = useSelector(state => state.walletReducer.address);
  const pots = useSelector(state => state.vaultReducer.pools, shallowEqual);
  const classes = useStyles();
  const [filterConfig] = useFilterConfig();
  const filtered = useFilteredPots(pots, selected, filterConfig);

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
    <React.Fragment>
      <Filter selected={selected} />
      <div className={classes.potsContainer}>
        <div className={classes.spacer}>
          <MigrationNotices potType={selected} className={classes.potsMigrationNotice} />
          {selected === 'side' ? <SidePotExplainer /> : null}
          <Cards>
            {filtered.map(pot => (
              <Pot key={pot.id} variant={'tealLight'} id={pot.id} />
            ))}
          </Cards>
          {selected === 'community' ? (
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
          {/*<PoweredByBeefy className={classes.poweredBy} />*/}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Moonpots;
