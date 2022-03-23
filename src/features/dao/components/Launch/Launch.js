import { useSelector } from 'react-redux';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { whitelistSafepal } from '../../../../config/dao/whitelist/safepal';
import { whitelistFirstPot } from '../../../../config/dao/whitelist/firstpot';
import { whitelistBifiMaxi } from '../../../../config/dao/whitelist/bifimaxi';
import { whitelistCommunity } from '../../../../config/dao/whitelist/community';
import { whitelistSecondPot } from '../../../../config/dao/whitelist/secondpot';
import { makeStyles, Typography } from '@material-ui/core';
import styles from './styles';
import { CancelOutlined, CheckCircleOutline, OpenInNew } from '@material-ui/icons';
import clsx from 'clsx';
import ZiggyRocket104 from '../../../../images/ziggy/rocket_104w.png';
import ZiggyRocket208 from '../../../../images/ziggy/rocket_208w.png';
import Countdown from '../../../../components/Countdown';
import { PrimaryButton } from '../../../../components/Buttons/PrimaryButton';
import { selectWalletAddress } from '../../../wallet/selectors';

const useStyles = makeStyles(styles);

const URL_TAKE_PART_BUSD =
  'https://app.dodoex.io/cp/join/0x6f14608d7d50f697181072a1a2481e0499ac9997?network=bsc';
const URL_TAKE_PART_BNB =
  'https://app.dodoex.io/cp/join/0x2648d14f5d9524e34d68168e2feaf8bde8773af7?network=bsc';
const URL_LEARN_MORE_MOONPOT = 'https://moonpot.com/alpha/launch/the-moonpot-mission/';
const URL_LEARN_MORE_POTS = 'https://moonpot.com/alpha/launch/the-stars-look-brighter-with-pots/';
const URL_LEARN_MORE_IDO = 'https://moonpot.com/alpha/launch/how-to-enter-the-moonpot-dodo-ido/';
const TIMESTAMP_OPEN = 1627898400 * 1000; // Unix timestamp in milliseconds
const TIMESTAMP_CLOSE = TIMESTAMP_OPEN + 24 * 60 * 60 * 1000;

function Card({ children, className, ...rest }) {
  const classes = useStyles();
  return (
    <div className={`${classes.card} ${className || ''}`} {...rest}>
      {children}
    </div>
  );
}

function Intro() {
  const classes = useStyles();

  return (
    <Card>
      <img
        className={classes.rocket}
        src={ZiggyRocket104}
        srcSet={`${ZiggyRocket104} 104w, ${ZiggyRocket208} 208w`}
        width="104"
        height="104"
        alt=""
        aria-hidden={true}
      />
      <Typography variant="h2" className={classes.cardTitle}>
        POTS Launch August 2nd, 2021
      </Typography>
      <Typography>
        Moonpot is the win-win savings game where you earn interest, win big crypto prizes - and
        always keep your deposit
      </Typography>
      <Typography>
        Next week we will launch our POTS token that will let you vote in governance, earn interest
        via staking and have the chance to be in for a special monthly prize draw from Ziggys Pot,
        that will include a share of all the assets given away that month.
      </Typography>
      <Typography>
        <a href={URL_LEARN_MORE_MOONPOT} target="_blank" rel="noreferrer">
          Learn more about Moonpot <OpenInNew fontSize="inherit" />
        </a>
      </Typography>
    </Card>
  );
}

function AirdropSafepal({ amount }) {
  const classes = useStyles();

  return (
    <Card>
      <Typography variant="h2" className={classes.cardTitle}>
        My SafePal WHO Airdrop
      </Typography>
      <div className={classes.airdropBox}>
        <div className={classes.airdropAllocation}>Airdrop Allocation</div>
        <div className={classes.airdropAmount}>{amount} POTS</div>
      </div>
      <Typography>
        <strong>Hooray!</strong>
        <br />
        You were successful in the SafePal WHO and will receive POTS after the IDO ends on August
        3rd.
      </Typography>
      <Typography>
        <a href={URL_LEARN_MORE_POTS} target="_blank" rel="noreferrer">
          Learn more about POTS <OpenInNew fontSize="inherit" />
        </a>
      </Typography>
    </Card>
  );
}

