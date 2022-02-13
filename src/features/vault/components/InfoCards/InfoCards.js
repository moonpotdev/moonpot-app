import React, { memo } from 'react';
import { usePot } from '../../../../helpers/hooks';
import { Box, Grid, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { OpenInNew } from '@material-ui/icons';
import { Card, CardTitle } from '../../../../components/Cards';
import styles from './styles';
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
  if (!pot.infoCardStrategy) {
    return null;
  }

  return (
    <Card variant="purpleInfo" className={classes.strategy} oneColumn={true}>
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
  );
});

const NFTStrategyInfoCard = memo(function ({ pot, classes, t, i18n }) {
  const bodyKey = `pot.infocards.nft-strategy.${pot.id}.body`;
  const body = i18n.exists(bodyKey)
    ? t(bodyKey, {
        returnObjects: true,
        token: pot.token,
        name: pot.name,
        collection: pot.infoCardNftCollectionName,
      })
    : null;

  const raritiesKey = `pot.infocards.nft-strategy.${pot.id}.rarities`;
  const rarities = i18n.exists(raritiesKey)
    ? t(raritiesKey, {
        returnObjects: true,
      })
    : null;

  const nftsKey = `pot.infocards.nft-strategy.${pot.id}.nfts`;
  const nfts = i18n.exists(nftsKey)
    ? t(nftsKey, {
        returnObjects: true,
      })
    : null;

  return (
    <>
      <Card variant="purpleInfo" className={classes.strategy} oneColumn={true}>
        <CardTitle>{t('pot.infocards.nft-strategy.title', { name: pot.name })}</CardTitle>
        {body ? body.map((text, i) => <p key={i}>{text}</p>) : null}
        {rarities ? (
          <Grid container spacing={1} className={classes.nftShowcase}>
            {Object.entries(rarities).map(([key, item]) => (
              <Grid item xs={4} className={classes.nftShowcaseItem} key={key}>
                <img
                  src={require(`../../../../images/nfts/${pot.id}/${key}.png`).default}
                  width={1000}
                  height={1200}
                  className={classes.nftShowcaseImg}
                  alt={item.name}
                />
                <div className={classes.nftShowcaseItemName}>{item.name}</div>
                <div className={classes.nftShowcaseItemRarity}>{item.rarity}</div>
              </Grid>
            ))}
          </Grid>
        ) : null}
        {pot.nfts ? (
          <Grid container spacing={1} className={classes.nftShowcase}>
            {pot.nfts
              .map(nft =>
                (nft.ids || []).map(id => (
                  <Grid item xs={4} className={classes.nftShowcaseItem} key={`${nft.slug}/${id}`}>
                    <img
                      src={
                        require(`../../../../images/nfts/${pot.id}/${nft.slug}/${id}.png`).default
                      }
                      className={classes.nftShowcaseImg}
                      alt={nfts?.[`${nft.slug}/${id}`] ?? ''}
                    />
                    <div className={classes.nftShowcaseItemName}>
                      {nfts?.[`${nft.slug}/${id}`] ?? '#' + id}
                    </div>
                  </Grid>
                ))
              )
              .flat()}
          </Grid>
        ) : null}
        {pot.infoCardNftStrategyCollection ? (
          <p>
            <a
              href={pot.infoCardNftStrategyCollection}
              rel="noreferrer"
              target="_blank"
              className={classes.link}
            >
              {t('pot.infocards.nft-strategy.nftCollectionLink', { name: pot.name })}{' '}
              <OpenInNew fontSize="inherit" />
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
    </>
  );
});

const XmasStrategyInfoCard = memo(function ({ pot, classes, t, i18n }) {
  const bodyKey = `pot.infocards.xmas-strategy.${pot.id}.body`;
  const body = i18n.exists(bodyKey)
    ? t(bodyKey, {
        returnObjects: true,
        token: pot.token,
        name: pot.name,
      })
    : null;

  const merchKey = `pot.infocards.xmas-strategy.${pot.id}.merch`;
  const merch = i18n.exists(merchKey)
    ? t(merchKey, {
        returnObjects: true,
      })
    : null;

  return (
    <>
      <Card variant="purpleInfo" className={classes.strategy} oneColumn={true}>
        <CardTitle>{t('pot.infocards.xmas-strategy.title', { name: pot.name })}</CardTitle>
        {body ? body.map((text, i) => <p key={i}>{text}</p>) : null}
        {merch ? (
          <Grid container spacing={1} className={classes.merchShowcase}>
            {Object.entries(merch).map(([filename, item]) => (
              <Grid item key={filename} xs>
                <figure>
                  <img
                    src={require(`../../../../images/merch/${filename}`).default}
                    alt={item.title}
                  />
                  <figcaption>{item.title}</figcaption>
                </figure>
              </Grid>
            ))}
          </Grid>
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
    </>
  );
});

const InterestBreakdownInfoCard = memo(function ({ pot, classes, t }) {
  // If fees are handled manually, displayed breakdown might differ from calculation breakdown
  const interestBreakdown = pot.displayInterestBreakdown || pot.interestBreakdown || null;
  if (!interestBreakdown) {
    return null;
  }

  return (
    <Card variant="purpleInfo" oneColumn={true}>
      <CardTitle>{t('pot.infocards.earnings.title')}</CardTitle>
      {interestBreakdown.interest ? (
        <div className={classes.earningItem}>
          <div className={classes.earningLabel}>
            {t('pot.infocards.earnings.tokenInterest', { token: pot.token })}
          </div>
          <div className={classes.earningValue}>{interestBreakdown.interest}%</div>
        </div>
      ) : null}
      {interestBreakdown.prize ? (
        <div className={classes.earningItem}>
          <div className={classes.earningLabel}>
            {t('pot.infocards.earnings.nameMoonpotPrizeDraw', { name: pot.name })}
          </div>
          <div className={classes.earningValue}>{interestBreakdown.prize}%</div>
        </div>
      ) : null}
      {interestBreakdown.buyback ? (
        <div className={classes.earningItem}>
          <div className={classes.earningLabel}>
            {t('pot.infocards.earnings.buyback', { token: pot.token })}
          </div>
          <div className={classes.earningValue}>{interestBreakdown.buyback}%</div>
        </div>
      ) : null}
      {interestBreakdown.ziggyInterest ? (
        <div className={classes.earningItem}>
          <div className={classes.earningLabel}>
            {t('pot.infocards.earnings.ziggysPotInterest')}
          </div>
          <div className={classes.earningValue}>{interestBreakdown.ziggyInterest}%</div>
        </div>
      ) : null}
      {interestBreakdown.ziggyPrize ? (
        <div className={classes.earningItem}>
          <div className={classes.earningLabel}>{t('pot.infocards.earnings.ziggysPrizeDraw')}</div>
          <div className={classes.earningValue}>{interestBreakdown.ziggyPrize}%</div>
        </div>
      ) : null}
      {interestBreakdown.treasury ? (
        <div className={classes.earningItem}>
          <div className={classes.earningLabel}>{t('pot.infocards.earnings.treasury')}</div>
          <div className={classes.earningValue}>{interestBreakdown.treasury}%</div>
        </div>
      ) : null}
    </Card>
  );
});

const FairplayInfoCard = memo(function ({ pot, classes, t, fairplayRef }) {
  return (
    <Card variant="purpleInfo" ref={fairplayRef} className={classes.fairplayRules} oneColumn={true}>
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
      {t('pot.infocards.fairplay.body', {
        returnObjects: true,
        token: pot.token,
        duration: pot.fairplayDuration,
        ticketFee: pot.fairplayTicketFee * 100,
        fairplayFee: pot.fairplayFee * 100,
      }).map((text, i) => (
        <p key={i}>{text}</p>
      ))}
    </Card>
  );
});

const NFTFairplayInfoCard = memo(function ({ pot, classes, t, fairplayRef }) {
  return (
    <Card variant="purpleInfo" ref={fairplayRef} className={classes.fairplayRules} oneColumn={true}>
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
      <CardTitle>{t('pot.infocards.nft-fairplay.title', { name: pot.name })}</CardTitle>
      {t('pot.infocards.nft-fairplay.body', {
        returnObjects: true,
        token: pot.token,
        duration: pot.fairplayDuration,
        ticketFee: pot.fairplayTicketFee * 100,
        fairplayFee: pot.fairplayFee * 100,
      }).map((text, i) => (
        <p key={i}>{text}</p>
      ))}
    </Card>
  );
});

const defaultInfoCards = ['strategy', 'breakdown', 'fairplay'];
const cardComponentMap = {
  strategy: StrategyInfoCard,
  breakdown: InterestBreakdownInfoCard,
  fairplay: FairplayInfoCard,
  'nft-strategy': NFTStrategyInfoCard,
  'nft-fairplay': NFTFairplayInfoCard,
  'xmas-strategy': XmasStrategyInfoCard,
};

export const InfoCards = memo(function ({ id, className, fairplayRef }) {
  const pot = usePot(id);
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const infoCards = pot.infoCards || defaultInfoCards;

  if (infoCards.length) {
    return (
      <>
        {infoCards.map(key => {
          const InfoCard = cardComponentMap[key];
          return InfoCard ? (
            <InfoCard
              key={key}
              pot={pot}
              t={t}
              classes={classes}
              fairplayRef={fairplayRef}
              i18n={i18n}
            />
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
      </>
    );
  }

  return null;
});
