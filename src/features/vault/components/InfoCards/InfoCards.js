import React from 'react';
import { usePot } from '../../../../helpers/hooks';
import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import { Trans, useTranslation } from 'react-i18next';
import { OpenInNew } from '@material-ui/icons';
import styles from './styles';
import { Card, Cards } from '../../../../components/Cards/Cards';
import clsx from 'clsx';

const useStyles = makeStyles(styles);

export const InfoCards = function ({ id, className, fairplayRef }) {
  const pot = usePot(id);
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Cards className={clsx(className)}>
      <Card variant="purpleDark">
        <Grid container>
          <Grid item xs={12} align={'left'}>
            <Typography className={classes.infoTitle} align={'left'}>
              {pot.strategyCard?.title ? pot.strategyCard.title : pot.token + ' Moonpot Strategy'}
            </Typography>
          </Grid>
          <Grid item xs={12} align={'left'}>
            <Typography
              className={classes.infoMessage}
              align={'left'}
              style={{ marginBottom: '32px', whiteSpace: 'pre-wrap' }}
            >
              {pot.strategyCard?.body ? (
                pot.strategyCard.body
              ) : (
                <Trans i18nKey="moonpotStrategyMessage" values={{ token: pot.token }} />
              )}
            </Typography>
          </Grid>
          {pot.strategyAddress ? (
            <Grid item xs={12} align={'left'} style={{ marginBottom: '16px' }}>
              <a href={`https://bscscan.com/address/${pot.strategyAddress}`}>
                <Typography className={classes.infoMessage} align={'left'}>
                  Beefy Vault Address <OpenInNew fontSize="small" />
                </Typography>
              </a>
            </Grid>
          ) : null}
          <Grid item xs={12} align={'left'}>
            <a href={`https://bscscan.com/address/${pot.prizeStrategyAddress}`}>
              <Typography className={classes.infoMessage} align={'left'}>
                Moonpot Strategy Address <OpenInNew fontSize="small" />
              </Typography>
            </a>
          </Grid>
        </Grid>
      </Card>
      {pot.earningsBreakdown ? (
        <Card variant="purpleDark">
          <Grid container>
            <Grid item xs={12} align={'left'}>
              <Typography className={classes.infoTitle} align={'left'}>
                {t('earningsBreakdown')}
              </Typography>
            </Grid>
            <Grid item xs={12} align={'left'}>
              <Typography className={classes.infoSubHeader} align={'left'}>
                Your {pot.token} Interest
              </Typography>
            </Grid>
            <Grid item xs={12} align={'left'}>
              <Typography className={classes.infoDetail} align={'left'}>
                50%
              </Typography>
            </Grid>
            <Grid item xs={12} align={'left'}>
              <Typography className={classes.infoSubHeader} align={'left'}>
                {pot.token} Moonpot Prize Draw
              </Typography>
            </Grid>
            <Grid item xs={12} align={'left'}>
              <Typography className={classes.infoDetail} align={'left'}>
                40%
              </Typography>
            </Grid>
            <Grid item xs={12} align={'left'}>
              <Typography className={classes.infoSubHeader} align={'left'}>
                Ziggy's (Governance) Pot Interest
              </Typography>
            </Grid>
            <Grid item xs={12} align={'left'}>
              <Typography className={classes.infoDetail} align={'left'}>
                5%
              </Typography>
            </Grid>
            <Grid item xs={12} align={'left'}>
              <Typography className={classes.infoSubHeader} align={'left'}>
                Ziggy's (Governance) Prize Draw
              </Typography>
            </Grid>
            <Grid item xs={12} align={'left'}>
              <Typography
                className={classes.infoDetail}
                align={'left'}
                style={{ paddingBottom: 0 }}
              >
                5%
              </Typography>
            </Grid>
          </Grid>
        </Card>
      ) : null}
      <Card variant="purpleDark" ref={fairplayRef}>
        <Grid container>
          <Grid item xs={12} align={'left'}>
            <Box className={classes.ziggyTimelock}>
              <img
                alt="Ziggy"
                srcSet="
                                                images/ziggy/timelock@4x.png 4x,
                                                images/ziggy/timelock@3x.png 3x,
                                                images/ziggy/timelock@2x.png 2x,
                                                images/ziggy/timelock@1x.png 1x
                                            "
              />
            </Box>
          </Grid>
          <Grid item xs={12} align={'center'}>
            <Typography className={classes.infoTitle} align={'left'}>
              <Trans i18nKey="fairplayTimelockRules" />
            </Typography>
          </Grid>
          <Grid item xs={12} align={'center'}>
            <Typography className={classes.infoMessage} align={'left'}>
              <Trans i18nKey="fairplayTimelockRulesMessage" values={{ token: pot.token }} />
            </Typography>
          </Grid>
        </Grid>
      </Card>
      <Box className={classes.ziggyPlay}>
        <img
          alt=""
          srcSet="images/ziggy/play@4x.png 4x, images/ziggy/play@3x.png 3x,images/ziggy/play@2x.png 2x, images/ziggy/play@1x.png 1x"
          width="240"
        />
      </Box>
    </Cards>
  );
};