function Eligibility({ children }) {
  const classes = useStyles();

  return <div className={classes.eligibility}>{children}</div>;
}

function Requirement({ fulfilled = false, children }) {
  const classes = useStyles();
  const variantClass = 'requirement' + (fulfilled ? 'Fulfilled' : 'Unfulfilled');
  const Icon = fulfilled ? CheckCircleOutline : CancelOutlined;

  return (
    <div className={clsx(classes.requirement, classes[variantClass])}>
      <div className={classes.requirementIcon}>
        <Icon fontSize="inherit" />
      </div>
      <div className={classes.requirementContent}>{children}</div>
    </div>
  );
}

function WhitelistFirstPot() {
  return (
    <>
      <Requirement fulfilled={true}>
        <p>Participated in first CAKE Moonpot draw</p>
      </Requirement>
      <Typography>
        <strong>Hooray!</strong>
        <br />
        You have been automatically whitelisted for the IDO on August 2nd because you were in the
        first CAKE Moonpot draw.
      </Typography>
      <WhitelistTakePart />
      <Eligibility>
        <Typography>
          As you were in the first CAKE Moonpot draw you have been automatically whitelisted for the
          POTS IDO on August 2nd, 2021.
        </Typography>
      </Eligibility>
    </>
  );
}

function WhitelistMaxi({ cake, maxi }) {
  return (
    <>
      <Requirement fulfilled={maxi}>
        <p>Staked in BIFI Maxi at Maxi snapshot</p>
      </Requirement>
      <Requirement fulfilled={cake}>
        <p>Deposited at least 10 CAKE in the new CAKE Moonpot</p>
      </Requirement>
      <WhitelistTakePart />
      <Eligibility>
        {cake && maxi ? (
          <>
            <Typography>You met all the criteria for the POTS IDO on August 2nd.</Typography>
            <Typography>You have been whitelisted for the IDO.</Typography>
          </>
        ) : (
          <>
            <Typography>
              You did not meet all the criteria for the POTS IDO on August 2nd. You will be able to
              buy POTS on August 3rd.
            </Typography>
            <Typography>
              You did not deposit 10 CAKE in the CAKE Moonpot on time, so you are not whitelisted
              for the IDO.
            </Typography>
          </>
        )}
      </Eligibility>
    </>
  );
}

function WhitelistContest({ cake, contest }) {
  return (
    <>
      <Requirement fulfilled={contest}>
        <p>Selected from a Community Whitelisting Mission</p>
      </Requirement>
      <Requirement fulfilled={cake}>
        <p>Deposited at least 10 CAKE in the new CAKE Moonpot</p>
      </Requirement>
      <WhitelistTakePart />
      <Eligibility>
        {cake && contest ? (
          <>
            <Typography>You met all the criteria for the POTS IDO on August 2nd.</Typography>
            <Typography>You have been whitelisted for the IDO.</Typography>
          </>
        ) : null}
        {!cake || !contest ? (
          <Typography>
            You did not meet all the criteria for the POTS IDO on August 2nd. You will be able to
            buy POTS on August 3rd.
          </Typography>
        ) : null}
        {cake ? null : (
          <Typography>You did not deposit 10 CAKE in the CAKE Moonpot on time.</Typography>
        )}
        {contest ? null : (
          <Typography>You were not selected from a Community Whitelisting Mission.</Typography>
        )}
      </Eligibility>
    </>
  );
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
    return (
      <>
        <Typography>The IDO will begin on August 2nd, 2021 at 10:00 AM UTC.</Typography>
        <Typography className={classes.countdown}>
          <Countdown until={TIMESTAMP_OPEN} resolution="seconds" dropZero={true} />
        </Typography>
      </>
    );
  } else if (isOpen) {
    return (
      <>
        <Typography>The IDO will end on August 3rd, 2021 at 10:00 AM UTC.</Typography>
        <Typography className={classes.countdown}>
          <Countdown until={TIMESTAMP_CLOSE} resolution="seconds" dropZero={true} />
        </Typography>
      </>
    );
  }

  return (
    <>
      <Typography>The IDO is now closed.</Typography>
    </>
  );
}

