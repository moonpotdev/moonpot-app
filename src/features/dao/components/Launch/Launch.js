import {useDispatch, useSelector} from 'react-redux';
import * as React from 'react';
import {useEffect, useMemo, useState} from 'react';
import reduxActions from '../../../redux/actions';
import {whitelistSafepal} from '../../../../config/dao/whitelist/safepal';
import {whitelistFirstPot} from '../../../../config/dao/whitelist/firstpot';
import {whitelistBifiMaxi} from '../../../../config/dao/whitelist/bifimaxi';
import {whitelistCommunity} from '../../../../config/dao/whitelist/community';
import {whitelistSecondPot} from '../../../../config/dao/whitelist/secondpot';
import {byDecimals} from '../../../../helpers/format';
import BigNumber from 'bignumber.js';
import {makeStyles, Typography} from '@material-ui/core';
import styles from './styles';
import {ArrowRightAlt, CancelOutlined, CheckCircleOutline, OpenInNew} from '@material-ui/icons';
import classNames from 'classnames';
import {Link} from 'react-router-dom';
import {ButtonWhite} from '../../../../components/Buttons/ButtonWhite';
import ZiggyRocket104 from '../../../../images/ziggy/rocket_104w.png';
import ZiggyRocket208 from '../../../../images/ziggy/rocket_208w.png';
import Countdown from '../../../../components/Countdown';

const useStyles = makeStyles(styles);

const URL_TAKE_PART = null; // 'https://app.dodoex.io/cp/join?network=bsc-mainnet'; // TODO set to correct URL
const URL_LEARN_MORE_MOONPOT = 'https://moonpot.com/alpha/launch/the-moonpot-mission/';
const URL_LEARN_MORE_POTS = 'https://moonpot.com/alpha/launch/the-stars-look-brighter-with-pots/';
const URL_LEARN_MORE_COMMUNITY_WHITELIST = 'https://moonpot.com/alpha/launch/t-5-bsc-news-community-whitelist/';
const URL_LEARN_MORE_IDO = 'https://moonpot.com/alpha/launch/how-to-enter-the-moonpot-dodo-ido/';
const USE_POT_SNAPSHOT = false; // false = live balance, true = balance of whitelist/secondpot // TODO change to true once snapshot taken
const TIMESTAMP_OPEN = 1627898400 * 1000; // Unix timestamp in milliseconds
const TIMESTAMP_CLOSE = TIMESTAMP_OPEN + (24 * 60 * 60 * 1000);

const useStakedCake = USE_POT_SNAPSHOT ? useSnapshotStakedCake : useLiveStakedCake;

function Card({children, className, ...rest}) {
	const classes = useStyles();
	return <div className={`${classes.card} ${className || ''}`} {...rest}>{children}</div>;
}

function Intro() {
	const classes = useStyles();

	return <Card>
		<img className={classes.rocket} src={ZiggyRocket104} srcSet={`${ZiggyRocket104} 104w, ${ZiggyRocket208} 208w`}
			 width="104" height="104" alt="" aria-hidden={true}/>
		<Typography variant="h2" className={classes.cardTitle}>POTS Launch August 2nd, 2021</Typography>
		<Typography>Moonpot is the win-win savings game where you earn interest, win big crypto prizes - and always keep
			your deposit</Typography>
		<Typography>Next week we will launch our POTS token that will let you vote in governance, earn interest via
			staking and have the chance to be in for a special monthly prize draw from Ziggys Pot, that will include a
			share of all the assets given away that month.</Typography>
		<Typography><a href={URL_LEARN_MORE_MOONPOT} target="_blank" rel="noreferrer">Learn more about
			Moonpot <OpenInNew
				fontSize="inherit"/></a></Typography>
	</Card>;
}

function AirdropSafepal({amount}) {
	const classes = useStyles();

	return <Card>
		<Typography variant="h2" className={classes.cardTitle}>My SafePal WHO Airdrop</Typography>
		<div className={classes.airdropBox}>
			<div className={classes.airdropAllocation}>Airdrop Allocation</div>
			<div className={classes.airdropAmount}>{amount} POTS</div>
		</div>
		<Typography><strong>Hooray!</strong><br/>You were successful in the SafePal WHO and will receive POTS after
			the IDO ends on August 3.</Typography>
		<Typography><a href={URL_LEARN_MORE_POTS} target="_blank" rel="noreferrer">Learn more about POTS <OpenInNew
			fontSize="inherit"/></a></Typography>
	</Card>;
}

