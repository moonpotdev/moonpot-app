import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, InputBase, makeStyles, withStyles } from '@material-ui/core';
import { bigNumberTruncate } from '../../helpers/format';
import styles from './styles';
import { BaseButton } from '../Buttons/BaseButton';
import { styledBy } from '../../helpers/utils';
import clsx from 'clsx';
import BigNumber from 'bignumber.js';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { useTokenBalance } from '../../helpers/hooks';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const MAX_DECIMALS = 8;
const useStyles = makeStyles(styles);

// For toString
BigNumber.config({ EXPONENTIAL_AT: 21 });

const MaxButton = withStyles({
  root: {
    color: 'rgba(255, 255, 255, 0.95)',
    backgroundColor: styledBy('variant', {
      teal: '#6B96BD',
      purple: '#B6ADCC',
      purpleAlt: '#656FA5',
    }),
    '&:hover': {
      color: 'rgba(255, 255, 255, 0.95)',
      backgroundColor: styledBy('variant', {
        teal: '#628cad',
        purple: '#B6ADCC',
        purpleAlt: '#656FA5',
      }),
    },
    '&:focus': {
      color: 'rgba(255, 255, 255, 0.95)',
      backgroundColor: styledBy('variant', {
        teal: '#628cad',
        purple: '#B6ADCC',
        purpleAlt: '#656FA5',
      }),
    },
    '& .MuiTouchRipple-child': {
      backgroundColor: styledBy('variant', {
        teal: '#50758f',
        purple: '#B6ADCC',
        purpleAlt: '#656FA5',
      }),
    },
  },
})(BaseButton);

export const LPTokenInput = function ({
  variant = 'green',
  pot,
  token,
  max,
  value,
  setValue,
  setIsMax,
}) {
  const { t } = useTranslation();
  const classes = useStyles();

  const maxTruncated = useMemo(() => {
    return bigNumberTruncate(max, MAX_DECIMALS);
  }, [max]);

  const handleMax = useCallback(() => {
    if (maxTruncated.gt(0)) {
      setValue(maxTruncated.toString());
      setIsMax(true);
    } else {
      setValue('');
      setIsMax(false);
    }
  }, [setValue, setIsMax, maxTruncated]);

  const handleChange = useCallback(
    e => {
      const inputValue = e.target.value;
      const bn = bigNumberTruncate(inputValue, MAX_DECIMALS);

      if (bn.lt(0)) {
        setValue('');
        setIsMax(false);
      } else if (bn.gte(maxTruncated)) {
        setValue(maxTruncated.toString());
        setIsMax(true);
      } else {
        setValue(inputValue);
        setIsMax(false);
      }
    },
    [setValue, setIsMax, maxTruncated]
  );

  const handleBlur = useCallback(() => {
    const bn = bigNumberTruncate(value, MAX_DECIMALS);
    setValue(bn.gt(0) ? bn.toString() : '');
  }, [value, setValue]);

  function variantClass(classes, prefix, variant) {
    const key = prefix + variant[0].toUpperCase() + variant.substr(1);
    return key in classes ? classes[key] : false;
  }

  //Handle dropdown token selection
  const [selectedDepositToken, setSelectedDepositToken] = React.useState(pot.token);
  const handleSelect = event => {
    setSelectedDepositToken(event.target.value);
  };

  const selectedTokenBalance = useTokenBalance('WBNB', 18);

  //Load LP Icon
  const LPTokenIcon = require(`../../images/tokens/${token.toLowerCase()}.svg`).default;

  React.useEffect(() => {
    console.log(selectedTokenBalance.toFixed(2));
    //console.log(max);
  });

  return (
    <Grid container>
      <Grid item className={classes.selectField}>
        <FormControl className={classes.selectContainer}>
          <Select
            className={clsx(classes.select, variantClass(classes, 'variant', variant))}
            IconComponent={KeyboardArrowDownIcon}
            value={selectedDepositToken}
            onChange={handleSelect}
            MenuProps={{
              classes: {
                paper: clsx(classes.menuStyle, variantClass(classes, 'variant', variant)),
              },
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              getContentAnchorEl: null,
            }}
          >
            {/*Handle Base LP*/}
            <MenuItem value={pot.token}>
              <img
                src={LPTokenIcon}
                alt=""
                aria-hidden={true}
                className={classes.token}
                width={24}
                height={24}
              />
              POTS-BNB LP
            </MenuItem>
            {/*Handle LP Components*/}
            {pot.LPcomponents.map(item => (
              <MenuItem value={item.token} key={item.token}>
                <img
                  src={require(`../../images/tokens/${item.token.toLowerCase()}.svg`).default}
                  alt=""
                  aria-hidden={true}
                  className={classes.token}
                  width={24}
                  height={24}
                />
                {item.token}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid className={classes.inputField}>
        <InputBase
          className={clsx(classes.input, variantClass(classes, 'variant', variant))}
          placeholder={'0.0'}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={max.lte(0)}
          endAdornment={
            <MaxButton
              variant={variant}
              onClick={handleMax}
              className={classes.max}
              disabled={max.lte(0)}
            >
              {t('tokenInput.max')}
            </MaxButton>
          }
        />
      </Grid>
    </Grid>
  );
};
