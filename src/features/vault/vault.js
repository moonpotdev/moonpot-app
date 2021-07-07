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
    Link
} from "@material-ui/core"
import styles from "./styles"
import {ArrowDropDown, ArrowDropUp} from '@material-ui/icons';
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
                    <Trans i18nKey="vaultTitle" values={{name: item.name, apy: '147%', amount: '$587,338'}} />
                </Typography>
                <Grid container>
                    <Box className={classes.vaultPotItem}>
                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <Box className={classes.potImage}>
                                    <img alt="Moonpot" src={require('../../images/pots/bitcoin.svg').default} />
                                </Box>
                            </Grid>
                            <Grid item xs={7}>
                                <Typography className={classes.potUsdTop} align={"right"}><span>{t('win')}</span> $14,625</Typography>
                                <Typography className={classes.potUsd} align={"right"}><span>{t('in')}</span> {item.token}</Typography>
                                <Typography className={classes.potCrypto} align={"right"}>USD {t('value')} <span>16,400 Cake</span> {t('prize')}</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography className={classes.countdown}>1d 23h 15m</Typography>
                                <Typography className={classes.subTitle}>{t('nextWeeklyDraw')}</Typography>
                            </Grid>
                            
                            <Grid item xs={5}>
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
                                <Typography className={classes.timelockRemaining}>Two Weeks</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Link href={"a"} className={classes.link}>{t('fairplayTimelock')}</Link>
                            </Grid>
                            <Grid item xs={6} style={{textAlign: 'right'}}>
                                <Link onClick={() => {setWithdrawOpen(!withdrawOpen)}} className={classes.link} style={{paddingRight: '15px'}}>{t('withdraw')} {withdrawOpen ? (<ArrowDropUp />) : (<ArrowDropDown />)}</Link>
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
                </Grid>
            </Container>
            )}
        </div>
    )
};

export default Vault;
