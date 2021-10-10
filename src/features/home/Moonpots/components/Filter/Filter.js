import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { RoutedButton } from '../../../../../components/Buttons/BaseButton';
import styles from './styles';
import clsx from 'clsx';

const useStyles = makeStyles(styles);

const PotTypes = [
  {
    key: 'all',
    path: '/',
    label: 'buttons.allPots',
  },
  {
    key: 'main',
    path: '/main',
    label: 'buttons.mainPots',
  },
  {
    key: 'side',
    path: '/side',
    label: 'buttons.sidePots',
  },
  {
    key: 'lp',
    path: '/lp',
    label: 'buttons.lpPots',
  },
  {
    key: 'stable',
    path: '/stable',
    label: 'buttons.stablePots',
  },
  {
    key: 'community',
    path: '/community',
    label: 'buttons.communityPots',
  },
];

const Filter = ({ className, selected }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Grid container className={clsx(classes.buttonContainer, className)}>
      {PotTypes.map(type => (
        <RoutedButton
          key={type.key}
          className={clsx(classes.button, { [classes.buttonActive]: selected === type.key })}
          to={{ pathname: type.path, state: { tabbed: true } }}
        >
          {t(type.label)}
        </RoutedButton>
      ))}
    </Grid>
  );
};

export default Filter;
