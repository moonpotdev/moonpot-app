import React, { useState, useEffect } from 'react';
import {
  Grid,
  makeStyles,
  Select,
  Typography,
  MenuItem,
  Checkbox,
  ListItemIcon,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import styles from './styles';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useDispatch } from 'react-redux';
import reduxActions from '../../../redux/actions';
import { usePots } from '../../../../helpers/hooks';

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
    key: 'nft',
    path: 'nft',
    label: 'buttons.nftPots',
  },
];

const iconComponent = props => {
  return <ExpandMoreIcon style={{ color: '#8F8FBC' }} className={props.className} />;
};

const Filter = function () {
  const { t } = useTranslation();
  const classes = useStyles();
  const pots = usePots();
  const dispatch = useDispatch();

  const mapPotToList = pot => {
    const potListObj = {
      key: pot.id,
      path: pot.id,
      label: pot.name + ' Pot',
    };
    return potListObj;
  };

  const getInitialFeaturedPots = () => {
    let selectedPots = [];
    for (const pot in pots) {
      if (pots[pot].featured === true && pots[pot].status === 'active') {
        selectedPots.push(mapPotToList(pots[pot]));
      }
    }
    return selectedPots;
  };

  const [currentPots, setCurrentPots] = useState(getInitialFeaturedPots());

  const [currentType, setCurrentType] = useState('featured');
  const [selectedPots, setSelectedPots] = useState([]);

  const handleTypeChange = event => {
    setCurrentType(event.target.value);
    dispatch(reduxActions.filter.updateWinnerSort(event.target.value));
    setSelectedPots([]);
    dispatch(reduxActions.filter.updateWinnerPots([]));
  };
  const handlePotChange = event => {
    setSelectedPots(event.target.value);
    dispatch(reduxActions.filter.updateWinnerPots(event.target.value));
  };

  // Get list of pots for second dropdown
  useEffect(() => {
    let currentPots = [];
    if (currentType === 'featured') {
      // Check for featured pots
      for (const pot in pots) {
        if (pots[pot].featured === true && pots[pot].status === 'active') {
          currentPots.push(mapPotToList(pots[pot]));
        }
      }
    } else if (currentType === 'all') {
      // Check for all active pots
      for (const pot in pots) {
        if (pots[pot].status === 'active') {
          currentPots.push(mapPotToList(pots[pot]));
        }
      }
    } else {
      for (const pot in pots) {
        //Check for NFT/main pots
        if (pots[pot].vaultType === currentType && pots[pot].status === 'active') {
          currentPots.push(mapPotToList(pots[pot]));
        }
      }
    }
    setCurrentPots(currentPots);
  }, [currentType, pots]);

  return (
    <div className={classes.buttonsOuterContainer}>
      <Grid container className={clsx(classes.buttonContainer)}>
        {/* Pot Type */}
        <Select
          className={classes.select}
          id="pot-type-select"
          onChange={handleTypeChange}
          value={currentType}
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
                <Typography
                  className={
                    currentType === type.key ? classes.selectValueSelected : classes.selectValue
                  }
                >
                  {t(type.label)}
                </Typography>
              </div>
            </MenuItem>
          ))}
        </Select>
        {/* Pot Name */}
        <Select
          className={classes.select}
          id="pot-type-select"
          multiple
          onChange={handlePotChange}
          value={selectedPots}
          disableUnderline
          IconComponent={iconComponent}
          displayEmpty={true}
          renderValue={selectedPots => {
            let potNames = [];
            for (let i = 0; i < selectedPots.length; i++) {
              potNames.push(selectedPots[i].label);
            }
            if (potNames.length === 1) {
              return (
                <>
                  <span className={classes.potSelectLabel}>Pot:&nbsp;</span>
                  <span className={classes.selectValue}>{potNames[0]}</span>
                </>
              );
            } else if (potNames.length > 1) {
              return (
                <>
                  <span className={classes.potSelectLabel}>Pot:&nbsp;</span>
                  <span className={classes.selectValue}>Multiple selected</span>
                </>
              );
            } else {
              return (
                <>
                  <span className={classes.potSelectLabel}>Pot:&nbsp;</span>
                  <span className={classes.selectValue}>None selected</span>
                </>
              );
            }
          }}
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
          {currentPots.map(type => (
            <MenuItem key={type.key} value={type}>
              <div style={{ display: 'flex' }}>
                <ListItemIcon>
                  <Checkbox checked={selectedPots.indexOf(type) > -1} />
                </ListItemIcon>
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
