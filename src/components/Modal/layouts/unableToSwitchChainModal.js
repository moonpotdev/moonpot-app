import React from 'react';
import { Card, CardTitle, Cards } from '../../Cards/Cards';
import { BaseButton } from '../../Buttons/BaseButton';
import { Typography, makeStyles } from '@material-ui/core';
import reduxActions from '../../../features/redux/actions';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styles from './styles';

const useStyles = makeStyles(styles);

const UnableToSwitchChainModal = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { t } = useTranslation();

  function closeModal() {
    dispatch(reduxActions.modal.hideModal());
  }

  return (
    <React.Fragment>
      <Cards>
        <Card variant="white" className={classes.card}>
          <CardTitle className={classes.title}>{t('modals.unableToAutoSwitch')}</CardTitle>
          <Typography className={classes.text}>{t('modals.manuallySetNetwork')}</Typography>
        </Card>
      </Cards>
      <BaseButton className={classes.dismissButton} onClick={() => closeModal()}>
        {t('modals.close')}
      </BaseButton>
    </React.Fragment>
  );
};

export default UnableToSwitchChainModal;
