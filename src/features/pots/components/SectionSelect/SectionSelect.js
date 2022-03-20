import React from 'react';
import { makeStyles } from '@material-ui/core';
import { RoutedButton } from '../../../../components/Buttons/BaseButton';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import styles from './styles';

const useStyles = makeStyles(styles);

const SectionSelect = ({ selected, className }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={clsx(classes.buttonsContainer, className)}>
      <RoutedButton
        className={clsx(classes.button, { [classes.buttonSelected]: selected === 'moonpots' })}
        to={{ pathname: '/moonpots', state: { tabbed: true } }}
      >
        {t('buttons.moonpots')}
      </RoutedButton>
      <RoutedButton
        className={clsx(classes.button, { [classes.buttonSelected]: selected === 'my-moonpots' })}
        to={{ pathname: '/my-moonpots', state: { tabbed: true } }}
      >
        {t('buttons.myPots')}
      </RoutedButton>
    </div>
  );
};

export default SectionSelect;
