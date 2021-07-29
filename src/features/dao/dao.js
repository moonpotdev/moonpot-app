import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Box, Button, Container, Divider, Grid, Link, makeStyles, Typography} from '@material-ui/core';
import styles from './styles';
import {Trans, useTranslation} from 'react-i18next';
import reduxActions from '../redux/actions';
import {useMemo} from "react";
import {safepalWHO} from "../../config/dao/safepal";
import {cakeV1Users} from "../../config/dao/cakev1";
import {bifiMaxiUsers} from "../../config/dao/bifimaxi";
import {isEmpty} from "../../helpers/utils";
import {byDecimals} from "../../helpers/format";
import BigNumber from "bignumber.js";

const useStyles = makeStyles(styles);

const Dao = () => {
    const {wallet, balance} = useSelector(state => ({
        wallet: state.walletReducer,
        balance: state.balanceReducer,
    }));
    const dispatch = useDispatch();
    const classes = useStyles();
    const [userStatus, setUserStatus] = React.useState({
        safepalAirdrop: 0,
        isBifiMaxi: false,
        isCakeV1: false,
        isCakeV2: false
    });

    const handleWalletConnect = () => {
        if (!wallet.address) {
            dispatch(reduxActions.wallet.connect());
        }
    }

    React.useEffect(() => {
        if (wallet.address) {
            dispatch(reduxActions.balance.fetchBalances());
        }
    }, [dispatch, wallet.address]);

    React.useEffect(() => {
        if (wallet.address) {
            const address = wallet.address.toLowerCase()
            const safepalAirdrop = safepalWHO[address] ?? 0
            const isBifiMaxi = bifiMaxiUsers.includes(address)
            const isCakeV1 = cakeV1Users.includes(address)
            let isCakeV2 = false
            const cakeV2 = balance.tokens["potCAKEv2"]
            if (!isEmpty(cakeV2)) {
                isCakeV2 = byDecimals(new BigNumber(cakeV2.balance), 18).gte(10)
            }
            setUserStatus({safepalAirdrop, isBifiMaxi, isCakeV1, isCakeV2})
        }
    }, [dispatch, wallet.address, balance]);

    return (
        <React.Fragment>
            <Container maxWidth="xl">
                <Box>
                    <Grid container>
                        {userStatus.safepalAirdrop >= 0 ?
                            <Grid item xs={12} md={3}>
                                <Box className={classes.block}>
                                    <Typography className={classes.h1}>
                                        <Trans i18nKey="safePalAirdrop"/>
                                    </Typography>
                                    <Typography>{userStatus.safepalAirdrop} POTS</Typography>
                                </Box>
                            </Grid>
                            : ''}
                    </Grid>
                </Box>
            </Container>
        </React.Fragment>
    );
};

export default Dao;