function WhitelistTakePart() {
  const classes = useStyles();

  return (
    <>
      <InitialOfferingCountdown />
      <Typography>
        <a href={URL_LEARN_MORE_IDO} target="_blank" rel="noreferrer">
          Learn more about the IDO <OpenInNew fontSize="inherit" />
        </a>
      </Typography>
      <PrimaryButton
        variant="purple"
        className={classes.button}
        fullWidth={true}
        component="a"
        href={URL_TAKE_PART_BUSD ? URL_TAKE_PART_BUSD : '#'}
        target="_blank"
        rel="noopener"
        disabled={!URL_TAKE_PART_BUSD}
      >
        Stake Your BUSD to get POTS
      </PrimaryButton>
      <PrimaryButton
        variant="purple"
        className={classes.button}
        fullWidth={true}
        component="a"
        href={URL_TAKE_PART_BNB ? URL_TAKE_PART_BNB : '#'}
        target="_blank"
        rel="noopener"
        disabled={!URL_TAKE_PART_BNB}
      >
        Stake Your BNB to get POTS
      </PrimaryButton>
    </>
  );
}

function Whitelist({ currentAddress }) {
  const classes = useStyles();

  const inWhitelistFirstPot = useMemo(() => {
    return currentAddress && whitelistFirstPot.includes(currentAddress);
  }, [currentAddress]);

  const inWhitelistBifiMaxi = useMemo(() => {
    return currentAddress && whitelistBifiMaxi.includes(currentAddress);
  }, [currentAddress]);

  const inWhitelistCommunity = useMemo(() => {
    return currentAddress && whitelistCommunity.includes(currentAddress);
  }, [currentAddress]);

  const inWhitelistSecondPot = useMemo(() => {
    if (currentAddress && currentAddress in whitelistSecondPot) {
      return (whitelistSecondPot[currentAddress] || 0) >= 10;
    }

    return false;
  }, [currentAddress]);

  const showWhitelistFirstPot = inWhitelistFirstPot;
  const showWhitelistMaxi = !showWhitelistFirstPot && inWhitelistBifiMaxi;
  const showWhitelistContest = !showWhitelistFirstPot && !showWhitelistMaxi;

  return (
    <Card>
      <Typography variant="h2" className={classes.cardTitle}>
        My IDO Whitelisting
      </Typography>
      {showWhitelistFirstPot ? <WhitelistFirstPot /> : null}
      {showWhitelistMaxi ? (
        <WhitelistMaxi cake={inWhitelistSecondPot} maxi={inWhitelistBifiMaxi} />
      ) : null}
      {showWhitelistContest ? (
        <WhitelistContest cake={inWhitelistSecondPot} contest={inWhitelistCommunity} />
      ) : null}
    </Card>
  );
}

function NotConnected() {
  const classes = useStyles();

  return (
    <Card>
      <Typography variant="h2" className={classes.cardTitle}>
        Not Connected
      </Typography>
      <Typography>Connect your wallet to check on your IDO whitelist status.</Typography>
      <Typography>
        <a href={URL_LEARN_MORE_IDO} target="_blank" rel="noreferrer">
          Learn more about the IDO <OpenInNew fontSize="inherit" />
        </a>
      </Typography>
    </Card>
  );
}

export function Launch() {
  const currentAddress = useSelector(selectWalletAddress);

  const airdropSafepalAmount = useMemo(() => {
    if (currentAddress) {
      const lowerAddress = currentAddress.toLowerCase();
      if (lowerAddress in whitelistSafepal) {
        return whitelistSafepal[lowerAddress] || 0;
      }
    }

    return 0;
  }, [currentAddress]);

  const showNotConnected = !currentAddress;
  const showAirdropSafepal = !showNotConnected && airdropSafepalAmount > 0;
  const showWhitelist = !showNotConnected;

  return (
    <>
      <Intro />
      {showNotConnected ? <NotConnected /> : null}
      {showAirdropSafepal ? <AirdropSafepal amount={airdropSafepalAmount} /> : null}
      {showWhitelist ? <Whitelist currentAddress={currentAddress} /> : null}
    </>
  );
}
