import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { RoutedButton } from '../../../../components/Buttons/BaseButton';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import styles from './styles';

const useStyles = makeStyles(styles);

const SectionSelect = ({ selected, className }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Grid container className={clsx(classes.buttonsContainer, className)}>
      <Grid item xs={6}>
        <RoutedButton
          className={clsx(classes.button, { [classes.buttonSelected]: selected === 'moonpots' })}
          to={{ pathname: '/', state: { tabbed: true } }}
        >
          {t('buttons.moonpots')}
        </RoutedButton>
      </Grid>
      <Grid item xs={6}>
        <RoutedButton
          className={clsx(classes.button, { [classes.buttonSelected]: selected === 'my-moonpots' })}
          to={{ pathname: '/my-moonpots', state: { tabbed: true } }}
        >
          {t('buttons.myPots')}
        </RoutedButton>
      </Grid>
    </Grid>
  );
};

export default SectionSelect;
