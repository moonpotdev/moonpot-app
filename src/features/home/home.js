import * as React from "react";
import { useHistory } from 'react-router-dom';
import {useSelector} from "react-redux";
import {Button, Link, Container, Grid, makeStyles, Typography} from "@material-ui/core"
import Box from '@material-ui/core/Box';
import styles from "./styles"
import Filter from "./components/Filter";
import {Trans, useTranslation} from "react-i18next";

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
    const {vault} = useSelector(state => ({
        vault: state.vaultReducer,
    }));

    const history = useHistory();
    const classes = useStyles();
    const storage = localStorage.getItem('homeSortConfig');
    const [sortConfig, setSortConfig] = React.useState(storage === null ? defaultFilter : JSON.parse(storage));
    const [filtered, setFiltered] = React.useState([]);

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

    return (
        <React.Fragment>
            <Container maxWidth="xl">
                <Typography className={classes.h1}>
                    <Trans i18nKey="homeTitle" values={{amount: '$914,279'}} />
                </Typography>
                <Box>
                    <Filter sortConfig={sortConfig} setSortConfig={setSortConfig} defaultFilter={defaultFilter} />
                    <Grid container>
                    {filtered.length === 0 ? '' : (
                        filtered.map(item => (
                            <React.Fragment>
                                <Box className={classes.potItem} key={item.id}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={4}>
                                            <Box className={classes.potImage}>
                                                <img alt="Moonpot" src={require('../../images/pots/cake.svg').default} />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={7}>
                                            <Typography className={classes.potUsdTop} align={"right"}><span>{t('win')}</span> $90,000</Typography>
                                            <Typography className={classes.potUsd} align={"right"}><span>{t('in')}</span> {item.token}</Typography>
                                            <Typography className={classes.potCrypto} align={"right"}>USD {t('value')} <span>1600.00 {item.token} </span> {t('prize')}</Typography>
                                        </Grid>
                                        <Grid item xs={5}>
                                            <Typography className={classes.subTitle}>{t('nextWeeklyDraw')}</Typography>
                                            <Typography className={classes.countdown}>1d 23h 15m</Typography>
                                        </Grid>
                                        <Grid item xs={5}>
                                            <Typography className={classes.subTitle} align={'right'}>{t('earn')} {item.rewardToken}</Typography>
                                            <Typography className={classes.apy} align={'right'}>10% APY</Typography>
                                        </Grid>
                                        <Grid item xs={11}>
                                            <Button className={classes.play} variant={'contained'} onClick={() => {history.push('/pot/' + (item.id))}}>{t('buttons.play')}</Button>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Typography className={classes.oddsPerDeposit}>{t('oddsPerDeposit', {odds: '40,000', amount: '$1000'})}</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Grid item xs={12}>
                                    <Typography className={classes.beefy}>{t('footerPoweredBy')} <Link href={"https://beefy.finance"}>Beefy.Finance</Link> <img alt="Beefy Finance" src={require('../../images/beefy.svg').default} /></Typography>
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
