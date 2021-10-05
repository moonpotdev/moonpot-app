import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Translate } from '../Translate';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Fade, Grid, Tooltip, Typography } from '@material-ui/core';
import { HelpOutline } from '@material-ui/icons';
import styles from './styles';
import BigNumber from 'bignumber.js';

const useStyles = makeStyles(styles);

const StyledTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: '#373737',
    color: '#FFFFFF',
    fontSize: '15px',
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
  const { t } = useTranslation();
  const classes = useStyles();

  const baseApy = pot.apy;
  const bonusApy = pot.bonusApy;
  const bonusApr = new BigNumber(pot.bonusApr);

  const bonuses = pot.bonuses;

  /*-----Create Bonus Token Text-----*/
  var bonusCount = 0;
  var bonusTokens = '';
  for (var i in bonuses) {
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
      <>
        <div style={{ width: '300px' }}>
          {pot.token != 'POTS' ? (
            <>
              {/*----------------STANDARD POTS----------------*/}
              {/*Base APY*/}
              <Grid container style={{ width: '100%' }}>
                <Grid item xs={6}>
                  <Typography align={'left'}>
                    <Translate i18nKey="pot.tokenAPY" values={{ token: pot.token }} />
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography align={'right'} style={{ marginRight: '32px' }}>
                    {pot.apy.toFixed(2) + '%'}
                  </Typography>
                </Grid>
              </Grid>
              {/*Bonus APR*/}
              {pot.bonuses.map(bonus => (
                <div key={bonus.id}>
                  {bonus.apr != 0 ? (
                    <Grid container style={{ width: '100%' }} key={bonus.id}>
                      <Grid item xs={6}>
                        <Typography align={'left'}>
                          {bonus.display === 'bonus' ? (
                            <Translate
                              i18nKey="pot.bonusTokenAPR"
                              values={{ token: bonus.symbol }}
                            />
                          ) : (
                            <Translate
                              i18nKey="pot.superBoostTokenAPR"
                              values={{ token: bonus.symbol }}
                            />
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align={'right'} style={{ marginRight: '32px' }}>
                          {bonus.apr.toFixed(2) + '%'}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}
                </div>
              ))}
              {/*Total APY*/}
              <Grid container style={{ width: '100%' }}>
                <Grid item xs={6}>
                  <Typography align={'left'} style={{ fontWeight: '700' }}>
                    <Translate i18nKey="pot.totalAPY" />
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography align={'right'} style={{ marginRight: '32px', fontWeight: '700' }}>
                    {totalApy.toFixed(2) + '%'}
                  </Typography>
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              {/*----------------Ziggy's POT----------------*/}
              {/*APR*/}
              <Grid container style={{ width: '100%' }}>
                <Grid item xs={6}>
                  <Typography align={'left'}>
                    <Translate i18nKey="pot.tokenAPR" values={{ token: pot.token }} />
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography align={'right'} style={{ marginRight: '32px' }}>
                    {bonusApr.toFixed(2) + '%'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography align={'left'} style={{ fontWeight: '700' }}>
                    <Translate i18nKey="pot.tokenAPY" values={{ token: pot.token }} />
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography align={'right'} style={{ marginRight: '32px', fontWeight: '700' }}>
                    {BigNumber(pot.bonusApy).toFixed(2) + '%'}
                  </Typography>
                </Grid>
              </Grid>
            </>
          )}

          {/*Divider*/}
          <Grid item xs={12}>
            <div
              style={{
                width: 'calc(100% - 32px)',
                marginTop: '8px',
                marginBottom: '0',
                borderBottom: '2px solid #4B4B4B',
              }}
            ></div>
          </Grid>
          {/*Description*/}
          {pot.token != 'POTS' ? (
            <Typography style={{ marginRight: '32px', marginTop: '8px' }}>
              {bonusTokens == '' ? (
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
            </Typography>
          ) : (
            <Typography style={{ marginRight: '32px', marginTop: '8px' }}>
              <Translate i18nKey="pot.tooltip.pots" />
            </Typography>
          )}
        </div>
      </>
    );

    return text;
  }, [pot.bonuses, pot.id]);

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
