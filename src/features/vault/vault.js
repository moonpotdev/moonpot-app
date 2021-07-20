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
import {ExpandMore, ExpandLess, OpenInNew} from '@material-ui/icons';
import {Trans, useTranslation} from "react-i18next";
import {isEmpty} from "../../helpers/utils";
import reduxActions from "../redux/actions";
import Deposit from "./components/Deposit";
import Withdraw from "./components/Withdraw";
import {calculateTotalPrize} from "../../helpers/format";
import BigNumber from "bignumber.js";
import Countdown from "../../components/Countdown";

const useStyles = makeStyles(styles);

const Vault = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const history = useHistory();
    const classes = useStyles();

    let { id } = useParams();
    const {vault, wallet, prices} = useSelector(state => ({
        vault: state.vaultReducer,
        wallet: state.walletReducer,
        prices: state.pricesReducer,
    }));

    const dispatch = useDispatch();
    const [withdrawOpen, setWithdrawOpen] = React.useState(location.withdrawOpen);
    const [prizeSplitOpen, setPrizeSplitOpen] = React.useState(location.prizeSplitOpen);
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
            dispatch(reduxActions.earned.fetchEarned(item));
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

    React.useEffect(() => {
        if(item && prices.lastUpdated > 0) {
            dispatch(reduxActions.vault.fetchPools(item));
        }
    }, [dispatch, item, prices.lastUpdated]);

    React.useEffect(() => {
        if(item && wallet.address) {
            dispatch(reduxActions.balance.fetchBalances(item));
            dispatch(reduxActions.earned.fetchEarned(item));
        }
    }, [dispatch, item, wallet.address]);

    return (
        <div className="App">
            {isLoading ? (
            <Container maxWidth="lg">
                <Loader message={t('vaultLoadingMessage')} />
            </Container>
            ) : (
            <Container maxWidth="lg">
                <Typography className={classes.title}>
                    <Trans i18nKey="vaultTitle" values={{name: item.token, apy: (item.bonusApy > 0 ? new BigNumber(item.apy).plus(item.bonusApy).toFixed(2) : item.apy), amount: calculateTotalPrize(item, prices)}} />
                </Typography>
                <Grid container>
                    <Box className={classes.vaultPotItem}>
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
                                <Typography className={classes.potUsdTop} align={"right"}><span>{t('win')}</span> {calculateTotalPrize(item, prices)}</Typography>
                                <Typography className={classes.potUsd} align={"right"}> {item.token} <span>{t('and')}</span> {item.sponsorToken}</Typography>
                                <Typography className={classes.potCrypto} align={"right"}>USD {t('value')} {t('prize')}</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography className={classes.subTitle} align={"left"}>{t('nextWeeklyDraw')}</Typography>
                                <Typography className={classes.countdown} align={"left"}><Countdown expiresAt={item.expiresAt*1000} /> </Typography>
                            </Grid>
                            
                            <Grid item xs={6}>
                                <Typography className={classes.subTitle} align={'right'}>{t('interest')}</Typography>
                                <Typography className={classes.apy}><span>{item.apy}%</span> {item.bonusApy > 0 ? new BigNumber(item.apy).plus(item.bonusApy).toFixed(2) : item.apy}% APY</Typography>
                            </Grid>
                            <Grid item xs={11}>
                                <Divider className={classes.divider}/>
                            </Grid>
                            <Grid item xs={9} align={"left"}>
                                <Typography className={classes.prizeSplitText} onClick={() => {setPrizeSplitOpen(!prizeSplitOpen)}}>{t('prizeSplit')} </Typography>
                            </Grid>
                            <Grid item xs={2} align={"right"}>
                                <Link className={classes.expandToggle} onClick={() => {setPrizeSplitOpen(!prizeSplitOpen)}}>{prizeSplitOpen ? (<ExpandLess />) : (<ExpandMore />)}</Link>
                            </Grid>
                            <Grid item xs={11}>
                                <AnimateHeight duration={ 500 } height={ prizeSplitOpen ? 'auto' : 0 }>
                                    <Grid container spacing={1}>
                                        <Grid item xs={4} align={"left"}>
                                            <Typography className={classes.prizeSplitWinners}>5 winners</Typography>
                                        </Grid>
                                        <Grid item xs={8} align={"right"}>
                                            <Typography className={classes.prizeSplitValue}>
                                            <span>{item.awardBalance.toFixed(8)} {item.token}</span> and <span>{item.sponsorBalance.toFixed(0)} {item.sponsorToken}</span> (20%)
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </AnimateHeight>
                            </Grid>
                            <Grid item xs={11}>
                                <Divider className={classes.divider}></Divider>
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
                            <Grid item xs={11}>
                                <Typography className={classes.fairplayDepositMessage}>
                                    <Trans i18nKey="fairplayDepositMessage"/>
                                </Typography>
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
                    <Grid container>
                        <Grid item xs={12} align={"center"}>  
                            <Box className={classes.infoContainer}>
                                <Grid container>
                                    <Grid item xs={12} align={"left"}>
                                        <Typography className={classes.infoTitle} align={"left"}>
                                            {item.token} Moonpot Strategy
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} align={"left"}>
                                        <Typography className={classes.infoMessage} align={"left"}>
                                            <Trans i18nKey="moonpotStrategyMessage" values={{token: item.token, sponsor: item.sponsorProjectName}}/>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} align={"left"}>
                                        <a href="https://bscscan.com/address/0x97e5d50Fe0632A95b9cf1853E744E02f7D816677">
                                            <Typography className={classes.infoMessage} align={"left"}>
                                                    {item.sponsorProjectName} Vault Address <OpenInNew fontSize="small"/>
                                            </Typography>
                                        </a>
                                    </Grid>
                                    <Grid item xs={12} align={"left"}>
                                        <a href={`https://bscscan.com/address/${item.prizeStrategyAddress}`}>
                                            <Typography className={classes.infoMessage} align={"left"}>
                                                Moonpot Strategy Address <OpenInNew fontSize="small"/>
                                            </Typography>
                                        </a>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                        <Grid item xs={12} align={"center"}>  
                            <Box className={classes.infoContainer}>
                                <Grid container>
                                    <Grid item xs={12} align={"left"}>
                                        <Typography className={classes.infoTitle} align={"left"}>
                                            APY Breakdown
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} align={"left"}>
                                        <Typography className={classes.infoSubHeader} align={"left"}>
                                            Your {item.token} Interest
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} align={"left"}>
                                        <Typography className={classes.infoDetail} align={"left"}>
                                            50%
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} align={"left"}>
                                        <Typography className={classes.infoSubHeader} align={"left"}>
                                            {item.token} Moonpot Prize Draw
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} align={"left"}>
                                        <Typography className={classes.infoDetail} align={"left"}>
                                            40%
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} align={"left"}>
                                        <Typography className={classes.infoSubHeader} align={"left"}>
                                            Ziggy's (Governance) Pot Interest
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} align={"left"}>
                                        <Typography className={classes.infoDetail} align={"left"}>
                                            5%
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} align={"left"}>
                                        <Typography className={classes.infoSubHeader} align={"left"}>
                                            Ziggy's (Governance) Prize Draw
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} align={"left"}>
                                        <Typography className={classes.infoDetail} align={"left"}>
                                            5%
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                        <Grid item xs={12} align={"center"}>  
                            <Box className={classes.infoContainer}>
                                <Grid container>
                                    <Grid item xs={12} align={"left"}>
                                        <Box className={classes.ziggyTimelock}>
                                            <img 
                                            alt="Ziggy"
                                            srcSet="
                                                images/ziggy/timelock@4x.png 4x,
                                                images/ziggy/timelock@3x.png 3x,
                                                images/ziggy/timelock@2x.png 2x,
                                                images/ziggy/timelock@1x.png 1x
                                            "
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} align={"center"}>
                                        <Typography className={classes.infoTitle} align={"left"}>
                                            <Trans i18nKey="fairplayTimelockRules"/>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} align={"center"}>
                                        <Typography className={classes.infoMessage} align={"left"}>
                                            <Trans i18nKey="fairplayTimelockRulesMessage"/>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                        <Grid item xs={11} align={"center"}>
                            <Box className={classes.ziggyPlay}>
                                <img 
                                alt="Ziggy"
                                srcSet="
                                    images/ziggy/play@4x.png 4x,
                                    images/ziggy/play@3x.png 3x,
                                    images/ziggy/play@2x.png 2x,
                                    images/ziggy/play@1x.png 1x
                                "
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
            )}
        </div>
    )
};

export default Vault;
