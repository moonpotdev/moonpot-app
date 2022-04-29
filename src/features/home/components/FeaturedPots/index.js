import React, { memo, useMemo } from 'react';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { createSelector } from 'reselect';
import { sortBy, take } from 'lodash';
import { useSelector } from 'react-redux';
import {
  FeaturedPotCard,
  FeaturedPotPlaceholderCard,
} from '../../../../components/FeaturedPotCard';
import styles from './styles';

const useStyles = makeStyles(styles);

// TODO move selectors to vault selectors file
const selectFeaturedPots = createSelector(
  state => state.vault.pools,
  pots => Object.values(pots).filter(pot => pot.featured && pot.status === 'active')
);

const selectUpcomingFeaturedPots = createSelector(selectFeaturedPots, pots =>
  pots.filter(pot => pot.expiresAt * 1000 > Date.now())
);

const selectNextThreeUpcomingFeaturedPots = createSelector(selectUpcomingFeaturedPots, pots =>
  take(sortBy(pots, ['expiresAt']), 3)
);

export const FeaturedPots = memo(function FeaturedPots() {
  const classes = useStyles();
  const { t } = useTranslation();
  const upcomingPots = useSelector(selectNextThreeUpcomingFeaturedPots);
  const pots = useMemo(() => {
    return upcomingPots.length ? upcomingPots : [null, null, null];
  }, [upcomingPots]);

  return (
    <div className={classes.featuredPots}>
      <div className={classes.container}>
        <h2 className={classes.title}>{t('home.featuredPots.title')}</h2>
        <div className={classes.row}>
          {pots.map((pot, i) => (
            <div className={classes.column} key={pot?.id || i}>
              {pot ? <FeaturedPotCard pot={pot} /> : <FeaturedPotPlaceholderCard />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
