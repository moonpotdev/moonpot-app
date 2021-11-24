import React, { memo } from 'react';
import { usePot } from '../../../../helpers/hooks';
import { Box, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Translate } from '../../../../components/Translate/Translate';
import { OpenInNew } from '@material-ui/icons';
import { Card, Cards, CardTitle } from '../../../../components/Cards';
import styles from './styles';
import clsx from 'clsx';
import ziggyPlay1x from '../../../../images/ziggy/play@1x.png';
import ziggyPlay2x from '../../../../images/ziggy/play@2x.png';
import ziggyPlay3x from '../../../../images/ziggy/play@3x.png';
import ziggyPlay4x from '../../../../images/ziggy/play@4x.png';
import ziggyTimelock1x from '../../../../images/ziggy/timelock@1x.png';
import ziggyTimelock2x from '../../../../images/ziggy/timelock@2x.png';
import ziggyTimelock3x from '../../../../images/ziggy/timelock@3x.png';
import ziggyTimelock4x from '../../../../images/ziggy/timelock@4x.png';

const useStyles = makeStyles(styles);

const StrategyInfoCard = memo(function ({ pot, classes, t }) {
  if (!pot.infoCardStrategy && !pot.nftInfoCardStrategy) {
    return null;
  }

  return (
    <>
      {pot.infoCardStrategy && (
        <Card variant="purpleInfo" className={classes.strategy}>
          <CardTitle>{t('pot.infocards.strategy.title', { name: pot.name })}</CardTitle>
          {t('pot.infocards.strategy.body.' + pot.infoCardStrategy, {
            returnObjects: true,
            token: pot.token,
            name: pot.name,
            breakdownInterest: pot.interestBreakdown?.interest || 0,
            breakdownPrize: pot.interestBreakdown?.prize || 0,
            breakdownBuyback: pot.interestBreakdown?.buyback || 0,
            breakdownZiggyInterest: pot.interestBreakdown?.ziggyInterest || 0,
            breakdownZiggyPrize: pot.interestBreakdown?.ziggyPrize || 0,
            breakdownZiggyTotal:
              (pot.interestBreakdown?.ziggyPrize || 0) + (pot.interestBreakdown?.ziggyPrize || 0),
          }).map((text, i) => (
            <p key={i}>{text}</p>
          ))}
          {pot.infoCardStrategy === 'beefy' && pot.infoCardBeefyVaultAddress ? (
            <p>
              <a
                href={`https://bscscan.com/address/${pot.infoCardBeefyVaultAddress}`}
                rel="noreferrer"
                target="_blank"
                className={classes.link}
              >
                {t('pot.infocards.strategy.beefyVaultAddress')} <OpenInNew fontSize="inherit" />
              </a>
            </p>
          ) : null}
          <p>
            <a
              href={`https://bscscan.com/address/${pot.prizeStrategyAddress}`}
              rel="noreferrer"
              target="_blank"
              className={classes.link}
            >
              {t('pot.infocards.strategy.moonpotStrategyAddress', { name: pot.name })}{' '}
              <OpenInNew fontSize="inherit" />
            </a>
          </p>
        </Card>
      )}
      {pot.nftInfoCardStrategy ? (
        <Card variant="purpleInfo" className={classes.strategy}>
          <img
            alt=""
            width="80"
            height="80"
            sizes="80px"
            style={{ marginBottom: '22px' }}
            src={require('../../../../images/info/' + pot.id.toLowerCase() + '.svg').default}
          />
          <CardTitle>{t('pot.infocards.strategy.titleNFT', { name: pot.name })}</CardTitle>
          <div className={classes.nftStrategyContainer}>
            <Translate i18nKey={'pot.infocards.strategy.body.' + pot.nftInfoCardStrategy} />
          </div>
          {pot.nftInfoCardProjectLink ? (
            <p>
              <a
                href={pot.nftInfoCardProjectLink}
                rel="noreferrer"
                target="_blank"
                className={classes.link}
              >
                {pot.sponsorProjectName} <OpenInNew fontSize="inherit" />
              </a>
            </p>
          ) : null}
          <p>
            <a
              href={`https://bscscan.com/address/${pot.prizeStrategyAddress}`}
              rel="noreferrer"
              target="_blank"
              className={classes.link}
            >
              {t('pot.infocards.strategy.moonpotStrategyAddress', { name: pot.name })}{' '}
              <OpenInNew fontSize="inherit" />
            </a>
          </p>
        </Card>
      ) : null}
    </>
  );
});

