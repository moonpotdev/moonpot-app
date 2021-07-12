import * as React from "react";
import { useHistory } from 'react-router-dom';
import {useLocation} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import AnimateHeight from 'react-animate-height';
import {Button, Link, Container, Grid, Box, makeStyles, Typography, Divider} from "@material-ui/core"
import {ExpandMore, ExpandLess} from '@material-ui/icons';
import styles from "./styles"
import {Trans, useTranslation} from "react-i18next";
import reduxActions from "../redux/actions";
import Deposit from "../vault/components/Deposit";
import Withdraw from "../vault/components/Withdraw";

const useStyles = makeStyles(styles);
const defaultFilter = {
    status: 'active',
}

const Dashboard = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const {vault, wallet, balance} = useSelector(state => ({
        vault: state.vaultReducer,
        wallet: state.walletReducer,
        balance: state.balanceReducer,
    }));

    const history = useHistory();
    const dispatch = useDispatch();
    const classes = useStyles();
    const [detailsOpen, setDetailsOpen] = React.useState(location.detailsOpen);
    const [depositOpen, setDepositOpen] = React.useState(location.depositOpen);
    const [withdrawOpen, setWithdrawOpen] = React.useState(location.withdrawOpen);
    const [sortConfig, setSortConfig] = React.useState(defaultFilter);
    const [filtered, setFiltered] = React.useState([]);
    const [item, setVaultData] = React.useState(null);
    const [formData, setFormData] = React.useState({deposit: {amount: '', max: false}, withdraw: {amount: '', max: false}});

    const handleWalletConnect = () => {
        if(!wallet.address) {
            dispatch(reduxActions.wallet.connect());
        }
    }

    const updateItemData = () => {
        if(wallet.address && item) {
            //dispatch(reduxActions.vault.fetchPools(item));
            dispatch(reduxActions.balance.fetchBalances(item));
        }
    }

    const resetFormData = () => {
        setFormData({deposit: {amount: '', max: false}, withdraw: {amount: '', max: false}});
    }

    React.useEffect(() => {
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
            if(item.status !== sortConfig.status) {
                return false;
            }

            if(Number(balance.tokens[item.rewardToken].balance) === 0) {
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

    }, [sortConfig, vault.pools, balance]);

    React.useEffect(() => {
        if(wallet.address) {
            dispatch(reduxActions.balance.fetchBalances());
        }
    }, [wallet.address]);

    return (
        <React.Fragment>
                <Container maxWidth="lg">
                        <Box display="flex" justifyContent="center">
                            <Box p={1}>
                                <Button variant={"outlined"} color={sortConfig.status === 'active' ? 'primary' : 'default'} onClick={() => setSortConfig({ ...sortConfig, status: 'active' })}>{t('buttons.myActivePots')}</Button>
                            </Box>
                        </Box>
                        <Grid container>
                            {filtered.length === 0 ? '' : (
                                filtered.map(item => (
                                    <Box className={classes.vaultPotItem} key={item.id}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={4} align={"left"}>
                                                <Box className={classes.potImage}>
                                                    <img alt="Moonpot" src={require('../../images/pots/cake.svg').default} />
                                                </Box>
                                            </Grid>
                                            <Grid item xs={7}>
                                                <Typography className={classes.potUsdTop} align={"right"}><span>{t('win')}</span> 16000.00</Typography>
                                                <Typography className={classes.potUsd} align={"right"}><span>{t('in')}</span> {item.token}</Typography>
                                                <Typography className={classes.myPotsNextWeeklyDrawText} align={"right"}>{t('nextWeeklyDraw')}: <span>1d 23h 15m</span></Typography>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Divider className={classes.divider}></Divider>
                                            </Grid>
                                            <Grid item xs={9} align={"left"}>
                                                <Typography className={classes.detailsText} onClick={() => {setDetailsOpen(!detailsOpen)}}>{t('details')} </Typography>
                                            </Grid>
                                            <Grid item xs={2} align={"right"}>
                                                <Link onClick={() => {setDetailsOpen(!detailsOpen)}} className={classes.expandToggle}>{detailsOpen ? (<ExpandLess />) : (<ExpandMore />)}</Link>
                                            </Grid>
                                            <AnimateHeight duration={ 500 } height={ detailsOpen ? 'auto' : 0 }>
                                                <Grid item xs={5}>
                                                    <Typography className={classes.subTitle} align={'right'}>{t('earn')} {item.token}</Typography>
                                                    <Typography className={classes.apy} align={'right'}>10% APY</Typography>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <Typography className={classes.oddsPerDeposit}>{t('oddsPerDeposit', {odds: '40,000', amount: '$1000'})}</Typography>
                                                </Grid>
                                            </AnimateHeight>
                                            <Grid item xs={11}>
                                                <Divider className={classes.divider}></Divider>
                                            </Grid>
                                            <Grid item xs={9} align={"left"}>
                                                <Typography className={classes.depositMoreText} onClick={() => {setDepositOpen(!depositOpen)}}>{t('depositMore')} </Typography>
                                            </Grid>
                                            <Grid item xs={2} align={"right"}>
                                                <Link onClick={() => {setDepositOpen(!depositOpen)}} className={classes.expandToggle}>{depositOpen ? (<ExpandLess />) : (<ExpandMore />)}</Link>
                                            </Grid>
                                            <AnimateHeight duration={ 500 } height={ depositOpen ? 'auto' : 0 }>
                                                <Grid item xs={12}>
                                                    <Deposit
                                                        item={item}
                                                        handleWalletConnect={handleWalletConnect}
                                                        formData={formData}
                                                        setFormData={setFormData}
                                                        updateItemData={updateItemData}
                                                        resetFormData={resetFormData}
                                                    />
                                                </Grid>
                                            </AnimateHeight>
                                            <Grid item xs={11}>
                                                <Divider className={classes.divider}></Divider>
                                            </Grid>
                                            <Grid item xs={9} align={"left"}>
                                                <Typography className={classes.withdrawText} onClick={() => {setWithdrawOpen(!withdrawOpen)}}>{t('withdraw')} </Typography>
                                            </Grid>
                                            <Grid item xs={2} align={"right"}>
                                                <Link onClick={() => {setWithdrawOpen(!withdrawOpen)}} className={classes.expandToggle}>{withdrawOpen ? (<ExpandLess />) : (<ExpandMore />)}</Link>
                                            </Grid>
                                            <AnimateHeight duration={ 500 } height={ withdrawOpen ? 'auto' : 0 }>
                                                <Grid item xs={12}>
                                                    <Withdraw
                                                        item={item}
                                                        handleWalletConnect={handleWalletConnect}
                                                        formData={formData}
                                                        setFormData={setFormData}
                                                        updateItemData={updateItemData}
                                                        resetFormData={resetFormData}
                                                    />
                                                </Grid>
                                            </AnimateHeight>
                                        </Grid>
                                    </Box>
                                ))
                            )}
                        </Grid>
                </Container>
        </React.Fragment>
    );
};

export default Dashboard;
