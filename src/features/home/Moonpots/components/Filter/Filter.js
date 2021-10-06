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
        to={{ pathname: '/', state: { tabbed: true } }}
      >
        {t('buttons.allPots')}
      </RoutedButton>
      <RoutedButton
        className={clsx(classes.button, { [classes.buttonActive]: selected === 'main' })}
        to={{ pathname: '/main', state: { tabbed: true } }}
      >
        {t('buttons.mainPots')}
      </RoutedButton>
      <RoutedButton
        className={clsx(classes.button, { [classes.buttonActive]: selected === 'lp' })}
        to={{ pathname: '/lp', state: { tabbed: true } }}
      >
        {t('buttons.lpPots')}
      </RoutedButton>
      <RoutedButton
        className={clsx(classes.button, { [classes.buttonActive]: selected === 'stable' })}
        to={{ pathname: '/stable', state: { tabbed: true } }}
      >
        {t('buttons.stablePots')}
      </RoutedButton>
      <RoutedButton
        className={clsx(classes.button, { [classes.buttonActive]: selected === 'community' })}
        to={{ pathname: '/community', state: { tabbed: true } }}
      >
        {t('buttons.communityPots')}
      </RoutedButton>
    </Grid>
  );
};

export default Filter;
