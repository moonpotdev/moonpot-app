import * as React from "react";
import { useHistory } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import reduxActions from "../redux/actions";

import {Button, Container, Grid, makeStyles, Typography} from "@material-ui/core"
import Box from '@material-ui/core/Box';
import styles from "./styles"
import {isEmpty} from "../../helpers/utils";

const useStyles = makeStyles(styles);
const defaultFilter = {
    status: 'active',
}

const UseSortableData = (items, config = null) => {
    const [sortConfig, setSortConfig] = React.useState(config);

    const sortedItems = React.useMemo(() => {
        let sortableItems = isEmpty(items) ? [] : [...items];

        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
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
        return sortableItems;
    }, [items, sortConfig]);

    const setFilter = (obj) => {
        setSortConfig({ ...sortConfig, ...obj});
    }

    return { items: sortedItems, sortConfig, setFilter};
};

const Dashboard = () => {
    const dispatch = useDispatch();
    const {vault, wallet} = useSelector(state => ({
        vault: state.vaultReducer,
        wallet: state.walletReducer,
    }));

    const history = useHistory();
    const classes = useStyles();
    const {items, sortConfig, setFilter} = UseSortableData(vault.pools, defaultFilter);

    React.useEffect(() => {
        dispatch(reduxActions.vault.fetchPools());
        dispatch(reduxActions.wallet.fetchRpc());
    }, [dispatch]);

    const filter = () => {
        if(items.length > 0) {
            const filtered = items.filter((item) => {
                if(item.status !== sortConfig.status) {
                    return false;
                }

                /*if(item.deposited === 0) {
                    return false;
                }*/

                return item;
            });

            return filtered;
        }
        return false;
    };

    const ShowMyPots = ({items}) => {
        const filtered = filter();

        if(filtered.length === 0) {
            return (
                <React.Fragment>
                    <Grid item xs={7} className={classes.empty}>
                        <Typography variant={"body1"}>You don't have any finished Pots yet.</Typography>
                        <Typography variant={"body1"}>Ziggy will let you know about them here, as soon as you do.</Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <img alt="Ziggy" src={require('../../images/ziggy/emptydeposit.svg').default} />
                    </Grid>
                </React.Fragment>
            );
        } else {
            return (
                filtered.map(item => (
                    <Box className={classes.potItem} key={item.id}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Box className={classes.potImage}>
                                    <img alt="Moonpot" src={require('../../images/pots/bitcoin.svg').default} />
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box display={"flex"}>
                                    <Box mr={5} mb={2} className={classes.split}>
                                        <Typography variant={"h1"} align={"right"}>16.4k CAKE</Typography>
                                        <Typography variant={"h3"} align={"right"}>CAKE PRIZE</Typography>
                                        <Typography className={classes.seperator} variant={"h2"} align={"right"}>3d 23h 14min</Typography>
                                        <Typography variant={"h3"} align={"right"}>Next Draw</Typography>
                                        <Typography className={classes.seperator} variant={"h2"} align={"right"}>May 14 2021</Typography>
                                        <Typography variant={"h3"} align={"right"}>My Fairplay Unlock</Typography>
                                    </Box>
                                    <Box ml={5} mb={2} className={classes.split}>
                                        <Typography variant={"h2"}>2.52 CAKE</Typography>
                                        <Typography variant={"h3"}>My Deposit</Typography>
                                        <Typography className={classes.seperator} variant={"h2"}>147% APY</Typography>
                                        <Typography variant={"h3"}>My Interest Rate</Typography>
                                        <Typography className={classes.seperator} variant={"h2"}>1 in 420000</Typography>
                                        <Typography variant={"h3"}>My Odds</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Box p={1}>
                                            <Button className={classes.btn} variant={'contained'} color="primary">Withdraw</Button>
                                        </Box>

                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box p={1}>
                                            <Button className={classes.btn} variant={'contained'} color="primary">Deposit More</Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                ))
            )
        }
    }

    return (
        <React.Fragment>
            {wallet.address ? (
                <Container maxWidth="xl">
                    <Typography className={classes.h1}>You're in one <span>Moonpot</span>, with<br /> the chance to win $914,279</Typography>
                    <Box>
                        <Box display="flex">
                            <Box p={1}>
                                <Button variant={"outlined"} color={sortConfig.status === 'active' ? 'primary' : 'default'} onClick={() => setFilter({status: 'active'})}>My Active Pots</Button>
                            </Box>
                            <Box p={1}>
                                <Button variant={"outlined"} color={sortConfig.status !== 'active' ? 'primary' : 'default'} onClick={() => setFilter({status: 'eol'})}>My Finished Pots</Button>
                            </Box>
                        </Box>
                        <Grid container>
                            {items.length === 0 ? '' : (
                                <ShowMyPots items={items} />
                            )}
                        </Grid>
                        <Box textAlign={"center"} p={3}>
                            <Button variant={"outlined"} onClick={() => {history.push('/')}}>Play in More Pots</Button>
                        </Box>
                    </Box>
                </Container>
            ) : (
                <Box textAlign={"center"} p={3}>
                    <Button variant={"outlined"}>Connect Wallet</Button>
                </Box>
            )}
        </React.Fragment>
    );
};

export default Dashboard;
