import React, { useEffect, useState } from 'react';
import { Grid, makeStyles, MenuItem, Select, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import reduxActions from '../../../redux/actions';
import styles from './styles';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles(styles);

const PotTypes = [
  {
    key: 'featured',
    path: 'featured',
    label: 'buttons.featured',
  },
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
    key: 'stable',
    path: 'stable',
    label: 'buttons.stablePots',
  },
  {
    key: 'nft',
    path: 'nft',
    label: 'buttons.nftPots',
  },
  {
    key: 'community',
    path: 'community',
    label: 'buttons.communityPots',
  },
  {
    key: 'lp',
    path: 'lp',
    label: 'buttons.lpPots',
  },
  {
    key: 'side',
    path: 'side',
    label: 'buttons.sidePots',
  },
];

const sortByTypes = [
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

const potStatusTypes = [
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

const iconComponent = props => {
  return <ExpandMoreIcon style={{ color: '#8F8FBC' }} className={props.className} />;
};

const Filter = ({ className, selected, potType, potStatus, sort }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const [currentType, setCurrentType] = useState(potType || 'featured');
  const [currentStatus, setCurrentStatus] = useState(potStatus || 'active');
  const [currentSort, setCurrentSort] = useState(sort || 'default');

  const handleTypeChange = event => {
    setCurrentType(event.target.value);
  };
  const handleStatusChange = event => {
    setCurrentStatus(event.target.value);
  };
  const handleSortChange = event => {
    setCurrentSort(event.target.value);
  };

  useEffect(() => {
    //Update filters globally when they are changed
    if (selected === 'my-moonpots') {
      //For my pots set status and sort with redux
      dispatch(reduxActions.filter.updateFilterStatus(currentStatus));
      dispatch(reduxActions.filter.updateFilterSort(currentSort));
      history.push({
        pathname: '/my-moonpots/',
        state: { tabbed: true },
      });
    } else {
      //For moonpots page set pot type with path and sort with redux
      dispatch(reduxActions.filter.updateFilterSort(currentSort));
      history.push({
        pathname: '/' + currentType,
        state: { tabbed: true },
      });
    }
  }, [currentType, currentStatus, currentSort, history, selected, dispatch]);

  return (
    <div className={classes.buttonsOuterContainer}>
      <Grid container className={clsx(classes.buttonContainer, className)}>
        {/* First dropdown: moonpots -> type, my-pots -> status */}
        {selected === 'my-moonpots' ? (
          <Select
            className={classes.select}
            id="pot-type-select"
            onChange={handleStatusChange}
            value={currentStatus}
            disableUnderline
            IconComponent={iconComponent}
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
            }}
          >
            {potStatusTypes.map(type => (
              <MenuItem key={type.key} value={type.path}>
                <div style={{ display: 'flex' }}>
                  <Typography className={classes.selectLabel}>{t('potStatus')}&nbsp;</Typography>
                  <Typography
                    className={
                      currentStatus === type.key ? classes.selectValueSelected : classes.selectValue
                    }
                  >
                    {t(type.label)}
                  </Typography>
                </div>
              </MenuItem>
            ))}
          </Select>
        ) : (
          <Select
            className={classes.select}
            id="pot-type-select"
            onChange={handleTypeChange}
            value={currentType}
            disableUnderline
            IconComponent={iconComponent}
            MenuProps={{
              classes: {
                paper: classes.menuStyle,
              },
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
            {PotTypes.map(type => (
              <MenuItem key={type.key} value={type.path}>
                <div style={{ display: 'flex' }}>
                  <Typography className={classes.selectLabel}>{t('potType')}&nbsp;</Typography>
                  <Typography
                    className={
                      potType === type.key ? classes.selectValueSelected : classes.selectValue
                    }
                  >
                    {t(type.label)}
                  </Typography>
                </div>
              </MenuItem>
            ))}
          </Select>
        )}
        {/* Second dropdown: sort */}
        <Select
          className={classes.select}
          id="pot-type-select"
          onChange={handleSortChange}
          value={currentSort}
          disableUnderline
          IconComponent={iconComponent}
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
          }}
        >
          {sortByTypes.map(type => (
            <MenuItem key={type.key} value={type.path}>
              <div style={{ display: 'flex' }}>
                <Typography className={classes.selectLabel}>{t('sortBy')}&nbsp;</Typography>
                <Typography
                  className={sort === type.key ? classes.selectValueSelected : classes.selectValue}
                >
                  {t(type.label)}
                </Typography>
              </div>
            </MenuItem>
          ))}
        </Select>
      </Grid>
    </div>
  );
};

export default Filter;
