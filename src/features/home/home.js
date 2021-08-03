import * as React from 'react';
import {useLocation} from 'react-router';
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import AnimateHeight from 'react-animate-height';
import {Box, Button, Container, Divider, Grid, Link, makeStyles, Typography} from '@material-ui/core';
import styles from './styles';
import Filter from './components/Filter';
import {Trans, useTranslation} from 'react-i18next';
import {ExpandLess, ExpandMore} from '@material-ui/icons';
import {investmentOdds} from '../../helpers/utils';
import reduxActions from '../redux/actions';
import {calculateTotalPrize} from '../../helpers/format';
import BigNumber from 'bignumber.js';
import {MigrationNotices} from './components/MigrationNotices/MigrationNotices';
import ZiggyMaintenance from '../../images/ziggy/maintenance.svg';
import Countdown from '../../components/Countdown';
import SocialMediaBlock from './components/SocialMediaBlock/SocialMediaBlock';

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
    const walletReducer = useSelector(state => state.walletReducer);
    const {vault, prices, balance} = useSelector(state => ({
        vault: state.vaultReducer,
        prices: state.pricesReducer,
        balance: state.balanceReducer,
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
                    <Trans i18nKey="homeTitle" values={{amount: new BigNumber(vault.totalPrizesAvailable).toFixed(0).toLocaleString()}} />
                </Typography>
                <Box>
                    <Filter sortConfig={sortConfig} setSortConfig={setSortConfig} defaultFilter={defaultFilter} />
                    <MigrationNotices sortConfig={sortConfig} />
                    <Grid container>
                        {filtered.length === 0 ? '' : (
                            filtered.map(item => (
                                <React.Fragment key={item.id}>
                                    <Box className={classes.potItem}>
                                        <Grid container>
                                            <Grid item xs={4}>
                                                <Box className={classes.potImage}>
                                                        <img 
                                                        alt={`Moonpot ${item.sponsorToken}`}
                                                        srcSet={`
                                                            images/pots/${item.token.toLowerCase()}/sponsored/${item.sponsorToken.toLowerCase()}@4x.png 4x,
                                                            images/pots/${item.token.toLowerCase()}/sponsored/${item.sponsorToken.toLowerCase()}@3x.png 3x,
                                                            images/pots/${item.token.toLowerCase()}/sponsored/${item.sponsorToken.toLowerCase()}@2x.png 2x,
                                                            images/pots/${item.token.toLowerCase()}/sponsored/${item.sponsorToken.toLowerCase()}@1x.png 1x
                                                        `}
                                                        />
                                                </Box>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography className={classes.potUsdTop} align={"right"}><span>{t('win')}</span> ${Number((calculateTotalPrize(item, prices)).substring(1)).toLocaleString()}</Typography>
                                                <Typography className={classes.potUsd} align={"right"}><span>{t('in')}</span> {item.token} <span>{t('and')}</span> {item.sponsorToken}</Typography>
                                                <Typography className={classes.potCrypto} align={"right"}>USD {t('value')} {t('prize')}</Typography>
                                            </Grid>
                                            <Grid item xs={6} style={{paddingRight: '8px'}}>
                                                <Typography className={classes.subTitle}>{t('nextWeeklyDraw')}</Typography>
                                                <Typography className={classes.countdown}><Countdown until={item.expiresAt*1000} /></Typography>
                                            </Grid>
                                            <Grid item xs={6} style={{paddingLeft: '8px'}}>
                                                <Typography className={classes.subTitle} align={'right'}>{t('interest')}</Typography>
                                                <Typography className={classes.apy} align={'right'}>{item.bonusApy > 0 ? new BigNumber(item.apy).plus(item.bonusApy).toFixed(2) : item.apy}% APY</Typography>
                                            </Grid>
                                            <Grid item xs={12} style={{paddingRight: '8px'}}>
                                                <Typography className={classes.subTitle}>{t('tvl')}</Typography>
                                                <Typography className={classes.potDataPoint}>{item.tvl}</Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Divider className={classes.divider} style={{marginBottom:'16px'}}/>
                                            </Grid>
                                            <Grid item xs={9} align={"left"} style={{paddingBottom: 0}}>
                                                <Typography className={classes.prizeSplitText} onClick={() => {setPrizeSplitOpen(!prizeSplitOpen)}}>{t('prizeSplit')} </Typography>
                                            </Grid>
                                            <Grid item xs={3} align={"right"} style={{paddingBottom: 0}}>
                                                <Link className={classes.expandToggle} onClick={() => {setPrizeSplitOpen(!prizeSplitOpen)}}>{prizeSplitOpen ? (<ExpandLess />) : (<ExpandMore />)}</Link>
                                            </Grid>
                                            <Grid item xs={12} style={{padding: 0}}>
                                                <AnimateHeight duration={ 500 } height={ prizeSplitOpen ? 'auto' : 0 }>
                                                    <Grid container spacing={1}>
                                                        <Grid item xs={3} align={"left"}>
                                                            <Typography className={classes.prizeSplitWinners}>5 winners</Typography>
                                                        </Grid>
                                                        <Grid item xs={9} align={"right"}>
                                                            <Typography className={classes.prizeSplitValue}>
                                                                <span>{item.awardBalance.times(0.2).toFixed(2)} {item.token}</span> and <span>{item.sponsorBalance.times(0.2).toFixed(2)} {item.sponsorToken}</span> each
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </AnimateHeight>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Divider className={classes.divider} style={{marginBottom:'20px'}}/>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button className={classes.play} variant={'contained'} onClick={() => {history.push('/pot/' + (item.id))}}>{t('buttons.playWith')} {balance.tokens[item.rewardToken].balance > 0 && walletReducer.address ? t('buttons.more') : ""} {item.token}</Button>
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
                                            <img alt="" width="100" height="100" src={ZiggyMaintenance} aria-hidden={true} />
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
                                <Grid container spacing={3} className={classes.socialMediaSection}>
                                    <Grid item xs={12} md={3}>
                                        <SocialMediaBlock type="telegram"/>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <SocialMediaBlock type="discord"/>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <SocialMediaBlock type="twitter"/>
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
