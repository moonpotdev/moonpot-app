import React from 'react';
import { Card, CardTitle } from '../../Cards/Cards';
import { PrimaryButton } from '../../Buttons/PrimaryButton';
import { BaseButton } from '../../Buttons/BaseButton';
import { Typography, makeStyles } from '@material-ui/core';
import reduxActions from '../../../features/redux/actions';
import { useDispatch } from 'react-redux';
import { networkSetup } from '../../../config/networks';
import { useTranslation } from 'react-i18next';
import styles from './styles';

const useStyles = makeStyles(styles);

const WrongChainModal = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = useStyles();

  function closeModal() {
    dispatch(reduxActions.modal.hideModal());
  }

  function switchToNetwork(networdIdentifier) {
    networkSetup(networdIdentifier)
      .catch(e => {
        console.error(e);
        dispatch(reduxActions.modal.showUnableToSwitchChainModal());
      })
      .then(dispatch(reduxActions.modal.hideModal()));
  }

  return (
    <React.Fragment>
      <Card variant="white" className={classes.card}>
        <CardTitle className={classes.title}>{t('modals.unsupportedNetworkDetected')}</CardTitle>
        <Typography className={classes.text}>{t('modals.switchToBSCNetwork')}</Typography>
        <PrimaryButton onClick={() => switchToNetwork('bsc')} className={classes.switchButton}>
          {t('modals.switchToBSC')}
        </PrimaryButton>
      </Card>
      <BaseButton onClick={() => closeModal()} className={classes.dismissButton}>
        {t('modals.cancel')}
      </BaseButton>
    </React.Fragment>
  );
};

export default WrongChainModal;