const InterestBreakdownInfoCard = memo(function ({ pot, classes, t }) {
  if (!pot.interestBreakdown) {
    return null;
  }

  return (
    <Card variant="purpleInfo">
      <CardTitle>{t('pot.infocards.earnings.title')}</CardTitle>
      {pot.interestBreakdown.interest ? (
        <div className={classes.earningItem}>
          <div className={classes.earningLabel}>
            {t('pot.infocards.earnings.tokenInterest', { token: pot.token })}
          </div>
          <div className={classes.earningValue}>{pot.interestBreakdown.interest}%</div>
        </div>
      ) : null}
      {pot.interestBreakdown.prize ? (
        <div className={classes.earningItem}>
          <div className={classes.earningLabel}>
            {t('pot.infocards.earnings.nameMoonpotPrizeDraw', { name: pot.name })}
          </div>
          <div className={classes.earningValue}>{pot.interestBreakdown.prize}%</div>
        </div>
      ) : null}
      {pot.interestBreakdown.buyback ? (
        <div className={classes.earningItem}>
          <div className={classes.earningLabel}>
            {t('pot.infocards.earnings.buyback', { token: pot.token })}
          </div>
          <div className={classes.earningValue}>{pot.interestBreakdown.buyback}%</div>
        </div>
      ) : null}
      {pot.interestBreakdown.ziggyInterest ? (
        <div className={classes.earningItem}>
          <div className={classes.earningLabel}>
            {t('pot.infocards.earnings.ziggysPotInterest')}
          </div>
          <div className={classes.earningValue}>{pot.interestBreakdown.ziggyInterest}%</div>
        </div>
      ) : null}
      {pot.interestBreakdown.ziggyPrize ? (
        <div className={classes.earningItem}>
          <div className={classes.earningLabel}>{t('pot.infocards.earnings.ziggysPrizeDraw')}</div>
          <div className={classes.earningValue}>{pot.interestBreakdown.ziggyPrize}%</div>
        </div>
      ) : null}
      {pot.interestBreakdown.treasury ? (
        <div className={classes.earningItem}>
          <div className={classes.earningLabel}>{t('pot.infocards.earnings.treasury')}</div>
          <div className={classes.earningValue}>{pot.interestBreakdown.treasury}%</div>
        </div>
      ) : null}
    </Card>
  );
});

const FairplayInfoCard = memo(function ({ pot, classes, t, fairplayRef }) {
  return (
    <Card variant="purpleInfo" ref={fairplayRef} className={classes.fairplayRules}>
      <div className={classes.ziggyTimelock}>
        <img
          alt=""
          width="80"
          height="80"
          sizes="80px"
          src={ziggyTimelock1x}
          srcSet={`${ziggyTimelock1x} 80w, ${ziggyTimelock2x} 160w, ${ziggyTimelock3x} 240w, ${ziggyTimelock4x} 320w`}
        />
      </div>
      <CardTitle>{t('pot.infocards.fairplay.title', { name: pot.name })}</CardTitle>
      {pot.vaultType === 'nft' ? (
        <>
          {t('pot.infocards.fairplay.bodyNFT', {
            returnObjects: true,
            token: pot.token,
            duration: pot.fairplayDuration,
            ticketFee: pot.fairplayTicketFee * 100,
          }).map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </>
      ) : (
        <>
          {t('pot.infocards.fairplay.body', {
            returnObjects: true,
            token: pot.token,
            duration: pot.fairplayDuration,
            ticketFee: pot.fairplayTicketFee * 100,
          }).map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </>
      )}
    </Card>
  );
});

const defaultInfoCards = ['strategy', 'breakdown', 'fairplay'];
const cardComponentMap = {
  strategy: StrategyInfoCard,
  breakdown: InterestBreakdownInfoCard,
  fairplay: FairplayInfoCard,
};

export const InfoCards = memo(function ({ id, className, fairplayRef }) {
  const pot = usePot(id);
  const classes = useStyles();
  const { t } = useTranslation();
  const infoCards = pot.infoCards || defaultInfoCards;

  if (infoCards.length) {
    return (
      <Cards className={clsx(className)} oneUp={true}>
        {infoCards.map(key => {
          const InfoCard = cardComponentMap[key];
          return InfoCard ? (
            <InfoCard key={key} pot={pot} t={t} classes={classes} fairplayRef={fairplayRef} />
          ) : null;
        })}
        <Box className={classes.ziggyPlay}>
          <img
            alt=""
            width="240"
            height="240"
            sizes="240px"
            src={ziggyPlay1x}
            srcSet={`${ziggyPlay1x} 240w, ${ziggyPlay2x} 480w, ${ziggyPlay3x} 720w, ${ziggyPlay4x} 960w`}
          />
        </Box>
      </Cards>
    );
  }

  return null;
});
