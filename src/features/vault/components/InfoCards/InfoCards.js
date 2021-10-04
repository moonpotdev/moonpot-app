import React from 'react';
import { usePot } from '../../../../helpers/hooks';
import { Box, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
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

export const InfoCards = function ({ id, className, fairplayRef }) {
  const pot = usePot(id);
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Cards className={clsx(className)} oneUp={true}>
      {pot.infoCardStrategy ? (
        <Card variant="purpleDark" className={classes.strategy}>
          <CardTitle>{t('pot.infocards.strategy.title', { name: pot.name })}</CardTitle>
          {t('pot.infocards.strategy.body.' + pot.infoCardStrategy, {
            returnObjects: true,
            token: pot.token,
          }).map((text, i) => (
            <p key={i}>{text}</p>
          ))}
          {pot.infoCardBeefyVaultAddress ? (
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
      ) : null}
      {pot.interestBreakdown ? (
        <Card variant="purpleDark">
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
              <div className={classes.earningLabel}>
                {t('pot.infocards.earnings.ziggysPrizeDraw')}
              </div>
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
      ) : null}
      <Card variant="purpleDark" ref={fairplayRef} className={classes.fairplayRules}>
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
        }).map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </Card>
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
};
