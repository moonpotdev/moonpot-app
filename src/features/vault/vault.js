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
    Button, TextField, Link
} from "@material-ui/core"
import styles from "./styles"
import {ArrowDropDown, ArrowDropUp} from '@material-ui/icons';
import {Trans, useTranslation} from "react-i18next";
import {isEmpty} from "../../helpers/utils";

const useStyles = makeStyles(styles);

const Vault = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const history = useHistory();
    const classes = useStyles();
    const [withdrawOpen, setWithdrawOpen] = React.useState(location.withdrawOpen);

    let { id } = useParams();
    const {vault, wallet} = useSelector(state => ({
        vault: state.vaultReducer,
        wallet: state.walletReducer,
    }));

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = React.useState(true);
    const [item, setVaultData] = React.useState(null);
    const [formData, setFormData] = React.useState({deposit: {amount: '', max: false}, withdraw: {amount: '', max: false}});

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
                    <Box className={classes.potItem}>
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
                                <Typography className={classes.subTitle} align={'right'} style={{textDecoration: 'underline'}}>{t('interestRate')}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography className={classes.potUsd}><span>{t('win')}</span> $14,625 in {item.name}</Typography>
                                <Typography className={classes.potCrypto}>USD {t('value')} <span>16,400 Cake</span> {t('prize')}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField disabled={!wallet.address} className={classes.input} placeholder={t('enterCoinAmount', {coin: item.depositToken})} InputProps={{disableUnderline: true, classes: {root: classes.inputRoot}}} />
                                {wallet.address ? (
                                    <Button className={classes.actionBtn} variant={'contained'} color="primary">{t('buttons.deposit')}</Button>
                                ) : (
                                    <Button className={classes.actionBtn} variant={'contained'} color="primary">{t('buttons.connectWallet')}</Button>
                                )}
                            </Grid>
                            <Grid item xs={12}>
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
                                    <Typography className={classes.withdrawPenaltyWarning}>
                                        <Trans i18nKey="vaultWithdrawPenaltyWarning" values={{amount: '2.52', coin: item.rewardToken}} />
                                    </Typography>
                                    <TextField disabled={!wallet.address} className={classes.input} placeholder="2.52 CAKE" InputProps={{disableUnderline: true, classes: {root: classes.inputRoot}}} />
                                    {wallet.address ? (
                                        <Button className={classes.actionBtn} variant={'contained'} color="primary">{t('buttons.withdraw')}</Button>
                                    ) : (
                                        <Button className={classes.actionBtn} variant={'contained'} color="primary">{t('buttons.connectWallet')}</Button>
                                    )}

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
