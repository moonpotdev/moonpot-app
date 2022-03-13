import React, { memo } from 'react';
import { StaticSegmentedCountdown } from '../SegmentedCountdown';
import { Logo } from '../Pot';
import { makeStyles } from '@material-ui/core';
import { Translate } from '../Translate';
import styles from './styles';
import clsx from 'clsx';

const useStyles = makeStyles(styles);

export const FeaturedPotPlaceholderCard = memo(function FeaturedPotPlaceholderCard() {
  const classes = useStyles();

  return (
    <div className={clsx(classes.card, classes.placeholder)}>
      <div className={classes.cardTop}>
        <div className={classes.cardText}>
          <div className={classes.cardWin}>
            <Translate i18nKey="featuredPot.winPrizePlaceholder" />
          </div>
          <div className={classes.cardCountdown}>
            <StaticSegmentedCountdown days={0} hours={0} minutes={0} />
          </div>
        </div>
        <div className={classes.cardImage}>
          <Logo icon="pots" />
        </div>
      </div>
      <div className={classes.cardBottom}>
        <div className={classes.placeholderButton} />
      </div>
    </div>
  );
});
