import * as React from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {useLocation} from 'react-router';
import {useDispatch, useSelector} from 'react-redux';
import AnimateHeight from 'react-animate-height';
import {Box, Button, Container, Divider, Grid, Link, makeStyles, Typography} from '@material-ui/core';
import {ExpandLess, ExpandMore} from '@material-ui/icons';
import styles from './styles';
import {Trans, useTranslation} from 'react-i18next';
import reduxActions from '../redux/actions';
import Deposit from '../vault/components/Deposit';
import Withdraw from '../vault/components/Withdraw';
import BigNumber from 'bignumber.js';
import {investmentOdds, isEmpty} from '../../helpers/utils';
import {byDecimals, calculateTotalPrize, formatDecimals} from '../../helpers/format';
import Countdown from '../../components/Countdown';
import Steps from '../vault/components/Steps';

const useStyles = makeStyles(styles);

const VALID_STATUSES = ['active', 'eol'];
const defaultFilter = {
    status: 'active',
}
const getDefaultFilter = (params = {}) => {
    if ('status' in params && VALID_STATUSES.includes(params.status)) {
        return {...defaultFilter, status: params.status};
    }

    return defaultFilter;
};

const Dashboard = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const history = useHistory();
    const {vault, wallet, balance, prices, earned} = useSelector(state => ({
        vault: state.vaultReducer,
        wallet: state.walletReducer,
        balance: state.balanceReducer,
        prices: state.pricesReducer,
        earned: state.earnedReducer,
    }));
    const params = useParams();
    const dispatch = useDispatch();
    const classes = useStyles();
    const [detailsOpen, setDetailsOpen] = React.useState(location.detailsOpen);
    const [bonusOpen, setBonusOpen] = React.useState(location.bonusOpen);
    const [depositOpen, setDepositOpen] = React.useState(location.depositOpen);
    const [withdrawOpen, setWithdrawOpen] = React.useState(location.withdrawOpen);
    const [prizeSplitOpen, setPrizeSplitOpen] = React.useState(location.prizeSplitOpen);
    const [sortConfig, setSortConfig] = React.useState(getDefaultFilter(params));
    const [filtered, setFiltered] = React.useState([]);
    const [formData, setFormData] = React.useState({deposit: {amount: '', max: false}, withdraw: {amount: '', max: false}});
    const [steps, setSteps] = React.useState({modal: false, currentStep: -1, items: [], finished: false});

    const handleWalletConnect = () => {
        if(!wallet.address) {
            dispatch(reduxActions.wallet.connect());
        }
    }

    const handleMigrator = (item) => {
        if(wallet.address) {
            const steps = [];
            const rewardApproved = balance.tokens[item.rewardToken].allowance[item.contractAddress];
            if(!rewardApproved) {
                steps.push({
                    step: "approve",
                    message: "Approval transaction happens once per pot.",
                    action: () => dispatch(reduxActions.wallet.approval(
                        item.network,
                        item.rewardAddress,
                        item.contractAddress
                    )),
                    pending: false,
                });
            }

            steps.push({
                step: "withdraw",
                message: "Confirm withdraw transaction on wallet to complete.",
                action: () => dispatch(reduxActions.wallet.withdraw(
                    item.network,
                    item.contractAddress,
                    balance.tokens[item.rewardToken].balance,
                    true
                )),
                pending: false,
            });

            const tokenApproved = balance.tokens[item.token].allowance[item.migrationContractAddress];
            if(!tokenApproved) {
                steps.push({
                    step: "approve",
                    message: "Approval transaction happens once per pot.",
                    action: () => dispatch(reduxActions.wallet.approval(
                        item.network,
                        item.tokenAddress,
                        item.migrationContractAddress,
                    )),
                    pending: false,
                });
            }

            steps.push({
                step: "deposit",
                message: "Confirm deposit transaction on wallet to complete.",
                action: () => dispatch(reduxActions.wallet.deposit(
                    item.network,
                    item.migrationContractAddress,
                    balance.tokens[item.rewardToken].balance,
                    false
                )),
                pending: false,
            });

            setSteps({modal: true, currentStep: 0, items: steps, finished: false});
        }
    }

    const handleWithdrawBonus = (item) => {
        if(wallet.address) {
            const steps = [];
            steps.push({
                step: "reward",
                message: "Confirm withdraw transaction on wallet to complete.",
                action: () => dispatch(reduxActions.wallet.getReward(
                    item.network,
                    item.contractAddress
                )),
                pending: false,
            });
            setSteps({modal: true, currentStep: 0, items: steps, finished: false});
        }
    }

    const handleClose = () => {
        updateItemData();
        setSteps({modal: false, currentStep: -1, items: [], finished: false});
    }

    const updateItemData = () => {
        if(wallet.address) {
            dispatch(reduxActions.vault.fetchPools());
            dispatch(reduxActions.balance.fetchBalances());
            dispatch(reduxActions.earned.fetchEarned());
        }
    }

    const resetFormData = () => {
        setFormData({deposit: {amount: '', max: false}, withdraw: {amount: '', max: false}});
    }

    React.useEffect(() => {
        let data = [];

        const sorted = (items) => {
            return items.sort((a, b) => {
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
        const check = (item) => {
            if(item.status !== sortConfig.status) {
                return false;
            }

            if(Number(balance.tokens[item.rewardToken].balance) === 0) {
                return false;
            }

            return item;
        }

        for (const [, item] of Object.entries(vault.pools)) {
            if(check(item)) {

                let amount = 0;

                if(wallet.address && !isEmpty(balance.tokens[item.rewardToken])) {
                    item.userBalance = byDecimals(new BigNumber(balance.tokens[item.rewardToken].balance), item.tokenDecimals);
                }
                if(wallet.address && !isEmpty(earned.earned[item.id])) {

                    const amount = earned.earned[item.id][item.sponsorToken] ?? 0
                    const boostAmount = earned.earned[item.id][item.boostToken] ?? 0
                    item.earned = byDecimals(new BigNumber(amount), item.sponsorTokenDecimals);
                    item.boosted = byDecimals(new BigNumber(boostAmount), item.boostTokenDecimals);

                    console.log(item)

                }
                data.push(item);
            }
        }

        if (sortConfig !== null) {
            data = sorted(data);
        }

        setFiltered(data);

    }, [sortConfig, vault.pools, balance, earned]);

    React.useEffect(() => {
        if(prices.lastUpdated > 0) {
            dispatch(reduxActions.vault.fetchPools());
        }
    }, [dispatch, prices.lastUpdated]);

    React.useEffect(() => {
        if(wallet.address) {
            dispatch(reduxActions.balance.fetchBalances());
            dispatch(reduxActions.earned.fetchEarned());
        }
    }, [dispatch, wallet.address]);

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
                <Container maxWidth="lg">
                        <Grid container spacing={2}>
                            <Grid item>
                                <Button variant={"outlined"} color={sortConfig.status === 'active' ? 'primary' : 'default'} onClick={() => setSortConfig({ ...sortConfig, status: 'active' })}>{t('buttons.myActivePots')}</Button>
                            </Grid>
                            <Grid item>
                                <Button variant={"outlined"} color={sortConfig.status !== 'active' ? 'primary' : 'default'} onClick={() => setSortConfig({ ...sortConfig, status: 'eol' })}>{t('buttons.myPastPots')}</Button>
                            </Grid>
                        </Grid>
                        <Grid container>
                            {filtered.length === 0 ?

                                <Box className={classes.noActivePots}>
                                    <Grid container>
                                        <Grid item xs={5}>
                                            <img className={classes.noActivePotsImage} alt="No Active Moonpots" src={require('../../images/ziggy/noActivePots.svg').default} />
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Typography className={classes.noActivePotsTitle}>{t('playWithMoonpot')}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography className={classes.noActivePotsText}>{t('youHaventEnteredMoonpots')}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                            className={classes.noActivePotsPlayButton}
                                            onClick={() => {history.push('/')}}
                                            >
                                                {t('buttons.play')}
                                            </Button>
                                        </Grid>
                                    </Grid>

                                </Box>

                            : (
                                filtered.map(item => (
                                    <Box className={(item.status == "active") ? classes.activeMyPot : classes.eolMyPot} key={item.id}>
                                        <Grid container spacing={0}>
                                            <Grid item xs={4} align={"left"}>
                                                <Box className={classes.potImage}>
                                                    <img
                                                    alt={`Moonpot ${item.sponsorToken}`}
                                                    srcSet={`
                                                        images/pots/${item.token.toLowerCase()}/sponsored/${item.sponsorToken.toLowerCase()}@4x.png 4x,
                                                        images/pots/${item.token.toLowerCase()}/sponsored/${item.sponsorToken.toLowerCase()}@3x.png 3x,
                                                        images/pots/${item.token.toLowerCase()}/sponsored/${item.sponsorToken.toLowerCase()}@2x.png 2x,
                                                        images/pots/${item.token.toLowerCase()}/sponsored/${item.sponsorToken.toLowerCase()}@1x.png 1x
                                                    `}
                                                    />
                                                </Box>
                                            </Grid>

                                            {
                                                (item.status == "active") ?
                                                // =================
                                                // Active Layout
                                                // =================
                                                <React.Fragment>
                                                    <Grid item xs={8}>
                                                        <Typography className={classes.potUsdTop} align={"right"}>${Number((calculateTotalPrize(item, prices)).substring(1)).toLocaleString()} <span>{t('in')}</span> {item.token}</Typography>
                                                        <Typography className={classes.potUsd} align={"right"}>& {item.sponsorToken} PRIZES</Typography>
                                                        <Typography className={classes.myPotsNextWeeklyDrawText} align={"right"}>{t('prize')}: <span><Countdown until={item.expiresAt*1000} /> </span></Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Divider className={classes.divider}/>
                                                    </Grid>
                                                    <Grid item xs={9} align={"left"} style={{paddingBottom: 0}}>
                                                        <Typography className={classes.dividerText} onClick={() => {setDetailsOpen(!detailsOpen)}}>{t('myDetails')} </Typography>
                                                    </Grid>
                                                    <Grid item xs={3} align={"right"} style={{paddingBottom: 0}}>
                                                        <Link onClick={() => {setDetailsOpen(!detailsOpen)}} className={classes.expandToggle}>{detailsOpen ? (<ExpandLess />) : (<ExpandMore />)}</Link>
                                                    </Grid>
                                                    <Grid item xs={12} >
                                                        <AnimateHeight duration={ 500 } height={ detailsOpen ? 'auto' : 0 }>
                                                            <Grid container>
                                                                <Grid item xs={6}>
                                                                    <Typography className={classes.myDetailsText} align={'left'}>
                                                                        <Trans i18nKey="myToken" values={{token: item.token}}/>
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <Typography className={classes.myDetailsValue} align={'right'}>{formatDecimals(item.userBalance)} {item.token} (${formatDecimals(item.userBalance.multipliedBy(prices.prices[item.oracleId]), 2)})</Typography>
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <Typography className={classes.myDetailsText} align={'left'}>{t('myInterestRate')}</Typography>
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <Typography className={classes.myDetailsValue} align={"right"}>{item.bonusApy > 0 ? new BigNumber(item.apy).plus(item.bonusApy).toFixed(2) : item.apy}% APY</Typography>
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <Typography className={classes.myDetailsText} align={'left'}>{t('myOdds')}</Typography>
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <Typography className={classes.myDetailsValue} align={"right"}>{t('odds', {odds: investmentOdds(item.totalStakedUsd, item.userBalance.times(prices.prices[item.oracleId]), 5)})}</Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </AnimateHeight>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Divider className={classes.divider}/>
                                                    </Grid>
                                                    <Grid item xs={9} align={"left"} style={{paddingBottom: 0}}>
                                                        <Typography className={classes.dividerText} onClick={() => {setBonusOpen(!bonusOpen)}}>
                                                            <Trans i18nKey="bonusEarnings"/>
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={3} align={"right"} style={{paddingBottom: 0}}>
                                                        <Link onClick={() => {setBonusOpen(!bonusOpen)}} className={classes.expandToggle}>{bonusOpen ? (<ExpandLess />) : (<ExpandMore />)}</Link>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <AnimateHeight duration={ 500 } height={ bonusOpen ? 'auto' : 0 }>
                                                            <Grid container>
                                                                <Grid item xs={6}>
                                                                    <Typography className={classes.myDetailsText} align={'left'}>
                                                                        <Trans i18nKey="myBonusEarnings"/>
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <Typography className={classes.myDetailsValue} align={'right'}>{formatDecimals(item.earned)} {item.sponsorToken} (${formatDecimals(item.earned.multipliedBy(prices.prices[item.sponsorToken]),2)})</Typography>
                                                                </Grid>
                                                                { item.boostToken ? 
                                                                <React.Fragment>
                                                                    <Grid item xs={6}>
                                                                        <Typography className={classes.myDetailsText} align={'left'}>
                                                                            <Trans i18nKey="myBoostEarnings"/>
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <Typography className={classes.myDetailsValue} align={'right'}>{formatDecimals(item.boosted)} {item.boostToken} (${formatDecimals(item.boosted.multipliedBy(prices.prices[item.boostToken]), 2)})</Typography>
                                                                    </Grid>
                                                                    <Grid item xs={12}>
                                                                        <Typography className={classes.myPotsInfoText} align={'left'}>
                                                                            <Trans i18nKey="bonusExtraInfo" values={{sponsorToken: item.sponsorToken, boostToken: item.boostToken}}/>
                                                                        </Typography>
                                                                    </Grid>
                                                                </React.Fragment>
                                                                :
                                                                ''
                                                                }
                                                                <Grid item xs={12} >
                                                                    <Button onClick={() => handleWithdrawBonus(item)} className={item.earned.lte(0) ? classes.disabledActionBtn : classes.enabledActionBtn} variant={'contained'} disabled={item.earned.lte(0)}>
                                                                        Withdraw Bonus {item.sponsorToken} { item.boostToken ? 'and ' + item.boostToken : ('')}
                                                                    </Button>
                                                                    <Steps item={item} steps={steps} handleClose={handleClose} />
                                                                </Grid>


                                                            </Grid>
                                                        </AnimateHeight>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Divider className={classes.divider}/>
                                                    </Grid>
                                                    <Grid item xs={9} align={"left"} style={{paddingBottom: 0}}>
                                                        <Typography className={classes.dividerText} onClick={() => {setDepositOpen(!depositOpen)}}>{t('depositMore')} </Typography>
                                                    </Grid>
                                                    <Grid item xs={3} align={"right"} style={{paddingBottom: 0}}>
                                                        <Link onClick={() => {setDepositOpen(!depositOpen)}} className={classes.expandToggle}>{depositOpen ? (<ExpandLess />) : (<ExpandMore />)}</Link>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <AnimateHeight duration={ 500 } height={ depositOpen ? 'auto' : 0 }>
                                                            <Box style={{padding: '4px 0 20px 0'}}>
                                                                <Deposit
                                                                    item={item}
                                                                    handleWalletConnect={handleWalletConnect}
                                                                    formData={formData}
                                                                    setFormData={setFormData}
                                                                    updateItemData={updateItemData}
                                                                    resetFormData={resetFormData}
                                                                    depositMore={true}
                                                                />
                                                                <Grid item xs={12}>
                                                                    <Typography className={classes.depositMoreExtraInfo}>
                                                                        {t('depositMoreExtraInfo')}
                                                                    </Typography>
                                                                </Grid>
                                                            </Box>

                                                        </AnimateHeight>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Divider className={classes.divider}/>
                                                    </Grid>
                                                    <Grid item xs={9} align={"left"} style={{paddingBottom: '0'}}>
                                                        <Typography className={classes.dividerText} style={{marginBottom: '0'}} onClick={() => {setWithdrawOpen(!withdrawOpen)}}>{t('withdraw')} </Typography>
                                                    </Grid>
                                                    <Grid item xs={3} align={"right"} style={{paddingBottom: '0'}}>
                                                        <Link onClick={() => {setWithdrawOpen(!withdrawOpen)}} style={{marginBottom: '0'}} className={classes.expandToggle}>{withdrawOpen ? (<ExpandLess />) : (<ExpandMore />)}</Link>
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
                                                </React.Fragment>
                                                :
                                                // =================
                                                // EOL Layout
                                                // =================
                                                <React.Fragment>
                                                    <Grid item xs={8}>
                                                        <Typography className={classes.potUsdTop} align={"right"}>Retired {item.token}</Typography>
                                                        <Typography className={classes.potUsd} align={"right"}>Moonpot</Typography>
                                                        <Typography className={classes.myPotsNextWeeklyDrawText} align={"right"}>{t('prize')}: <span>Closed</span></Typography>
                                                    </Grid>
                                                    <Grid item xs={12} align={"left"} >
                                                        <Typography className={classes.dividerText}>{t('myDetails')} </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} >
                                                        <Grid container>
                                                            <Grid item xs={6}>
                                                                <Typography className={classes.myDetailsText} align={'left'}>
                                                                    <Trans i18nKey="myToken" values={{token: item.token}}/>
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <Typography className={classes.myDetailsValue} align={'right'}>{formatDecimals(item.userBalance)} {item.token} (${formatDecimals(item.userBalance.multipliedBy(prices.prices[item.oracleId]),2)})</Typography>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <Typography className={classes.myDetailsText} align={'left'}>{t('myInterestRate')}</Typography>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <Typography className={classes.myDetailsValue} align={"right"}>0% APY</Typography>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <Typography className={classes.myDetailsText} align={'left'} style={{marginBottom: '20px'}}>
                                                                    <Trans i18nKey="myBonusEarnings"/>
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <Typography className={classes.myDetailsValue} align={'right'}>{formatDecimals(item.earned)} {item.sponsorToken} (${formatDecimals(item.earned.multipliedBy(prices.prices[item.sponsorToken]),2)})</Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    { item.migrationContractAddress ? 
                                                    <React.Fragment>

                                                    
                                                        <Grid item xs={12}>
                                                                <Grid container>

                                                                    <Grid item xs={12}>
                                                                        <Typography className={classes.myPotsUpgradeText} align={'left'}>
                                                                            <Trans i18nKey="upgradeWhy" values={{token: item.token}}/>
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item xs={12}>
                                                                        <Typography className={classes.myPotsUpgradeText} align={'left'}>
                                                                            <Trans i18nKey="upgradeNextSteps" values={{token: item.token, amount: "50,000", boostToken: "BNB"}}/>
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item xs={12}>
                                                                        <Typography className={classes.learnMoreText} align={'left'}>
                                                                            <Trans i18nKey="learnMore"/>
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item xs={12}>
                                                                        <Button onClick={() => handleMigrator(item)} className={item.userBalance.lte(0) ? classes.disabledActionBtn : classes.eolMoveBtn} variant={'contained'} disabled={item.userBalance.lte(0)}>
                                                                            Move {item.token} and Withdraw {item.sponsorToken}
                                                                        </Button>
                                                                        <Steps item={item} steps={steps} handleClose={handleClose} />
                                                                    </Grid>
                                                                    <Grid item xs={6} align={"left"}>
                                                                        <Typography className={classes.potsItemText} style={{marginTop: '12px'}}>
                                                                            <Trans i18nKey="myFairplayTimelock"/>
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item xs={6} align={"right"}>
                                                                        <Typography className={classes.potsItemValue}>00d 00h 00m</Typography>
                                                                    </Grid>
                                                                    <Grid item xs={6} align={"left"}>
                                                                        <Typography className={classes.potsItemText}>
                                                                            <Trans i18nKey="myCurrentFairnessFee"/>
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item xs={6} align={"right"}>
                                                                        <Typography className={classes.potsItemValue}>0 {item.token}</Typography>
                                                                    </Grid>


                                                                </Grid>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Divider className={classes.divider}/>
                                                        </Grid>

                                                        <Grid item xs={9} align={"left"} >
                                                            <Typography className={classes.dividerText} onClick={() => {setWithdrawOpen(!withdrawOpen)}}>
                                                                <Trans i18nKey="withdrawTokenAndSponsorToken" values={{token: item.token, sponsorToken: item.sponsorToken}}/>
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={3} align={"right"} style={{paddingRight: 0}}>
                                                            <Link onClick={() => {setWithdrawOpen(!withdrawOpen)}} className={classes.expandToggle}>{withdrawOpen ? (<ExpandLess />) : (<ExpandMore />)}</Link>
                                                        </Grid>
                                                        <Grid item xs={12} >
                                                            <AnimateHeight duration={ 500 } height={ withdrawOpen ? 'auto' : 0 } style={{marginBottom: '12px'}}>
                                                                    <Withdraw
                                                                        item={item}
                                                                        handleWalletConnect={handleWalletConnect}
                                                                        formData={formData}
                                                                        setFormData={setFormData}
                                                                        updateItemData={updateItemData}
                                                                        resetFormData={resetFormData}
                                                                        retiredFlag={true}
                                                                    />
                                                            </AnimateHeight>
                                                        </Grid>
                                                    </React.Fragment>
                                                    :
                                                    // ----------------
                                                    // Standard eol pot
                                                    // ----------------
                                                    <React.Fragment>
                                                        <Grid item xs={12}>
                                                            <Divider className={classes.divider}/>
                                                        </Grid>
                                                        <Grid item xs={9} align={"left"} style={{paddingBottom: 0}}>
                                                            <Typography className={classes.dividerText} style={{marginBottom: '16px'}} onClick={() => {setBonusOpen(!bonusOpen)}}>
                                                                <Trans i18nKey="bonusEarnings"/>
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={3} align={"right"} style={{paddingBottom: 0}}>
                                                            <Link onClick={() => {setBonusOpen(!bonusOpen)}} className={classes.expandToggle}>{bonusOpen ? (<ExpandLess />) : (<ExpandMore />)}</Link>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <AnimateHeight duration={ 500 } height={ bonusOpen ? 'auto' : 0 }>
                                                                <Grid container>
                                                                    <Grid item xs={6}>
                                                                        <Typography className={classes.myDetailsText} align={'left'}>
                                                                            <Trans i18nKey="myBonusEarnings"/>
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <Typography className={classes.myDetailsValue} align={'right'}>{formatDecimals(item.earned)} {item.sponsorToken} (${formatDecimals(item.earned.multipliedBy(prices.prices[item.sponsorToken]),2)})</Typography>
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <Typography className={classes.myDetailsText} align={'left'}>
                                                                            <Trans i18nKey="myBoostEarnings"/>
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <Typography className={classes.myDetailsValue} align={'right'}>{formatDecimals(item.boosted)} {item.boostToken} (${formatDecimals(item.boosted.multipliedBy(prices.prices[item.boostToken]), 2)})</Typography>
                                                                    </Grid>
                                                                    <Grid item xs={12} >
                                                                        <Button style={{marginTop: '4px'}} onClick={() => handleWithdrawBonus(item)} className={item.earned.lte(0) ? classes.disabledActionBtn : classes.enabledActionBtn} variant={'contained'} disabled={item.earned.lte(0)}>
                                                                            Withdraw Bonus {item.sponsorToken} { item.boostToken ? 'and ' + item.boostToken : ('')}
                                                                        </Button>
                                                                        <Steps item={item} steps={steps} handleClose={handleClose} />
                                                                    </Grid>


                                                                </Grid>
                                                            </AnimateHeight>
                                                        </Grid>
                                                        
                                                    </React.Fragment>
                                                    }

                                                    <Grid item xs={12}>
                                                        <Divider className={classes.divider}/>
                                                    </Grid>
                                                    <Grid item xs={9} align={"left"} style={{height: '20px'}}>
                                                        <Typography className={classes.dividerText} style={{marginBottom: 0}} onClick={() => {setPrizeSplitOpen(!prizeSplitOpen)}}>{t('prizeWinners')} </Typography>
                                                    </Grid>
                                                    <Grid item xs={3} align={"right"} style={{height: '20px'}}>
                                                        <Link onClick={() => {setPrizeSplitOpen(!prizeSplitOpen)}} className={classes.expandToggle} style={{marginBottom: '0'}}>{prizeSplitOpen ? (<ExpandLess />) : (<ExpandMore />)}</Link>
                                                    </Grid>
                                                    <Grid item xs={12} style={{padding: 0}}>
                                                        <AnimateHeight duration={ 500 } height={ prizeSplitOpen ? 'auto' : 0 }>
                                                            <Grid container>
                                                                <Grid item xs={6} align={"left"}>
                                                                    <Typography className={classes.potsItemText} style={{marginBottom: 0}}>
                                                                        <Trans i18nKey="winners"/>
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={6} align={"right"}>
                                                                    <Typography className={classes.potsPrizeWinnersTransaction}>
                                                                        <Link href={`https://bscscan.com/tx/${item.winnersTransaction}`}>
                                                                            <Trans i18nKey="winningTransactions"/>
                                                                        </Link>
                                                                    </Typography>
                                                                </Grid>

                                                            </Grid>
                                                        </AnimateHeight>
                                                    </Grid>
                                                </React.Fragment>

                                            }

                                        </Grid>
                                    </Box>
                                ))
                            )}
                        </Grid>
                </Container>
        </React.Fragment>
    );
};

export default Dashboard;
