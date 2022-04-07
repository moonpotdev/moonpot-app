import React, { memo, PropsWithChildren, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import PageVisibility from 'react-page-visibility';
import Ticker from 'react-ticker';
import styles from './styles';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '../../../../store';
import {
  selectHaveShrimpsLoadedOnce,
  selectShouldInitShrimps,
  selectShrimpById,
  selectShrimpIdAtIndex,
} from '../../../data/selectors/shrimps';
import { fetchShrimps } from '../../../data/actions/shrimps';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(styles);

type ShrimpProps = PropsWithChildren<{
  index: number;
}>;
const Shrimp = memo<ShrimpProps>(function Shrimp({ index }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const id = useAppSelector(state => selectShrimpIdAtIndex(state, index));
  const shrimp = useAppSelector(state => selectShrimpById(state, id));

  return (
    <div className={classes.shrimp}>
      <div className={classes.title}>{t(`shrimp.titles.${shrimp.title}`)}</div>
      <div className={classes.content}>
        🦐{' '}
        {t('shrimp.content', {
          address: shrimp.address.substring(0, 8),
          won: shrimp.won,
          deposited: shrimp.deposited,
        })}
      </div>
    </div>
  );
});

export type WinningShrimpsProps = PropsWithChildren<{
  className?: string;
}>;
export const WinningShrimps = memo<WinningShrimpsProps>(function WinningShrimps({ className }) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const haveLoaded = useAppSelector(selectHaveShrimpsLoadedOnce);
  const shouldLoad = useAppSelector(selectShouldInitShrimps);
  const [pageIsVisible, setPageIsVisible] = useState(true);

  useEffect(() => {
    if (shouldLoad) {
      dispatch(fetchShrimps());
    }
  }, [dispatch, shouldLoad]);

  return (
    <div className={clsx(classes.wrapper, className)}>
      <PageVisibility onChange={setPageIsVisible}>
        {haveLoaded ? (
          <Ticker height={84} move={pageIsVisible}>
            {({ index }) => <Shrimp index={index} />}
          </Ticker>
        ) : null}
      </PageVisibility>
    </div>
  );
});
