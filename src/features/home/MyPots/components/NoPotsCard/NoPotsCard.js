import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from './styles';
import { Box, Button, Grid, Typography, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import reduxActions from '../../../../redux/actions';

const useStyles = makeStyles(styles);

export default function NoPotsCard({ selected }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const address = useSelector(state => state.walletReducer.address);

  const handleWalletConnect = () => {
    if (!address) {
      dispatch(reduxActions.wallet.connect());
    }
  };

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
            {address ? t('playWithMoonpot') : t('wallet.connect')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.noActivePotsText}>
            {selected === 'active' ? (
              <>{address ? t('youHaventEnteredMoonpots') : t('connectToJoin')}</>
            ) : (
              <>{address ? t('youHaventEnteredRetiredMoonpots') : t('connectToJoin')}</>
            )}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {address ? (
            <Button
              className={classes.noActivePotsPlayButton}
              onClick={() => {
                history.push('/');
              }}
            >
              {t('buttons.play')}
            </Button>
          ) : (
            <Button className={classes.noActivePotsPlayButton} onClick={handleWalletConnect}>
              {t('wallet.connect')}
            </Button>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
