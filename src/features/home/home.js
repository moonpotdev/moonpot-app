import * as React from "react";
import { useHistory } from 'react-router-dom';
import {useSelector} from "react-redux";

import {Button, Container, Grid, makeStyles, Typography} from "@material-ui/core"
import Box from '@material-ui/core/Box';
import styles from "./styles"
import {isEmpty} from "../../helpers/utils";
import Filter from "./components/Filter";
import {Trans, useTranslation} from "react-i18next";

const useStyles = makeStyles(styles);
const defaultFilter = {
    key: 'tvl',
    direction: 'desc',
    deposited: false,
    vault: 'main', // main or community
}

const UseSortableData = (items, config = null) => {
    const storage = localStorage.getItem('moonSortConfig');
    const [sortConfig, setSortConfig] = React.useState(storage === null ? config : JSON.parse(storage));

    React.useEffect(() => {
        localStorage.setItem('moonSortConfig', JSON.stringify(sortConfig));
    }, [sortConfig]);

    const sortedItems = React.useMemo(() => {
        let sortableItems = isEmpty(items) ? [] : [...items];

        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
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
        return sortableItems;
    }, [items, sortConfig]);

    const setFilter = (obj) => {
        setSortConfig({ ...sortConfig, ...obj});
    }

    return { items: sortedItems, sortConfig, setFilter};
};

const Home = () => {
    const { t } = useTranslation();
    const {vault} = useSelector(state => ({
        vault: state.vaultReducer,
    }));

    const history = useHistory();
    const classes = useStyles();
    const {items, sortConfig, setFilter} = UseSortableData(vault.pools, defaultFilter);

    const filter = () => {
        if(items.length > 0) {

            const filtered = items.filter((item) => {
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
            });

            return filtered;
        }
        return false;
    };

    return (
        <React.Fragment>
            <Container maxWidth="xl">
                <Typography className={classes.h1}>
                    <Trans i18nKey="homeTitle" values={{amount: '$914,279'}} />
                </Typography>
                <Box>
                    <Filter sortConfig={sortConfig} setFilter={setFilter} />
                    <Grid container>
                    {items.length === 0 ? '' : (
                        filter().map(item => (
                            <Box className={classes.potItem} key={item.id}>
                                <Grid container>
                                    <Grid item xs={4}>
                                        <Typography className={classes.countdown}>1d 23h 15m</Typography>
                                        <Typography className={classes.subTitle}>{t('nextWeeklyDraw')}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Box className={classes.potImage}>
                                            <img alt="Moonpot" src={require('../../images/pots/bitcoin.svg').default} />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography className={classes.apy}>10% APY</Typography>
                                        <Typography className={classes.subTitle} align={'right'}>{t('earn')} {item.rewardToken}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography className={classes.potUsd}><span>{t('win')}</span> $14,625 in {item.name}</Typography>
                                        <Typography className={classes.potCrypto}>USD {t('valueOf')} <span>0.27 BTC-LP</span> {t('prize')}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button className={classes.play} variant={'contained'} color="primary" onClick={() => {history.push('/pot/' + (item.id))}}>{t('buttons.play')}</Button>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography className={classes.oddsChance}>1 in 10,000</Typography>
                                        <Typography className={classes.oddsPerDeposit}>{t('oddsPerDeposit', {amount: '$1000'})}</Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        ))
                    )}
                        {sortConfig.vault === 'community' ? (
                            <Box className={classes.communityItem}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Box className={classes.ziggyMaintenance}>
                                            <img alt="Ziggy Maintenance" src={require('../../images/ziggy/maintenance.svg').default} />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <h1>
                                            <Trans i18nKey="homeJoinCommunityTitle" />
                                        </h1>
                                        <p>
                                            <Trans i18nKey="homeJoinCommunityBody" />
                                        </p>
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
