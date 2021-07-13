import * as React from "react";
import {useLocation, useParams} from "react-router";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import AnimateHeight from 'react-animate-height';
import Loader from "../../components/loader";
import {
    Container,
    makeStyles,
    Grid,
    Typography,
    Box,
    Link,
    Divider,
} from "@material-ui/core"
import styles from "./styles"
import {ExpandMore, ExpandLess} from '@material-ui/icons';
import {Trans, useTranslation} from "react-i18next";
import {isEmpty} from "../../helpers/utils";
import reduxActions from "../redux/actions";
import Deposit from "./components/Deposit";
import Withdraw from "./components/Withdraw";

const useStyles = makeStyles(styles);

const Vault = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const history = useHistory();
    const classes = useStyles();

    let { id } = useParams();
    const {vault, wallet} = useSelector(state => ({
        vault: state.vaultReducer,
        wallet: state.walletReducer,
    }));

    const dispatch = useDispatch();
    const [withdrawOpen, setWithdrawOpen] = React.useState(location.withdrawOpen);
    const [isLoading, setIsLoading] = React.useState(true);
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
        if(!isEmpty(vault.pools) && vault.pools[id]) {
            setVaultData(vault.pools[id]);
        } else {
            history.push('/error');
        }
    }, [vault.pools, id, history]);

    React.useEffect(() => {
        if(item) {
            setIsLoading(false);
        }
    }, [item]);

    /*React.useEffect(() => {
        if(item && prices.lastUpdated > 0) {
            dispatch(reduxActions.vault.fetchPools(item));
        }
    }, [dispatch, item, prices.lastUpdated]);*/

    React.useEffect(() => {
        if(item && wallet.address) {
            dispatch(reduxActions.balance.fetchBalances(item));
        }
    }, [dispatch, item, wallet.address]);

    /*React.useEffect(() => {
        if(item) {
            setInterval(() => {
                dispatch(reduxActions.vault.fetchPools(item));
                dispatch(reduxActions.balance.fetchBalances(item));
            }, 60000);
        }
    }, [item, dispatch]);*/



    return (
        <div className="App">
            {isLoading ? (
            <Container maxWidth="lg">
                <Loader message={t('vaultLoadingMessage')} />
            </Container>
            ) : (
            <Container maxWidth="lg">
                <Typography className={classes.title}>
                    <Trans i18nKey="vaultTitle" values={{name: item.token, apy: '147%', amount: '$587,338'}} />
                </Typography>
                <Grid container>
                    <Box className={classes.vaultPotItem}>
                        <Grid container spacing={2}>
                            <Grid item xs={4} align={"left"}>
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
                                <Typography className={classes.subTitle} align={"left"}>{t('nextWeeklyDraw')}</Typography>
                                <Typography className={classes.countdown} align={"left"}>1d 23h 15m</Typography>
                            </Grid>
                            
                            <Grid item xs={6}>
                                <Typography className={classes.subTitle} align={'right'}>{t('earnToken')} {item.token}</Typography>
                                <Typography className={classes.apy}>10% APY</Typography>
                            </Grid>
                            <Grid item xs={11}>
                                <Deposit
                                    item={item}
                                    handleWalletConnect={handleWalletConnect}
                                    formData={formData}
                                    setFormData={setFormData}
                                    updateItemData={updateItemData}
                                    resetFormData={resetFormData}
                                />
                            </Grid>
                            <Grid item xs={8}>
                                <Typography className={classes.oddsPerDeposit}>{t('oddsPerDeposit', {odds: '40,000', amount: '$1000'})}</Typography>
                            </Grid>
                            <Grid item xs={11}>
                                <Divider className={classes.divider}></Divider>
                            </Grid>
                            <Grid item xs={9} align={"left"}>
                                <Typography className={classes.withdrawText} onClick={() => {setWithdrawOpen(!withdrawOpen)}}>{t('withdraw')} </Typography>
                            </Grid>
                            <Grid item xs={2} align={"right"}>
                                <Link className={classes.expandToggle} onClick={() => {setWithdrawOpen(!withdrawOpen)}}>{withdrawOpen ? (<ExpandLess />) : (<ExpandMore />)}</Link>
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
                </Grid>
            </Container>
            )}
        </div>
    )
};

export default Vault;
