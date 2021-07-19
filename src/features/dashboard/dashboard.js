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
import BigNumber from "bignumber.js";
import {byDecimals} from "../../helpers/format";
import {isEmpty} from "../../helpers/utils";

const useStyles = makeStyles(styles);
const defaultFilter = {
    status: 'active',
}

const Dashboard = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const history = useHistory();
    const {vault, wallet, balance} = useSelector(state => ({
        vault: state.vaultReducer,
        wallet: state.walletReducer,
        balance: state.balanceReducer,
    }));

    
    const dispatch = useDispatch();
    const classes = useStyles();
    const [detailsOpen, setDetailsOpen] = React.useState(location.detailsOpen);
    const [depositOpen, setDepositOpen] = React.useState(location.depositOpen);
    const [withdrawOpen, setWithdrawOpen] = React.useState(location.withdrawOpen);
    const [sortConfig, setSortConfig] = React.useState(defaultFilter);
    const [filtered, setFiltered] = React.useState([]);
    const [item] = React.useState(null);
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

                let amount = 0;

                if(wallet.address && !isEmpty(balance.tokens[item.rewardToken])) {
                    item.userBalance = byDecimals(new BigNumber(balance.tokens[item.rewardToken].balance), item.tokenDecimals).toFixed(8);
                };
                data.push(item);
            }
        }

        if (sortConfig !== null) {
            data = sorted(data);
            console.log(data)
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
                            {filtered.length === 0 ? 
                            
                                <Box className={classes.noActivePots}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={5}>
                                            <img className={classes.noActivePotsImage} alt="No Active Moonpots" src={require('../../images/ziggy/noActivePots.svg').default} />
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Typography className={classes.noActivePotsTitle}>{t('playWithMoonpot')}</Typography>
                                        </Grid>
                                        <Grid item xs={10}>
                                            <Typography className={classes.noActivePotsText}>{t('youHaventEnteredMoonpots')}</Typography>
                                        </Grid>
                                        <Grid item xs={10}>
                                            <Button 
                                            className={classes.noActivePotsPlayButton} 
                                            onClick={() => {history.push('/')}}
                                            >
                                                {t('buttons.play')}
                                            </Button>
                                        </Grid>
                                    </Grid>

                                </Box>

                            : (
                                filtered.map(item => (
                                    <Box className={classes.vaultPotItem} key={item.id}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={4} align={"left"}>
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
                                                <Typography className={classes.potUsdTop} align={"right"}>$90,000 <span>{t('in')}</span> {item.token}</Typography>
                                                <Typography className={classes.potUsd} align={"right"}>& {item.sponsorToken} PRIZES</Typography>
                                                <Typography className={classes.myPotsNextWeeklyDrawText} align={"right"}>{t('prize')}: <span>2d 23h 14m</span></Typography>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Divider className={classes.divider}></Divider>
                                            </Grid>
                                            <Grid item xs={9} align={"left"}>
                                                <Typography className={classes.dividerText} onClick={() => {setDetailsOpen(!detailsOpen)}}>{t('myDetails')} </Typography>
                                            </Grid>
                                            <Grid item xs={2} align={"right"}>
                                                <Link onClick={() => {setDetailsOpen(!detailsOpen)}} className={classes.expandToggle}>{detailsOpen ? (<ExpandLess />) : (<ExpandMore />)}</Link>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <AnimateHeight duration={ 500 } height={ detailsOpen ? 'auto' : 0 }>
                                                    <Grid container justifyContent>
                                                        <Grid item xs={6}>
                                                            <Typography className={classes.myDetailsText} align={'left'}>
                                                                <Trans i18nKey="myToken" values={{token: item.token}}/>
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography className={classes.myDetailsValue} align={'right'}>{item.userBalance} {item.token} ($?)</Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography className={classes.myDetailsText} align={'left'}>{t('myInterestRate')}</Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography className={classes.myDetailsValue} align={"right"}><span>55%</span> 78% APY</Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography className={classes.myDetailsText} align={'left'}>{t('myOdds')}</Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography className={classes.myDetailsValue} align={"right"}>{t('odds', {odds: '266,666'})}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </AnimateHeight>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Divider className={classes.divider}></Divider>
                                            </Grid>
                                            <Grid item xs={9} align={"left"}>
                                                <Typography className={classes.dividerText} onClick={() => {setDepositOpen(!depositOpen)}}>{t('depositMore')} </Typography>
                                            </Grid>
                                            <Grid item xs={2} align={"right"}>
                                                <Link onClick={() => {setDepositOpen(!depositOpen)}} className={classes.expandToggle}>{depositOpen ? (<ExpandLess />) : (<ExpandMore />)}</Link>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <AnimateHeight duration={ 500 } height={ depositOpen ? 'auto' : 0 }>
                                                        <Deposit
                                                            item={item}
                                                            handleWalletConnect={handleWalletConnect}
                                                            formData={formData}
                                                            setFormData={setFormData}
                                                            updateItemData={updateItemData}
                                                            resetFormData={resetFormData}
                                                        />
                                                        <Grid item xs={11}>
                                                            <Typography className={classes.depositMoreExtraInfo}>
                                                                {t('depositMoreExtraInfo')}
                                                            </Typography>
                                                        </Grid>
                                                </AnimateHeight>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Divider className={classes.divider}></Divider>
                                            </Grid>
                                            <Grid item xs={9} align={"left"}>
                                                <Typography className={classes.dividerText} onClick={() => {setWithdrawOpen(!withdrawOpen)}}>{t('withdraw')} </Typography>
                                            </Grid>
                                            <Grid item xs={2} align={"right"}>
                                                <Link onClick={() => {setWithdrawOpen(!withdrawOpen)}} className={classes.expandToggle}>{withdrawOpen ? (<ExpandLess />) : (<ExpandMore />)}</Link>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <AnimateHeight duration={ 500 } height={ withdrawOpen ? 'auto' : 0 }>
                                                        <Withdraw
                                                            item={item}
                                                            handleWalletConnect={handleWalletConnect}
                                                            formData={formData}
                                                            setFormData={setFormData}
                                                            updateItemData={updateItemData}
                                                            resetFormData={resetFormData}
                                                        />
                                                </AnimateHeight>
                                            </Grid>
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
