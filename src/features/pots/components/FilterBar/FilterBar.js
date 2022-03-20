import React, { memo, useCallback, useEffect } from 'react';
import { makeStyles, MenuItem, Select } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { selectFilterConfig, selectFilterMode } from '../../../filter/selectors';
import { filterSetConfig, filterSetMode } from '../../../filter/slice';
import { NetworksSelect } from '../NetworksSelect';
import SectionSelect from '../SectionSelect/SectionSelect';
import clsx from 'clsx';
import styles from './styles';
import { Container } from '../../../../components/Container';

const useStyles = makeStyles(styles);

const sortOptions = [
  {
    key: 'default',
    path: 'default',
    label: 'buttons.default',
  },
  {
    key: 'next-draw',
    path: 'next-draw',
    label: 'buttons.nextDraw',
  },
  {
    key: 'prize',
    path: 'prize',
    label: 'buttons.prize',
  },
  {
    key: 'apy',
    path: 'apy',
    label: 'buttons.apy',
  },
];

const statusOptions = [
  {
    key: 'active',
    path: 'active',
    label: 'buttons.myActivePots',
  },
  {
    key: 'eol',
    path: 'eol',
    label: 'buttons.myPastPots',
  },
];

const Dropdown = memo(function Dropdown({ children, className, label, ...rest }) {
  const classes = useStyles();

  return (
    <Select
      label={label}
      className={className}
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
      {...rest}
    >
      {children}
    </Select>
  );
});

const FilterBar = ({ selected }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { networks, status, sort } = useSelector(selectFilterConfig);
  const mode = useSelector(selectFilterMode);

  const handleStatusChange = useCallback(
    event => {
      dispatch(filterSetConfig({ status: event.target.value }));
    },
    [dispatch]
  );

  const handleSortChange = useCallback(
    event => {
      dispatch(filterSetConfig({ sort: event.target.value }));
    },
    [dispatch]
  );

  const handleNetworksChange = useCallback(
    values => {
      dispatch(filterSetConfig({ networks: values }));
    },
    [dispatch]
  );

  // Mode for filters
  useEffect(() => {
    if (mode !== selected) {
      dispatch(filterSetMode(selected));
    }
  }, [dispatch, selected, mode]);

  return (
    <Container className={classes.container}>
      <div className={classes.row}>
        <div className={clsx(classes.item, classes.itemSection)}>
          <SectionSelect selected={selected} className={classes.filterSection} />
        </div>
        <div className={clsx(classes.item, classes.itemNetwork)}>
          <NetworksSelect
            value={networks}
            onChange={handleNetworksChange}
            className={classes.filterNetwork}
          />
        </div>
        {selected === 'my-moonpots' ? (
          <div className={clsx(classes.item, classes.itemDropdown, classes.itemStatus)}>
            <Dropdown
              className={classes.filterDropdown}
              id="pot-type-select"
              onChange={handleStatusChange}
              value={status}
              label={t('filters.potStatus')}
            >
              {statusOptions.map(statusOption => (
                <MenuItem key={statusOption.key} value={statusOption.path}>
                  {t(statusOption.label)}
                </MenuItem>
              ))}
            </Dropdown>
          </div>
        ) : null}
        <div className={clsx(classes.item, classes.itemDropdown, classes.itemSort)}>
          <Dropdown
            className={classes.filterDropdown}
            id="pot-sort-select"
            onChange={handleSortChange}
            value={sort}
            label={t('filters.sortBy')}
          >
            {sortOptions.map(sortOption => (
              <MenuItem key={sortOption.key} value={sortOption.path}>
                {t(sortOption.label)}
              </MenuItem>
            ))}
          </Dropdown>
        </div>
      </div>
    </Container>
  );
};

export default FilterBar;
