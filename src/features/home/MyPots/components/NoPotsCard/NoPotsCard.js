import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from './styles';
import { Box, Button, Grid, makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { WalletRequired } from '../../../../../components/WalletRequired/WalletRequired';
import { useWalletConnected } from '../../../../wallet/hooks';

const useStyles = makeStyles(styles);

export default function NoPotsCard({ selected }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();
  const connected = useWalletConnected();

  // TODO make proper use of WalletRequired
  return (
    <Box className={classes.noActivePots}>
      <Grid container>
        <Grid item xs={5}>
          <img
            className={classes.noActivePotsImage}
            alt="No Active Moonpots"
            src={require('../../../../../images/ziggy/noActivePots.svg').default}
          />
        </Grid>
        <Grid item xs={8}>
          <Typography className={classes.noActivePotsTitle}>
            {connected ? t('playWithMoonpot') : t('wallet.connect')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.noActivePotsText}>
            {selected === 'active' ? (
              <>{connected ? t('youHaventEnteredMoonpots') : t('connectToJoin')}</>
            ) : (
              <>{connected ? t('youHaventEnteredRetiredMoonpots') : t('connectToJoin')}</>
            )}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <WalletRequired>
            <Button
              className={classes.noActivePotsPlayButton}
              onClick={() => {
                history.push('/');
              }}
            >
              {t('buttons.play')}
            </Button>
          </WalletRequired>
        </Grid>
      </Grid>
    </Box>
  );
}
