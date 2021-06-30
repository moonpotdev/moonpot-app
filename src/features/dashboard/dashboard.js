import * as React from "react";
import { useHistory } from 'react-router-dom';
import {useSelector} from "react-redux";
import {Button, Container, Grid, makeStyles, Typography} from "@material-ui/core"
import Box from '@material-ui/core/Box';
import styles from "./styles"
import {isEmpty} from "../../helpers/utils";
import {Trans, useTranslation} from "react-i18next";

const useStyles = makeStyles(styles);
const defaultFilter = {
    status: 'active',
}

const UseSortableData = (items, config = null) => {
    const [sortConfig, setSortConfig] = React.useState(config);

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

const Dashboard = () => {
    const { t } = useTranslation();
    const {vault, wallet} = useSelector(state => ({
        vault: state.vaultReducer,
        wallet: state.walletReducer,
    }));

    const history = useHistory();
    const classes = useStyles();
    const {items, sortConfig, setFilter} = UseSortableData(vault.pools, defaultFilter);

    const filter = () => {
        if(items.length > 0) {
            const filtered = items.filter((item) => {
                if(item.status !== sortConfig.status) {
                    return false;
                }

                /*if(item.deposited === 0) {
                    return false;
                }*/

                return item;
            });

            return filtered;
        }
        return false;
    };

    const ShowMyPots = ({items}) => {
        const filtered = filter();

        if(filtered.length === 0) {
            return (
                <React.Fragment>
                    <Grid item xs={7} direction="column" alignItems="center" className={classes.empty} >
                        <Typography variant={"body1"}>{t('DashboardEmpty1')}</Typography>
                        <Typography variant={"body1"}>{t('DashboardEmpty2')}</Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <img alt="Ziggy" src={require('../../images/ziggy/emptydeposit.svg').default} />
                    </Grid>
                </React.Fragment>
            );
        } else {
            return (
                filtered.map(item => (
                    <Box className={classes.potItem} key={item.id}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Box className={classes.potImage}>
                                    <img alt="Moonpot" src={require('../../images/pots/bitcoin.svg').default} />
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box display={"flex"}>
                                    <Box mr={5} mb={2} className={classes.split}>
                                        <Typography variant={"h2"} align={"right"}>16.4k {item.rewardToken}</Typography>
                                        <Typography variant={"h3"} align={"right"}>{item.name} {t('prize')}</Typography>
                                        <Typography className={classes.seperator} variant={"h2"} align={"right"}>3d 23h 14min</Typography>
                                        <Typography variant={"h3"} align={"right"}>{t('nextDraw')}</Typography>
                                        <Typography className={classes.seperator} variant={"h2"} align={"right"}>May 14 2021</Typography>
                                        <Typography variant={"h3"} align={"right"}>{t('fairplayUnlock')}</Typography>
                                    </Box>
                                    <Box ml={5} mb={2} className={classes.split}>
                                        <Typography variant={"h2"}>2.52 {item.depositToken}</Typography>
                                        <Typography variant={"h3"}>{t('myDeposit')}</Typography>
                                        <Typography className={classes.seperator} variant={"h2"}>147% APY</Typography>
                                        <Typography variant={"h3"}>{t('interestRate')}</Typography>
                                        <Typography className={classes.seperator} variant={"h2"}>1 in 420000</Typography>
                                        <Typography variant={"h3"}>{t('myOdds')}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Box p={1}>
                                            <Button onClick={() => {history.push({pathname: '/pot/' + (item.id), withdrawOpen: true})}} className={classes.btn} variant={'contained'} color="primary">{t('buttons.withdraw')}</Button>
                                        </Box>

                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box p={1}>
                                            <Button onClick={() => {history.push('/pot/' + (item.id))}} className={classes.btn} variant={'contained'} color="primary">{t('buttons.depositMore')}</Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                ))
            )
        }
    }

    return (
        <React.Fragment>
            {wallet.address ? (
                <Container maxWidth="xl">
                    <Typography className={classes.h1}>
                        <Trans i18nKey="DashboardTitle" values={{count: "one", amount: "$914,279"}} />
                    </Typography>
                    <Box>
                        <Box display="flex" justifyContent="center">
                            <Box p={1}>
                                <Button variant={"outlined"} color={sortConfig.status === 'active' ? 'primary' : 'default'} onClick={() => setFilter({status: 'active'})}>{t('buttons.myActivePots')}</Button>
                            </Box>
                            <Box p={1}>
                                <Button variant={"outlined"} color={sortConfig.status !== 'active' ? 'primary' : 'default'} onClick={() => setFilter({status: 'eol'})}>{t('buttons.myFinishedPots')}</Button>
                            </Box>
                        </Box>
                        <Grid container direction="column" alignItems={"center"}>
                            {items.length === 0 ? '' : (
                                <ShowMyPots items={items} />
                            )}
                        </Grid>
                        <Box textAlign={"center"} p={3}>
                            <Button variant={"outlined"} onClick={() => {history.push('/')}}>{t('buttons.playInMorePots')}</Button>
                        </Box>
                    </Box>
                </Container>
            ) : (
                <Box textAlign={"center"} p={3}>
                    <Button variant={"outlined"}>{t('buttons.connectWallet')}</Button>
                </Box>
            )}
        </React.Fragment>
    );
};

export default Dashboard;
