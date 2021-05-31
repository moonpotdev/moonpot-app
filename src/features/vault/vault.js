import * as React from "react";
import {useParams} from "react-router";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import AnimateHeight from 'react-animate-height';
import reduxActions from "../redux/actions";
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

const useStyles = makeStyles(styles);
let isLoading = true;

const getVault = (pools, id) => {
    if(pools.length === 0) {
        return false;
    }
    for(let key in pools) {
        if(pools[key].id === id) {
            return pools[key];
        }
    }
}

const Vault = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();
    const [withdrawOpen, setWithdrawOpen] = React.useState(false);

    let { id } = useParams();
    let vault = {};
    const vaultReducer = useSelector(state => state.vaultReducer);

    React.useEffect(() => {
        dispatch(reduxActions.vault.fetchPools(false));
        dispatch(reduxActions.wallet.fetchRpc());
    }, [dispatch]);

    vault = getVault(vaultReducer.pools, id);

    if(vault) {
        isLoading = false;
    } else {
        if(vaultReducer.lastUpdated > 0) {
            history.push('/error');
        }
    }

    return (
        <div className="App">
            {isLoading ? (
            <Container maxWidth="lg">
                <Loader message="Getting vault data..." />
            </Container>
            ) : (
            <Container maxWidth="lg">
                <Typography className={classes.title}>Deposit <span>{vault.name}</span>, earn 147% APY and a chance to win $587,338</Typography>
                <Box className={classes.potItem}>
                    <Grid container>
                        <Grid item xs={4}>
                            <Typography className={classes.countdown}>1d 23h 15m</Typography>
                            <Typography className={classes.subTitle}>Next Weekly Draw</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Box className={classes.potImage}>
                                <img alt="Moonpot" src={require('../../images/pots/bitcoin.svg').default} />
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.apy}>10% APY</Typography>
                            <Typography className={classes.subTitle} align={'right'} style={{textDecoration: 'underline'}}>Interest Rate</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography className={classes.potUsd}><span>Win</span> $14,625 in {vault.name}</Typography>
                            <Typography className={classes.potCrypto}>USD value of <span>16,400 Cake</span> prize</Typography>
                        </Grid>
                        <Grid item xs={12}>
                                <TextField className={classes.input} placeholder="Enter Cake Amount" InputProps={{disableUnderline: true, classes: {root: classes.inputRoot}}} />
                                <Button className={classes.actionBtn} variant={'contained'} color="primary">Deposit</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography className={classes.timelockRemaining}>Two Weeks</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Link href={"a"} className={classes.link}>Fairplay Timelock</Link>
                        </Grid>
                        <Grid item xs={6} style={{textAlign: 'right'}}>
                            <Link onClick={() => {setWithdrawOpen(!withdrawOpen)}} className={classes.link} style={{paddingRight: '15px'}}>Withdraw {withdrawOpen ? (<ArrowDropUp />) : (<ArrowDropDown />)}</Link>
                        </Grid>
                        <AnimateHeight duration={ 500 } height={ withdrawOpen ? 'auto' : 0 }>
                            <Grid item xs={12}>
                                <Typography className={classes.withdrawPenaltyWarning}>You can withdraw upto <span>2.52 CAKE</span> without any Fairplay Penalty.</Typography>
                                <TextField className={classes.input} placeholder="2.52 CAKE" InputProps={{disableUnderline: true, classes: {root: classes.inputRoot}}} />
                                <Button className={classes.actionBtn} variant={'contained'} color="primary">Withdraw</Button>
                            </Grid>
                        </AnimateHeight>

                    </Grid>
                </Box>
            </Container>
            )}
        </div>
    )
};

export default Vault;
