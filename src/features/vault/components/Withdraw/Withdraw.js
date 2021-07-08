import {Grid, Button, InputBase, makeStyles, Paper, Typography} from "@material-ui/core";
import {Trans, useTranslation} from "react-i18next";
import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import BigNumber from "bignumber.js";
import {byDecimals, convertAmountToRawNumber, stripExtraDecimals} from "../../../../helpers/format";
import styles from "../../styles";
import reduxActions from "../../../redux/actions";
import {isEmpty} from "../../../../helpers/utils";
import Steps from "../Steps";

const useStyles = makeStyles(styles);

const Withdraw = ({item, handleWalletConnect, formData, setFormData, updateItemData, resetFormData}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const {wallet, balance} = useSelector(state => ({
        wallet: state.walletReducer,
        balance: state.balanceReducer,
    }));
    const [state, setState] = React.useState({balance: 0});
    const [steps, setSteps] = React.useState({modal: false, currentStep: -1, items: [], finished: false});

    const handleInput = (val) => {
        const value = (parseFloat(val) > state.balance) ? state.balance : (parseFloat(val) < 0) ? 0 : stripExtraDecimals(val);
        setFormData({...formData, withdraw: {amount: value, max: new BigNumber(value).minus(state.balance).toNumber() === 0}});
    }

    const handleMax = () => {
        if(state.balance > 0) {
            setFormData({...formData, withdraw: {amount: state.balance, max: true}});
        }
    }

    const handleWithdraw = () => {
        const steps = [];
        if(wallet.address) {
            const amount = new BigNumber(formData.withdraw.amount).dividedBy(byDecimals(item.pricePerShare, item.tokenDecimals)).toFixed(8);
            steps.push({
                step: "withdraw",
                message: "Confirm withdraw transaction on wallet to complete.",
                action: () => dispatch(reduxActions.wallet.withdraw(
                    item.network,
                    item.contractAddress,
                    convertAmountToRawNumber(amount, item.tokenDecimals),
                    formData.withdraw.max
                )),
                pending: false,
            });

            setSteps({modal: true, currentStep: 0, items: steps, finished: false});
        }
    }

    const handleClose = () => {
        updateItemData();
        resetFormData();
        setSteps({modal: false, currentStep: -1, items: [], finished: false});
    }

    React.useEffect(() => {
        let amount = 0;
        if(wallet.address && !isEmpty(balance.tokens[item.rewardAddress])) {
            amount = byDecimals(new BigNumber(balance.tokens[item.rewardAddress].balance).multipliedBy(byDecimals(item.pricePerShare)), item.tokenDecimals).toFixed(8);
        }
        setState({balance: amount});
    }, [wallet.address, item, balance]);

    React.useEffect(() => {
        const index = steps.currentStep;
        if(!isEmpty(steps.items[index]) && steps.modal) {
            const items = steps.items;
            if(!items[index].pending) {
                items[index].pending = true;
                items[index].action();
                setSteps({...steps, items: items});
            } else {
                if(wallet.action.result === 'success' && !steps.finished) {
                    const nextStep = index + 1;
                    if(!isEmpty(items[nextStep])) {
                        setSteps({...steps, currentStep: nextStep});
                    } else {
                        setSteps({...steps, finished: true});
                    }
                }
            }
        }
    }, [steps, wallet.action]);

    return (
        <React.Fragment>
            <Grid container spacing={2}>
                <Grid item xs={4} align={"left"}>
                    <Typography className={classes.withdrawItemText}>{t('fairplayUnlock')}</Typography>
                </Grid>
                <Grid item xs={7} align={"right"}>
                    <Typography className={classes.withdrawItemValue}>14d 00h 00m</Typography>
                </Grid>
                <Grid item xs={4} align={"left"}>
                    <Typography className={classes.withdrawItemText}>{t('yourDeposit')}</Typography>
                </Grid>
                <Grid item xs={7} align={"right"}>
                    <Typography className={classes.withdrawItemValue}>{state.balance} {item.token}</Typography>
                </Grid>
                <Grid item xs={11}>
                    <Paper component="form" className={classes.input}>
                        <Grid container spacing={1}>
                            <Grid item xs={2} alignItems={"center"} justifyContent={"center"}>
                                <img alt="TokenIcon" className={classes.tokenIcon} src={require('../../../../images/tokens/cakeMoonMiniIcon.svg').default} />
                            </Grid>
                            <Grid item xs={6}>
                                <InputBase placeholder={t('enterCoinAmount', {coin: item.token})} value={formData.withdraw.amount} onChange={(e) => handleInput(e.target.value)} />
                            </Grid>
                            <Grid item xs={4} align={"right"}>
                                <Button className={classes.potsMaxButton} onClick={handleMax}>Max</Button>
                            </Grid>
                        </Grid> 
                    </Paper>
                </Grid>
                <Grid item xs={11}>
                    {wallet.address ? (
                            <Button onClick={handleWithdraw} className={classes.actionBtn} disabled={formData.withdraw.amount <= 0}>Withdraw {formData.withdraw.max && formData.withdraw.amount > 0 ? ('All') : ''}</Button>
                    ) : (
                        <Button onClick={handleWalletConnect} className={classes.connectWalletBtn} variant={'contained'}>{t('buttons.connectWallet')}</Button>
                    )}
                    <Steps item={item} steps={steps} handleClose={handleClose} />
                </Grid>
                
                <Grid item xs={11}>
                    <Typography className={classes.withdrawPenaltyWarning}>
                        <Trans i18nKey="vaultWithdrawPenaltyWarning" values={{token: item.token}} />
                    </Typography>
                </Grid>
                
            </Grid>
        </React.Fragment>
    );
};

export default Withdraw;