import React, { useState } from 'react';
import { Grid, makeStyles, Select, MenuItem, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
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
    key: 'lp',
    path: 'lp',
    label: 'buttons.lpPots',
  },
  {
    key: 'community',
    path: 'community',
    label: 'buttons.communityPots',
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
    apy: 'apy',
    path: 'apy',
    label: 'buttons.apy',
  },
];

const mySortByTypes = [
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
  return (
    <ExpandMoreIcon
      style={{ color: '#8F8FBC' }}
      className={props.className + ' ' + useStyles.icon}
    />
  );
};

const Filter = ({ className, selected, sort }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();

  //Get params from route
  let { filter, bottom, top } = useParams();
  console.log(top);
  //Current pot type
  const [currentPath, setCurrentPath] = useState(
    bottom || top === 'my-moonpots' ? 'all' : 'featured'
  );
  //Current filter type
  const [currentSort, setCurrentSort] = useState(filter || 'default');
  //Handle change of pot
  const handlePathChange = event => {
    setCurrentPath(event.target.value);
  };
  //Handle change of filter
  const handleSortChange = event => {
    setCurrentSort(event.target.value);
  };

  React.useEffect(() => {
    //Push path for my pots page
    if (top === 'my-moonpots') {
      //Check for valid filter selection, if not set to default for my pots
      if (currentSort === 'active' || currentSort === 'eol') {
        history.push({
          pathname: '/my-moonpots/' + currentPath + '/' + currentSort,
          state: { tabbed: true },
        });
      } else {
        setCurrentPath('all');
        setCurrentSort('active');
        // history.push({
        //   pathname: '/my-moonpots/' + currentPath + '/active',
        //   state: { tabbed: true },
        // });
        history.push({
          pathname: '/my-moonpots/all/active',
          state: { tabbed: true },
        });
      }
    } else {
      //Check for valid filter selection, if not set to default for moonpots
      if (currentSort !== 'active' && currentSort !== 'eol') {
        history.push({
          pathname: '/' + currentPath + '/' + currentSort,
          state: { tabbed: true },
        });
      } else {
        setCurrentSort('default');
        history.push({
          pathname: '/' + currentPath + '/default',
          state: { tabbed: true },
        });
      }
    }
  }, [currentPath, currentSort, history, top]);

  return (
    <div className={classes.buttonsOuterContainer}>
      <Grid container className={clsx(classes.buttonContainer, className)}>
        <Select
          className={classes.select}
          id="pot-type-select"
          onChange={handlePathChange}
          value={currentPath}
          disableUnderline
          IconComponent={iconComponent}
          MenuProps={{
            classes: {
              paper: classes.menuStyle,
              root: classes.selectRoot,
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
                    selected === type.key ? classes.selectValueSelected : classes.selectValue
                  }
                >
                  {t(type.label)}
                </Typography>
              </div>
            </MenuItem>
          ))}
        </Select>
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
          {top !== 'my-moonpots'
            ? sortByTypes.map(type => (
                <MenuItem key={type.key} value={type.path}>
                  <div style={{ display: 'flex' }}>
                    <Typography className={classes.selectLabel}>{t('sortBy')}&nbsp;</Typography>
                    <Typography
                      className={
                        sort === type.key ? classes.selectValueSelected : classes.selectValue
                      }
                    >
                      {t(type.label)}
                    </Typography>
                  </div>
                </MenuItem>
              ))
            : mySortByTypes.map(type => (
                <MenuItem key={type.key} value={type.path}>
                  <div style={{ display: 'flex' }}>
                    <Typography className={classes.selectLabel}>{t('potStatus')}&nbsp;</Typography>
                    <Typography
                      className={
                        sort === type.key ? classes.selectValueSelected : classes.selectValue
                      }
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
