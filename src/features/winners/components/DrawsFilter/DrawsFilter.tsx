import React, { memo, PropsWithChildren, useCallback } from 'react';
import { Container } from '../../../../components/Container';
import { ToggleButtonGroup } from '../../../../components/ToggleButtonGroup';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { filteredDrawsActions } from '../../../data/reducers/filtered-draws';
import {
  selectFilteredDrawsMode,
  selectFilteredDrawsNetworks,
} from '../../../data/selectors/filtered-draws';
import { makeStyles } from '@material-ui/core';
import styles from './styles';
import { NetworksSelect } from '../../../../components/NetworksSelect';

const useStyles = makeStyles(styles);

const modeOptions = [
  {
    value: 'all',
    label: 'buttons.allDraws',
  },
  {
    value: 'winning',
    label: 'buttons.myWinningDraws',
  },
];

export type DrawsFilterProps = PropsWithChildren<{
  className?: string;
}>;
export const DrawsFilter = memo<DrawsFilterProps>(function DrawsFilter({ className }) {
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const mode = useAppSelector(selectFilteredDrawsMode);
  const networks = useAppSelector(selectFilteredDrawsNetworks);

  const setMode = useCallback(
    mode => {
      dispatch(filteredDrawsActions.setMode(mode));
    },
    [dispatch]
  );

  const setNetworks = useCallback(
    networks => {
      dispatch(filteredDrawsActions.setNetworks(networks));
    },
    [dispatch]
  );

  return (
    <Container className={className}>
      <div className={classes.bar}>
        <ToggleButtonGroup
          className={classes.mode}
          selected={mode}
          options={modeOptions}
          onChange={setMode}
        />
        <NetworksSelect className={classes.networks} value={networks} onChange={setNetworks} />
      </div>
    </Container>
  );
});
