import React, { memo, useCallback } from 'react';
import { Card } from '../../../../../components/Cards';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { filterSetConfig } from '../../../../filter/slice';
import { FILTER_DEFAULT } from '../../../../filter/constants';
import { BaseButton } from '../../../../../components/Buttons/BaseButton';
import styles from './styles';

const useStyles = makeStyles(styles);

export const NoPotsCard = memo(function NoPotsCard() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const resetFilterConfig = useCallback(() => {
    dispatch(filterSetConfig(FILTER_DEFAULT));
  }, [dispatch]);

  return (
    <Card variant="white" oneColumn={true} className={classes.card}>
      <h3 className={classes.title}>{t('noPotsCard.title')}</h3>
      <div className={classes.text}>
        {t('noPotsCard.text', { returnObjects: true }).map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>
      <div className={classes.buttons}>
        <BaseButton onClick={resetFilterConfig} classes={{ root: classes.button }}>
          {t('noPotsCard.reset')}
        </BaseButton>
      </div>
    </Card>
  );
});
