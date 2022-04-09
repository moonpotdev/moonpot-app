import React, { memo, PropsWithChildren, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, MenuItem, Select } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { potsAll } from '../../config/vault';
import styles from './styles';
import { sortBy, uniq } from 'lodash';

const useStyles = makeStyles(styles);

function potsSelectSelectedRender(selected: unknown) {
  if (Array.isArray(selected)) {
    return <PotsSelectSelected selected={selected} />;
  }

  return <PotsSelectSelected selected={[]} />;
}

type PotsSelectSelectedProps = PropsWithChildren<{
  selected: string[];
  className?: string;
}>;
const PotsSelectSelected = memo<PotsSelectSelectedProps>(function PotsSelectSelected({
  selected,
  className,
}) {
  const { t } = useTranslation();
  return (
    <div className={className}>
      {selected.length < 2
        ? selected.length === 0
          ? t('filters.all')
          : selected[0]
        : t('filters.multipleSelected')}
    </div>
  );
});

export type PotsSelectProps = PropsWithChildren<{
  selected: string[];
  className?: string;
  onChange: (value: string[]) => void;
}>;
export const PotsSelect = memo<PotsSelectProps>(function PotsSelect({
  selected,
  onChange,
  className,
}) {
  const classes = useStyles();
  const { t } = useTranslation();
  const options = useMemo(() => {
    return uniq(sortBy(potsAll, 'name').map(pot => pot.name));
  }, []);
  const handleChange = useCallback(
    event => {
      const value: string[] = event.target.value;
      if (value.length === options.length) {
        onChange([]);
      } else {
        onChange(value);
      }
    },
    [onChange, options.length]
  );
  const label = t('filters.pot');

  return (
    <Select
      multiple
      displayEmpty
      value={selected}
      className={className}
      onChange={handleChange}
      renderValue={potsSelectSelectedRender}
      classes={{ select: classes.dropdownSelect, icon: classes.dropdownIcon }}
      disableUnderline
      IconComponent={ExpandMoreIcon}
      SelectDisplayProps={{
        'aria-label': label,
      }}
      MenuProps={{
        classes: { paper: classes.dropdownPaper, list: classes.dropdownList },
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'left',
        },
        getContentAnchorEl: null,
      }}
    >
      {options.map(option => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
});
