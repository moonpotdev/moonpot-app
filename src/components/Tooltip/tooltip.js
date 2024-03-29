import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Translate } from '../Translate';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Fade, Grid, Tooltip } from '@material-ui/core';
import { HelpOutline } from '@material-ui/icons';
import styles from './styles';
import { formatDecimals } from '../../helpers/format';

const useStyles = makeStyles(styles);

const StyledTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: '#373737',
    color: '#FFFFFF',
    fontSize: '13px',
    lineHeight: '24px',
    fontWeight: 'normal',
    padding: '16px',
    borderRadius: '10px',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '& p': {
      marginTop: '1em',
      marginBottom: 0,
      '&:first-child': {
        marginTop: 0,
      },
    },
  },
  arrow: {
    color: '#373737',
  },
}))(Tooltip);

export function TooltipWithIcon({ i18nKey, i18nValues = {} }) {
  const { t } = useTranslation();
  const classes = useStyles();

  const content = useMemo(() => {
    const text = t(i18nKey, { ...i18nValues, returnObjects: true });

    if (Array.isArray(text)) {
      return (
        <>
          {text.map(paragraph => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </>
      );
    }

    return text;
  }, [t, i18nKey, i18nValues]);

  return (
    <>
      <StyledTooltip
        arrow
        TransitionComponent={Fade}
        title={content}
        placement="top"
        enterTouchDelay={0}
        leaveTouchDelay={5000}
      >
        <HelpOutline fontSize="inherit" className={classes.icon} />
      </StyledTooltip>
    </>
  );
}

export function InterestTooltip({ pot }) {
  const classes = useStyles();

  const baseApy = pot.apy;
  const bonusApy = pot.bonusApy;
  // const bonusApr = new BigNumber(pot.bonusApr);

  const bonuses = pot.bonuses;

  /*-----Create Bonus Token Text-----*/
  let bonusCount = 0;
  let bonusTokens = '';
  for (let i in bonuses) {
    if (bonusCount > 0) {
      bonusTokens += ', ';
    }
    if (bonuses[i].apy > 0) {
      bonusTokens += bonuses[i].symbol;
      bonusCount++;
    }
  }

  const hasBaseApy = typeof baseApy === 'number' && baseApy > 0;
  const hasBonusApy = typeof bonusApy === 'number' && bonusApy > 0;
  //const hasBonusApr = typeof bonusApr === 'number' && bonusApr > 0;
  const totalApy = (hasBaseApy ? baseApy : 0) + (hasBonusApy ? bonusApy : 0);

  const content = useMemo(() => {
    const text = (
      <div className={classes.interestTooltip}>
        {/*Base APY*/}
        <Grid container style={{ width: '100%' }}>
          <Grid item xs={6}>
            <div style={{ textAlign: 'left' }}>
              <Translate i18nKey="pot.tokenAPY" values={{ token: pot.token }} />
            </div>
          </Grid>
          <Grid item xs={6}>
            <div style={{ textAlign: 'right', marginRight: '32px' }}>
              {pot.apy.toFixed(2) + '%'}
            </div>
          </Grid>
        </Grid>
        {/*Bonus APR*/}
        {pot.bonuses.map(bonus => (
          <div key={bonus.id}>
            {bonus.apr !== 0 ? (
              <Grid container style={{ width: '100%' }} key={bonus.id}>
                <Grid item xs={6}>
                  <div style={{ textAlign: 'left' }}>
                    {bonus.display === 'bonus' ? (
                      <Translate i18nKey="pot.bonusTokenAPR" values={{ token: bonus.symbol }} />
                    ) : (
                      <Translate
                        i18nKey="pot.superBoostTokenAPR"
                        values={{ token: bonus.symbol }}
                      />
                    )}
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div style={{ textAlign: 'right', marginRight: '32px' }}>
                    {bonus.apr.toFixed(2) + '%'}
                  </div>
                </Grid>
              </Grid>
            ) : null}
          </div>
        ))}
        {/*Total APY*/}
        <Grid container style={{ width: '100%' }}>
          <Grid item xs={6}>
            <div style={{ textAlign: 'left', fontWeight: '700' }}>
              <Translate i18nKey="pot.totalAPY" />
            </div>
          </Grid>
          <Grid item xs={6}>
            <div style={{ textAlign: 'right', marginRight: '32px', fontWeight: '700' }}>
              {totalApy.toFixed(2) + '%'}
            </div>
          </Grid>
        </Grid>
        {/*Divider*/}
        <Grid item xs={12}>
          <div
            style={{
              width: 'calc(100% - 32px)',
              marginTop: '8px',
              marginBottom: '0',
              borderBottom: '2px solid #4B4B4B',
            }}
          />
        </Grid>
        {/*Description*/}
        <div style={{ marginRight: '32px', marginTop: '8px' }}>
          {bonusTokens === '' ? (
            <Translate
              i18nKey="pot.tooltip.standardNoBoost"
              values={{ token: pot.token, bonus: bonusTokens }}
            />
          ) : (
            <Translate
              i18nKey="pot.tooltip.standard"
              values={{ token: pot.token, bonus: bonusTokens }}
            />
          )}
        </div>
      </div>
    );

    return text;
    //eslint-disable-next-line
  }, [pot.bonuses, pot.id, classes]);

  return (
    <>
      <StyledTooltip
        arrow
        TransitionComponent={Fade}
        title={content}
        placement="top"
        enterTouchDelay={0}
        leaveTouchDelay={5000}
      >
        <HelpOutline fontSize="inherit" className={classes.icon} />
      </StyledTooltip>
    </>
  );
}

export const ProjectedPrizeTooltip = memo(function ({ prizes, numberOfWinners }) {
  const classes = useStyles();

  return (
    <StyledTooltip
      arrow
      TransitionComponent={Fade}
      title={<ProjectedPrizeTooltipContent prizes={prizes} numberOfWinners={numberOfWinners} />}
      placement="top"
      enterTouchDelay={0}
      leaveTouchDelay={5000}
    >
      <HelpOutline fontSize="inherit" className={classes.icon} />
    </StyledTooltip>
  );
});

export const ProjectedPrizeTooltipContent = memo(function ({ prizes, numberOfWinners }) {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.prizeTooltip}>
      <div className={classes.prizeTooltipRow}>{t('pot.prizeSplitToolTip')}</div>
      {prizes.map(([token, total]) => {
        const tokens = formatDecimals(total.tokens.dividedBy(numberOfWinners), 2);
        const usd = total.isNft ? null : formatDecimals(total.usd.dividedBy(numberOfWinners), 2);

        return (
          <div key={token} className={classes.prizeTooltipRow}>
            <span>
              {tokens} {token}
            </span>{' '}
            {total.isNft ? null : <>(${usd})</>}
          </div>
        );
      })}
    </div>
  );
});
