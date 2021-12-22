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

const iconComponent = props => {
  return (
    <ExpandMoreIcon
      style={{ color: '#8F8FBC' }}
      className={props.className + ' ' + useStyles.icon}
    />
  );
};

const Filter = ({ className, selected }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();

  //Get params from route
  let { filter, bottom, top } = useParams();
  //Current pot type
  const [currentPath, setCurrentPath] = useState(bottom || 'all');
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
    if (top === 'my-moonpots') {
      history.push('/my-moonpots/' + currentPath);
    } else {
      history.push('/' + currentPath + '/' + currentSort);
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
          {PotTypes.map(type => (
            <MenuItem key={type.key} value={type.path}>
              <div style={{ display: 'flex' }}>
                <Typography className={classes.selectLabel}>{t('potType')}&nbsp;</Typography>
                <Typography className={classes.selectValue}>{t(type.label)}</Typography>
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
          {sortByTypes.map(type => (
            <MenuItem key={type.key} value={type.path}>
              <div style={{ display: 'flex' }}>
                <Typography className={classes.selectLabel}>{t('sortBy')}&nbsp;</Typography>
                <Typography className={classes.selectValue}>{t(type.label)}</Typography>
              </div>
            </MenuItem>
          ))}
        </Select>
      </Grid>
    </div>
  );
};

export default Filter;
