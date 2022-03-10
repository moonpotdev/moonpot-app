import React, { useState } from 'react';
import styles from './styles';
import { makeStyles } from '@material-ui/core/styles';
import { shrimpConfig } from '../../../../config/shrimp/shrimp';
import Ticker from 'react-ticker';
import { useTranslation } from 'react-i18next';
import PageVisibility from 'react-page-visibility';

const useStyles = makeStyles(styles);

const Shrimp = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [pageIsVisible, setPageIsVisible] = useState(true);

  const handleVisibilityChange = isVisible => {
    setPageIsVisible(isVisible);
  };

  return (
    <PageVisibility onChange={handleVisibilityChange}>
      <div className={classes.wrapper}>
        {pageIsVisible && (
          <Ticker height={84}>
            {({ index }) => (
              <div className={classes.tickerContentWrapper}>
                {shrimpConfig.map(shrimp => (
                  <div className={classes.tickerItemWrapper}>
                    <div className={classes.title}>{shrimp.title}</div>
                    <div className={classes.content}>
                      🦐{' '}
                      {t('shrimp.content', {
                        address: shrimp.address.substring(0, 8),
                        won: shrimp.won,
                        deposited: shrimp.deposited,
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Ticker>
        )}
      </div>
    </PageVisibility>
  );
};

export default Shrimp;
