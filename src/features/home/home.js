import React, { useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Box, Container, Grid, Link, makeStyles, Typography } from '@material-ui/core';
import styles from './styles';
import Filter from './components/Filter';
import { Trans } from 'react-i18next';
import reduxActions from '../redux/actions';
import { MigrationNotices } from './components/MigrationNotices/MigrationNotices';
import ZiggyMaintenance from '../../images/ziggy/maintenance.svg';
import SocialMediaBlock from './components/SocialMediaBlock/SocialMediaBlock';
import { useFilterConfig, useFilteredPots } from './hooks/filter';
import { Pot } from './components/Pot/Pot';
import BeefyCow from '../../images/beefy.svg';

const useStyles = makeStyles(styles);

const Home = () => {
  const dispatch = useDispatch();
  const pricesLastUpdated = useSelector(state => state.pricesReducer.lastUpdated);
  const totalPrizesAvailable = useSelector(state => state.vaultReducer.totalPrizesAvailable);
  const pots = useSelector(state => state.vaultReducer.pools, shallowEqual);
  const classes = useStyles();
  const [filterConfig, setFilterConfig] = useFilterConfig();
  const filtered = useFilteredPots(pots, filterConfig);
  const totalPrizesAvailableFormatted = useMemo(() => {
    return totalPrizesAvailable.toNumber().toLocaleString(undefined, {
      maximumFractionDigits: 0,
    });
  }, [totalPrizesAvailable]);

  useEffect(() => {
    if (pricesLastUpdated > 0) {
      dispatch(reduxActions.vault.fetchPools());
    }
  }, [dispatch, pricesLastUpdated]);

  return (
    <Container maxWidth="xl">
      <Typography className={classes.mainTitle}>
        <Trans i18nKey="homeTitle" values={{ amount: totalPrizesAvailableFormatted }} />
      </Typography>
      <Filter config={filterConfig} setConfig={setFilterConfig} className={classes.potsFilter} />
      <MigrationNotices potType={filterConfig.vault} className={classes.potsMigrationNotice} />
      <div className={classes.potList}>
        <div className={classes.potListInner}>
          {filtered.map(pot => <Pot key={pot.id} id={pot.id} />)}
        </div>
      </div>
      {filterConfig.vault === 'community' && filtered.length === 0 ? (
        <Grid item xs={12}>
          <Grid container className={classes.communityJoin}>
            <Grid item xs={12}>
              <Box className={classes.ziggyMaintenance}>
                <img alt="" width="100" height="100" src={ZiggyMaintenance} aria-hidden={true} />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.communityTitle}>
                <Trans i18nKey="homeJoinCommunityTitle" />
              </Typography>
              <Typography className={classes.communityDescription}>
                <Trans i18nKey="homeJoinCommunityBody" />
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
      <Box className={classes.poweredBy}>
        <div className={classes.poweredByItem}>
          <Trans i18nKey="footerPoweredBy" />
        </div>
        <div className={classes.poweredByItem}>
          <Link href={'https://www.beefy.finance'} target="_blank" rel="noreferrer"
                className={classes.beefyLink}>Beefy.Finance</Link>
        </div>
        <div className={classes.poweredByItem}>
          <img alt="" aria-hidden={true} src={BeefyCow} width={20} height={15.2} className={classes.beefyLogo} />
        </div>
      </Box>
    </Container>
  );
};

export default Home;
