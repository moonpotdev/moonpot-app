import * as React from "react";
import { useHistory } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {Button, Container, Grid, makeStyles, Typography} from "@material-ui/core"
import Box from '@material-ui/core/Box';
import styles from "./styles"
import {Trans, useTranslation} from "react-i18next";
import reduxActions from "../redux/actions";

const useStyles = makeStyles(styles);
const defaultFilter = {
    status: 'active',
}

const Dashboard = () => {
    const { t } = useTranslation();
    const {vault, wallet, balance} = useSelector(state => ({
        vault: state.vaultReducer,
        wallet: state.walletReducer,
        balance: state.balanceReducer,
    }));

    const history = useHistory();
    const dispatch = useDispatch();
    const classes = useStyles();
    const [sortConfig, setSortConfig] = React.useState(defaultFilter);
    const [filtered, setFiltered] = React.useState([]);

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
                <Container maxWidth="xl">
                    <Typography className={classes.h1}>
                        <Trans i18nKey="DashboardTitle" values={{count: "one", amount: "$914,279"}} />
                    </Typography>
                    <Box>
                        <Box display="flex" justifyContent="center">
                            <Box p={1}>
                                <Button variant={"outlined"} color={sortConfig.status === 'active' ? 'primary' : 'default'} onClick={() => setSortConfig({ ...sortConfig, status: 'active' })}>{t('buttons.myActivePots')}</Button>
                            </Box>
                            <Box p={1}>
                                <Button variant={"outlined"} color={sortConfig.status !== 'active' ? 'primary' : 'default'} onClick={() => setSortConfig({ ...sortConfig, status: 'eol' })}>{t('buttons.myFinishedPots')}</Button>
                            </Box>
                        </Box>
                        <Grid container direction="column" alignItems={"center"}>
                            {filtered.length === 0 ? '' : (
                                filtered.map(item => (
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
                                ))
                            )}
                        </Grid>
                        <Box textAlign={"center"} p={3}>
                            <Button variant={"outlined"} onClick={() => {history.push('/')}}>{t('buttons.playInMorePots')}</Button>
                        </Box>
                    </Box>
                </Container>
        </React.Fragment>
    );
};

export default Dashboard;
