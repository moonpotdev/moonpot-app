import * as React from "react";
import { useLocation } from "react-router";
import { useHistory } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import AnimateHeight from 'react-animate-height';
import {Button, Box, Link, Container, Grid, makeStyles, Typography, Divider} from "@material-ui/core"
import styles from "./styles"
import Filter from "./components/Filter";
import {Trans, useTranslation} from "react-i18next";
import {ExpandMore, ExpandLess} from '@material-ui/icons';
import { investmentOdds } from "../../helpers/utils";
import reduxActions from "../redux/actions";
import {calculateTotalPrize} from "../../helpers/format";
import BigNumber from "bignumber.js";
import Countdown from "../../components/Countdown";

const useStyles = makeStyles(styles);
const defaultFilter = {
    key: 'tvl',
    direction: 'desc',
    deposited: false,
    vault: 'main', // main or community
    retired: false,
}

const Home = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const dispatch = useDispatch();
    const {vault, prices} = useSelector(state => ({
        vault: state.vaultReducer,
        prices: state.pricesReducer,
    }));

    const history = useHistory();
    const classes = useStyles();
    const storage = localStorage.getItem('homeSortConfig');
    const [sortConfig, setSortConfig] = React.useState(storage === null ? defaultFilter : JSON.parse(storage));
    const [filtered, setFiltered] = React.useState([]);
    const [prizeSplitOpen, setPrizeSplitOpen] = React.useState(location.prizeSplitOpen);

    React.useEffect(() => {
        localStorage.setItem('homeSortConfig', JSON.stringify(sortConfig));

        let data = [];

        const sorted = (items) => {
            return items.sort((a, b) => {
                if(sortConfig.key === 'name') {
                    if (a[sortConfig.key].toUpperCase() < b[sortConfig.key].toUpperCase()) {
                        return sortConfig.direction === 'asc' ? -1 : 1;
                    }
                    if (a[sortConfig.key].toUpperCase() > b[sortConfig.key].toUpperCase()) {
                        return sortConfig.direction === 'asc' ? 1 : -1;
                    }
                    return 0;
                } else {
                    return sortConfig.direction === 'asc' ? (a[sortConfig.key] - b[sortConfig.key]) : (b[sortConfig.key] - a[sortConfig.key]);
                }
            });
        }
        const check = (item) => {
            if(item.status !== (sortConfig.retired ? 'eol' : 'active')) {
                return false;
            }

            if(sortConfig.deposited && item.deposited === 0) {
                return false;
            }

            if(sortConfig.vault !== 'all' && sortConfig.vault !== item.vaultType) {
                return false;
            }

            return item;
        }

        for (const [, item] of Object.entries(vault.pools)) {
            if(check(item)) {
                data.push(item);
            }
        }

        if (sortConfig !== null) {
            data = sorted(data);
        }

        setFiltered(data);

    }, [sortConfig, vault.pools]);

    React.useEffect(() => {
        if(prices.lastUpdated > 0) {
            dispatch(reduxActions.vault.fetchPools());
        }
    }, [dispatch, prices.lastUpdated]);

    return (
        <React.Fragment>
            <Container maxWidth="xl">
                <Typography className={classes.h1}>
                    <Trans i18nKey="homeTitle" values={{amount: vault.totalPrizesAvailable.toFixed(0)}} />
                </Typography>
                <Box>
                    <Filter sortConfig={sortConfig} setSortConfig={setSortConfig} defaultFilter={defaultFilter} />
                    <Grid container>
                        {filtered.length === 0 ? '' : (
                            filtered.map(item => (
                                <React.Fragment key={item.id}>
                                    <Box className={classes.potItem}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={4}>
                                                <Box className={classes.potImage}>
                                                    <img
                                                        alt="Moonpot"
                                                        srcSet="
                                                    images/pots/sponsored/cake@4x.png 4x,
                                                    images/pots/sponsored/cake@3x.png 3x,
                                                    images/pots/sponsored/cake@2x.png 2x,
                                                    images/pots/sponsored/cake@1x.png 1x
                                                "
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid item xs={7}>
                                                <Typography className={classes.potUsdTop} align={"right"}><span>{t('win')}</span> {calculateTotalPrize(item, prices)}</Typography>
                                                <Typography className={classes.potUsd} align={"right"}><span>{t('in')}</span> {item.token} <span>{t('and')}</span> {item.sponsorToken}</Typography>
                                                <Typography className={classes.potCrypto} align={"right"}>USD {t('value')} {t('prize')}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography className={classes.subTitle}>{t('nextWeeklyDraw')}</Typography>
                                                <Typography className={classes.countdown}><Countdown expiresAt={item.expiresAt*1000} /></Typography>
                                            </Grid>
                                            <Grid item xs={5}>
                                                <Typography className={classes.subTitle} align={'right'}>{t('interest')}</Typography>
                                                <Typography className={classes.apy} align={'right'}><span>{item.apy}%</span> {item.bonusApy > 0 ? new BigNumber(item.apy).plus(item.bonusApy).toFixed(2) : item.apy}% APY</Typography>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Divider className={classes.divider}/>
                                            </Grid>
                                            <Grid item xs={9} align={"left"} style={{paddingBottom: 0}}>
                                                <Typography className={classes.prizeSplitText} onClick={() => {setPrizeSplitOpen(!prizeSplitOpen)}}>{t('prizeSplit')} </Typography>
                                            </Grid>
                                            <Grid item xs={2} align={"right"} style={{paddingBottom: 0}}>
                                                <Link className={classes.expandToggle} onClick={() => {setPrizeSplitOpen(!prizeSplitOpen)}}>{prizeSplitOpen ? (<ExpandLess />) : (<ExpandMore />)}</Link>
                                            </Grid>
                                            <Grid item xs={11} style={{padding: 0}}>
                                                <AnimateHeight duration={ 500 } height={ prizeSplitOpen ? 'auto' : 0 }>
                                                    <Grid container spacing={1}>
                                                        <Grid item xs={3} align={"left"}>
                                                            <Typography className={classes.prizeSplitWinners}>5 winners</Typography>
                                                        </Grid>
                                                        <Grid item xs={9} align={"right"}>
                                                            <Typography className={classes.prizeSplitValue}>
                                                                <span>{item.awardBalance.times(0.2).toFixed(3)} {item.token}</span> and <span>{item.sponsorBalance.times(0.2).toFixed(3)} {item.sponsorToken}</span> each
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </AnimateHeight>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Divider className={classes.divider}/>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Button className={classes.play} variant={'contained'} onClick={() => {history.push('/pot/' + (item.id))}}>{t('buttons.playWith')} {item.token}</Button>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography className={classes.oddsPerDeposit}>{t('oddsPerDeposit', {odds: investmentOdds(item.totalStakedUsd, BigNumber(1000), item.numberOfWinners), amount: '$1000'})}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Grid item xs={12}>
                                        <Typography className={classes.beefy}>{t('footerPoweredBy')} <Link href={"https://beefy.finance"}>Beefy.Finance</Link>
                                            <img
                                                alt="Beefy Finance"
                                                srcSet="
                                        images/beefy/beefy-finance-bifi-logo@4x.png 4x,
                                        images/beefy/beefy-finance-bifi-logo@3x.png 3x,
                                        images/beefy/beefy-finance-bifi-logo@2x.png 2x,
                                        images/beefy/beefy-finance-bifi-logo@1x.png 1x
                                    "
                                            />
                                        </Typography>
                                    </Grid>
                                </React.Fragment>
                            ))
                        )}
                        {sortConfig.vault === 'community' ? (
                            <Box className={classes.communityItem}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Box className={classes.ziggyMaintenance}>
                                            <img alt="Ziggy Maintenance" height="100px" src={require('../../images/ziggy/maintenance.svg').default} />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography className={classes.communityTitle}>
                                            <Trans i18nKey="homeJoinCommunityTitle"/>
                                        </Typography>
                                        <Typography className={classes.communityDescription}>
                                            <Trans i18nKey="homeJoinCommunityBody" />
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        ) : ''}
                    </Grid>
                </Box>
            </Container>
        </React.Fragment>
    );
};

export default Home;