function Requirement({fulfilled = false, children}) {
	const classes = useStyles();
	const variantClass = 'requirement' + (fulfilled ? 'Fulfilled' : 'Unfulfilled');
	const Icon = fulfilled ? CheckCircleOutline : CancelOutlined;

	return <div className={classNames(classes.requirement, classes[variantClass])}>
		<div className={classes.requirementIcon}><Icon fontSize="inherit"/></div>
		<div className={classes.requirementContent}>{children}</div>
	</div>;
}

function WhitelistFirstPot() {
	return <>
		<Requirement fulfilled={true}>
			<p>Participated in first CAKE Moonpot draw</p>
		</Requirement>
		<WhitelistTakePart/>
		<Typography>As you were in the first CAKE Moonpot draw you have been automatically whitelisted for the POTS IDO
			on August 2nd, 2021.</Typography>
	</>;
}

function WhitelistMaxi({balance}) {
	const balanceFulfilled = balance.gte(10);

	return <>
		<Requirement fulfilled={true}>
			<p>Staked in BIFI Maxi at Maxi snapshot</p>
		</Requirement>
		<Requirement fulfilled={balanceFulfilled}>
			<p>Deposited at least 10 CAKE in the new CAKE Moonpot</p>
			{balanceFulfilled || USE_POT_SNAPSHOT ? null :
				<p><Link to="/pot/cake-dodo">Deposit now <ArrowRightAlt fontSize="inherit"/></Link></p>}
		</Requirement>
		<WhitelistTakePart/>
		<WhiteListEligbilityText fulfilled={balanceFulfilled}/>
	</>;
}

function WhitelistContest({balance, whitelisted}) {
	const balanceFulfilled = balance.gte(10);

	return <>
		<Requirement fulfilled={whitelisted}>
			<p>Won a Community Whitelisting Mission</p>
			{whitelisted ? null :
				<p><a href={URL_LEARN_MORE_COMMUNITY_WHITELIST} target="_blank" rel="noreferrer">Learn more <OpenInNew
					fontSize="inherit"/></a></p>}
		</Requirement>
		<Requirement fulfilled={balanceFulfilled}>
			<p>Deposited at least 10 CAKE in the new CAKE Moonpot</p>
			{balanceFulfilled || USE_POT_SNAPSHOT ? null :
				<p><Link to="/pot/cake-dodo">Deposit now <ArrowRightAlt fontSize="inherit"/></Link></p>}
		</Requirement>
		<WhitelistTakePart/>
		<WhiteListEligbilityText fulfilled={whitelisted && balanceFulfilled}/>
	</>;
}

function InitialOfferingCountdown() {
	const classes = useStyles();
	const [time, setTime] = useState(Date.now());

	useEffect(() => {
		const id = setInterval(() => setTime(Date.now()), 1000);
		return () => clearInterval(id);
	}, [setTime]);

	const isClosed = time >= TIMESTAMP_CLOSE;
	const isOpen = !isClosed && time >= TIMESTAMP_OPEN;
	const isWaiting = !isClosed && !isOpen;

	if (isWaiting) {
		return <>
			<Typography>The IDO will begin on August 2nd, 2021 at 10:00 AM UTC.</Typography>
			<Typography className={classes.countdown}><Countdown until={TIMESTAMP_OPEN} resolution="seconds" /></Typography>
		</>
	}
	else if (isOpen) {
		return <>
			<Typography>The IDO will close on August 3rd, 2021 at 10:00 AM UTC.</Typography>
			<Typography className={classes.countdown}><Countdown until={TIMESTAMP_CLOSE} resolution="seconds" dropZero={true} /></Typography>
		</>
	}

	return <>
		<Typography>The IDO is now closed.</Typography>
	</>
}

function WhitelistTakePart() {
	const classes = useStyles();

	return <>
		<InitialOfferingCountdown/>
		<Typography>
			<a href={URL_LEARN_MORE_IDO} target="_blank" rel="noreferrer">Learn more about the IDO <OpenInNew
				fontSize="inherit"/></a>
		</Typography>
		<ButtonWhite className={classes.button} fullWidth={true} component="a"
					 href={URL_TAKE_PART ? URL_TAKE_PART : '#'} target="_blank" rel="noopener"
					 disabled={!URL_TAKE_PART}>Take Part in IDO</ButtonWhite>
	</>;
}

