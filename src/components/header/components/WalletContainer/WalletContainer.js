import React from "react";
import {makeStyles, Box, Grid, Button} from "@material-ui/core";
import styles from "./styles"
import reduxActions from "../../../../features/redux/actions";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../../../loader";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(styles);

const formatAddress = (addr) => {
    return addr.substr(0,3) + '...' + addr.substr(addr.length - 4, 4);
}

const WalletContainer = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const walletReducer = useSelector(state => state.walletReducer);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleWalletConnect = () => {
        if(!walletReducer.address) {
            console.log('called connect')
            dispatch(reduxActions.wallet.connect());
        } else {
            console.log('called disconnect')
            dispatch(reduxActions.wallet.disconnect());
        }
    }

    return (
        <Box className={classes.btnWrapper}>
            <Button variant={'outlined'} onClick={handleWalletConnect}>
                <Grid container direction="row" alignItems="center">
                    {walletReducer.pending ? (
                        <Box className={classes.loading}>
                            <Loader line={true} />
                        </Box>
                    ) : (
                        <React.Fragment>
                            <Box className={classes.icon}>
                                <img alt="Ziggy" src={require('../../../../images/bsc.svg').default} />
                            </Box>
                            {walletReducer.address ? formatAddress(walletReducer.address) : t('buttons.connectWallet')}
                        </React.Fragment>
                    )}
                </Grid>
            </Button>
            {walletReducer.address ? (
                <Button onClick={() => {history.push('/my-moonpots')}} variant={'outlined'} style={{marginLeft: 10}}>
                    <Box className={classes.icon}>
                        <img alt="Ziggy" src={require('../../../../images/ziggy.svg').default} />
                    </Box>
                    {t('buttons.myMoonpots')}
                </Button>
            ) : '' }
        </Box>
    )
}

export default WalletContainer;
