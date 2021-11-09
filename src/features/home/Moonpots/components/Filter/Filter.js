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
    key: 'stable',
    path: '/stable',
    label: 'buttons.stablePots',
  },
  {
    key: 'nft',
    path: '/nft',
    label: 'buttons.nftPots',
  },
  {
    key: 'lp',
    path: '/lp',
    label: 'buttons.lpPots',
  },
  {
    key: 'community',
    path: '/community',
    label: 'buttons.communityPots',
  },
  {
    key: 'side',
    path: '/side',
    label: 'buttons.sidePots',
  },
];

const Filter = ({ className, selected }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.buttonsOuterContainer}>
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
    </div>
  );
};

export default Filter;