function WhiteListEligbilityText({fulfilled}) {
	if (USE_POT_SNAPSHOT) {
		if (fulfilled) {
			return <Typography>You met the criteria for POTS IDO on August 2nd, 2021.</Typography>;
		}
		else {
			return <Typography>You did not meet the criteria for POTS IDO on August 2nd, 2021.</Typography>;
		}
	}
	else {
		if (fulfilled) {
			return <>
				<Typography>You currently meet the criteria for POTS IDO on August 2nd, 2021.</Typography>
				<Typography>If you keep at least 10 CAKE in the CAKE Moonpot you will be able to participate in the
					IDO.</Typography>
			</>;
		}
		else {
			return <Typography>You do not meet the criteria for POTS IDO on August 2nd, 2021.</Typography>;
		}
	}
}

function useLiveStakedCake(currentAddress) {
	const dispatch = useDispatch();

	useEffect(() => {
		if (currentAddress) {
			dispatch(reduxActions.balance.fetchBalances());
		}
	}, [dispatch, currentAddress]);

	return useSelector(state => byDecimals(new BigNumber(state.balanceReducer.tokens['potCAKEv2']?.balance || '0'), 18));
}

function useSnapshotStakedCake(currentAddress) {
	if (currentAddress && currentAddress in whitelistSecondPot) {
		return new BigNumber(whitelistSecondPot[currentAddress] || 0);
	}

	return new BigNumber(0);
}

function Whitelist({currentAddress}) {
	const classes = useStyles();
	const balance = useStakedCake(currentAddress);

	const inWhitelistFirstPot = useMemo(() => {
		return currentAddress && whitelistFirstPot.includes(currentAddress);
	}, [currentAddress]);

	const inWhitelistBifiMaxi = useMemo(() => {
		return currentAddress && whitelistBifiMaxi.includes(currentAddress);
	}, [currentAddress]);

	const inWhitelistCommunity = useMemo(() => {
		return currentAddress && whitelistCommunity.includes(currentAddress);
	}, [currentAddress]);

	const showWhitelistFirstPot = inWhitelistFirstPot;
	const showWhitelistMaxi = !showWhitelistFirstPot && inWhitelistBifiMaxi;
	const showWhitelistContest = !showWhitelistFirstPot && !showWhitelistMaxi;

	return <Card>
		<Typography variant="h2" className={classes.cardTitle}>My IDO Whitelisting</Typography>
		{showWhitelistFirstPot ? <WhitelistFirstPot/> : null}
		{showWhitelistMaxi ? <WhitelistMaxi balance={balance}/> : null}
		{showWhitelistContest ? <WhitelistContest balance={balance} whitelisted={inWhitelistCommunity}/> : null}
	</Card>;
}

function NotConnected() {
	const classes = useStyles();

	return <Card>
		<Typography variant="h2" className={classes.cardTitle}>Not Connected</Typography>
		<Typography>Connect your wallet to check on your IDO whitelist status.</Typography>
		<Typography><a href={URL_LEARN_MORE_IDO} target="_blank" rel="noreferrer">Learn
			more about the IDO <OpenInNew fontSize="inherit"/></a></Typography>
	</Card>;
}

export function Launch() {
	const currentAddress = useSelector(state => state.walletReducer.address?.toLowerCase());

	const airdropSafepalAmount = useMemo(() => {
		if (currentAddress && currentAddress in whitelistSafepal) {
			return whitelistSafepal[currentAddress] || 0;
		}

		return 0;
	}, [currentAddress]);

	const showNotConnected = !currentAddress;
	const showAirdropSafepal = !showNotConnected && airdropSafepalAmount > 0;
	const showWhitelist = !showNotConnected;

	return (
		<>
			<Intro/>
			{showNotConnected ? <NotConnected/> : null}
			{showAirdropSafepal ? <AirdropSafepal amount={airdropSafepalAmount}/> : null}
			{showWhitelist ? <Whitelist currentAddress={currentAddress}/> : null}
		</>
	);
}

