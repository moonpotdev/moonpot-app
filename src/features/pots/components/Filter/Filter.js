import React, { memo, useCallback, useEffect } from 'react';
import { Grid, makeStyles, MenuItem, Select, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { networkByKey, networkKeys } from '../../../../config/networks';
import { selectFilterConfig, selectFilterMode } from '../../../filter/selectors';
import { filterSetConfig, filterSetMode } from '../../../filter/slice';

const useStyles = makeStyles(styles);

const categoryOptions = [
  {
    key: 'all',
    path: 'all',
    label: 'buttons.allPots',
  },
  {
    key: 'main',
    path: 'main',
    label: 'buttons.mainPots',
  },
  {
    key: 'nft',
    path: 'nft',
    label: 'buttons.nftPots',
  },
];

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

const IconComponent = props => {
  return <ExpandMoreIcon style={{ color: '#8F8FBC' }} className={props.className} />;
};

const Dropdown = memo(function Dropdown({ children, ...rest }) {
  const classes = useStyles();

  return (
    <Select
      className={classes.select}
      disableUnderline
      IconComponent={IconComponent}
      MenuProps={{
        classes: { paper: classes.menuStyle },
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'left',
        },
        getContentAnchorEl: null,
        disableScrollLock: true,
      }}
      {...rest}
    >
      {children}
    </Select>
  );
});

const Filter = ({ className, selected }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { category, network, status, sort } = useSelector(selectFilterConfig);
  const mode = useSelector(selectFilterMode);

  const handleCategoryChange = useCallback(
    event => {
      dispatch(filterSetConfig({ category: event.target.value }));
    },
    [dispatch]
  );

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

  const handleNetworkChange = useCallback(
    event => {
      dispatch(filterSetConfig({ network: event.target.value }));
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
    <div className={classes.buttonsOuterContainer}>
      <Grid container className={clsx(classes.buttonContainer, className)}>
        {/* network */}
        <Dropdown id="pot-network-select" onChange={handleNetworkChange} value={network}>
          <MenuItem key="all" value="all">
            <div style={{ display: 'flex' }}>
              <Typography className={classes.selectLabel}>{t('filters.network')}&nbsp;</Typography>
              <Typography
                className={network === 'all' ? classes.selectValueSelected : classes.selectValue}
              >
                {t('filters.all')}
              </Typography>
            </div>
          </MenuItem>
          {networkKeys.map(networkKey => (
            <MenuItem key={networkKey} value={networkKey}>
              <div style={{ display: 'flex' }}>
                <Typography className={classes.selectLabel}>
                  {t('filters.network')}&nbsp;
                </Typography>
                <Typography
                  className={
                    network === networkKey ? classes.selectValueSelected : classes.selectValue
                  }
                >
                  {networkByKey[networkKey].shortName || networkByKey[networkKey].name}
                </Typography>
              </div>
            </MenuItem>
          ))}
        </Dropdown>
        {/* moonpots -> type, my-pots -> status */}
        {selected === 'my-moonpots' ? (
          <Dropdown id="pot-type-select" onChange={handleStatusChange} value={status}>
            {statusOptions.map(statusOption => (
              <MenuItem key={statusOption.key} value={statusOption.path}>
                <div style={{ display: 'flex' }}>
                  <Typography className={classes.selectLabel}>
                    {t('filters.potStatus')}&nbsp;
                  </Typography>
                  <Typography
                    className={
                      status === statusOption.key
                        ? classes.selectValueSelected
                        : classes.selectValue
                    }
                  >
                    {t(statusOption.label)}
                  </Typography>
                </div>
              </MenuItem>
            ))}
          </Dropdown>
        ) : (
          <Dropdown id="pot-type-select" onChange={handleCategoryChange} value={category}>
            {categoryOptions.map(categoryOption => (
              <MenuItem key={categoryOption.key} value={categoryOption.path}>
                <div style={{ display: 'flex' }}>
                  <Typography className={classes.selectLabel}>
                    {t('filters.potType')}&nbsp;
                  </Typography>
                  <Typography
                    className={
                      category === categoryOption.key
                        ? classes.selectValueSelected
                        : classes.selectValue
                    }
                  >
                    {t(categoryOption.label)}
                  </Typography>
                </div>
              </MenuItem>
            ))}
          </Dropdown>
        )}
        {/* sort */}
        <Dropdown id="pot-sort-select" onChange={handleSortChange} value={sort}>
          {sortOptions.map(sortOption => (
            <MenuItem key={sortOption.key} value={sortOption.path}>
              <div style={{ display: 'flex' }}>
                <Typography className={classes.selectLabel}>{t('filters.sortBy')}&nbsp;</Typography>
                <Typography
                  className={
                    sort === sortOption.key ? classes.selectValueSelected : classes.selectValue
                  }
                >
                  {t(sortOption.label)}
                </Typography>
              </div>
            </MenuItem>
          ))}
        </Dropdown>
      </Grid>
    </div>
  );
};

export default Filter;
