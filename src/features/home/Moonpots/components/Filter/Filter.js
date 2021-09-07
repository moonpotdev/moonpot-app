import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { RoutedButton } from '../../../../../components/Buttons/BaseButton';
import styles from './styles';
import clsx from 'clsx';

const useStyles = makeStyles(styles);

const Filter = ({ className, selected }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Grid container className={clsx(classes.buttonContainer, className)}>
      <RoutedButton
        className={clsx(classes.button, { [classes.buttonActive]: selected === 'all' })}
        to="/"
      >
        {t('buttons.allPots')}
      </RoutedButton>
      <RoutedButton
        className={clsx(classes.button, { [classes.buttonActive]: selected === 'main' })}
        to="/main"
      >
        {t('buttons.mainPots')}
      </RoutedButton>
      <RoutedButton
        className={clsx(classes.button, { [classes.buttonActive]: selected === 'community' })}
        to="/community"
      >
        {t('buttons.communityPots')}
      </RoutedButton>
    </Grid>
  );
};

export default Filter;
