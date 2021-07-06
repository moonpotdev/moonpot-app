import {Button, InputBase, makeStyles, Paper, Typography} from "@material-ui/core";
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
            <Typography className={classes.withdrawPenaltyWarning}>
                <Trans i18nKey="vaultWithdrawPenaltyWarning" values={{amount: state.balance, coin: item.token}} />
            </Typography>
            <Paper component="form" className={classes.input}>
                <InputBase placeholder="0.00" value={formData.withdraw.amount} onChange={(e) => handleInput(e.target.value)} />
                <Button onClick={handleMax}>Max</Button>
            </Paper>
            {wallet.address ? (
                    <Button onClick={handleWithdraw} className={classes.actionBtn} variant={'contained'} color="primary" disabled={formData.withdraw.amount <= 0}>Withdraw {formData.withdraw.max ? ('All') : ''}</Button>
            ) : (
                <Button onClick={handleWalletConnect} className={classes.actionBtn} variant={'contained'} color="primary">{t('buttons.connectWallet')}</Button>
            )}
            <Steps item={item} steps={steps} handleClose={handleClose} />
        </React.Fragment>
    );
};

export default Withdraw;