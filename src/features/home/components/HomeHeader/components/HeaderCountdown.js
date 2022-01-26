import React, { useState, useEffect } from 'react';
import { Translate } from '../../../../../components/Translate';
import { Logo } from '../../../../../components/Pot/Pot';
import { PrimaryButton } from '../../../../../components/Buttons/PrimaryButton';
import { makeStyles } from '@material-ui/core';
import { formatTimeLeft } from '../../../../../helpers/format';
import styles from '../styles';

const useStyles = makeStyles(styles);

const HeaderCountdown = ({ pot }) => {
  const classes = useStyles();
  const potData = pot[1];

  //Set time for countdown calculation
  const [time, setTime] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setTime(Date.now()), 1000);
    return () => clearInterval(id);
  }, [setTime]);

  //Calculate time untill draw
  const expiresAt = potData.expiresAt * 1000;
  const timeLeft = Math.max(0, expiresAt - time);
  const timeToDraw = formatTimeLeft(
    timeLeft,
    {
      resolution: 'seconds',
      dropZero: false,
    },
    true
  );

  return (
    <div className={classes.nextDrawCard}>
      {/* Top of card */}
      <div className={classes.nextDrawInner}>
        {/* Prize + Countdown */}
        <div>
          <div className={classes.nextDrawPrizeText}>
            {/* TODO: Add multiple token support and support for pots with both token and NFT prizes */}
            {!potData.nftPrizeOnly && !potData.nfts ? (
              //Token Only Prize
              <Translate
                i18nKey="header.winPrizeInToken"
                values={{ prize: potData.totalPrizeUSD, token: potData.token }}
              />
            ) : potData.nftPrizeOnly ? (
              //NFT Only Prize
              <Translate i18nKey="header.winNFT" values={{ nft: potData.nfts[0].name }} />
            ) : null}
          </div>
          <div className={classes.nextDrawTimeContainer}>
            <div>
              <div className={classes.nextDrawTimeValue}>
                {timeToDraw[1] === 'NaN' ? '00' : timeToDraw[1]}
              </div>
              <div className={classes.nextDrawTimeLabel}>
                <Translate i18nKey="header.hours" />
              </div>
            </div>
            <div className={classes.nextDrawTimeSeparator}>:</div>
            <div>
              <div className={classes.nextDrawTimeValue}>
                {timeToDraw[2] === 'NaN' ? '00' : timeToDraw[2]}
              </div>
              <div className={classes.nextDrawTimeLabel}>
                <Translate i18nKey="header.mins" />
              </div>
            </div>
            <div className={classes.nextDrawTimeSeparator}>:</div>
            <div>
              <div className={classes.nextDrawTimeValue}>
                {timeToDraw[3] === 'NaN' ? '00' : timeToDraw[3]}
              </div>
              <div className={classes.nextDrawTimeLabel}>
                <Translate i18nKey="header.secs" />
              </div>
            </div>
          </div>
        </div>
        {/* Pot Logo */}
        <div className={classes.nextDrawLogoContainer}>
          <Logo icon={potData.icon || potData.id} sponsorToken={potData.sponsorToken} />
        </div>
      </div>
      <PrimaryButton to={`/pot/` + potData.id} variant={'purpleHeader'} fullWidth={true}>
        <Translate i18nKey={'pot.playWith'} values={{ token: potData.token }} />
      </PrimaryButton>
    </div>
  );
};

export default HeaderCountdown;
