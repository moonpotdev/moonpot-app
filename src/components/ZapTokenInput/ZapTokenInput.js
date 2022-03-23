import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { InputBase, makeStyles } from '@material-ui/core';
import { bigNumberTruncate } from '../../helpers/format';
import styles from './styles';
import { variantClass } from '../../helpers/utils';
import clsx from 'clsx';
import BigNumber from 'bignumber.js';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { MaxButton } from '../TokenInput/MaxButton';
import { TokenIcon } from '../TokenIcon/TokenIcon';

const MAX_DECIMALS = 8;
const useStyles = makeStyles(styles);

// For toString
BigNumber.config({ EXPONENTIAL_AT: 21 });

function DropdownIcon(props) {
  return <KeyboardArrowDownIcon {...props} viewBox="6 8.59000015258789 12 7.409999847412109" />;
}

export const ZapTokenInput = function ({
  variant = 'teal',
  selected,
  tokens,
  max,
  value,
  setValue,
  setIsMax,
  setSelected,
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

  const handleSelect = useCallback(
    event => {
      setSelected(event.target.value);
      setValue('');
      setIsMax(false);
    },
    [setSelected, setValue, setIsMax]
  );

  return (
    <div className={classes.fieldsHolder}>
      <div className={classes.selectField}>
        <Select
          className={clsx(classes.tokenSelect, variantClass(classes, 'inputVariant', variant))}
          disableUnderline
          IconComponent={DropdownIcon}
          value={selected}
          onChange={handleSelect}
          MenuProps={{
            classes: {
              paper: clsx(
                classes.tokenDropdown,
                variantClass(classes, 'tokenDropdownVariant', variant)
              ),
            },
            anchorOrigin: { horizontal: 'left', vertical: 'bottom' },
            transformOrigin: { horizontal: 'left', vertical: 'top' },
            getContentAnchorEl: null,
          }}
        >
          {tokens.map(token => (
            <MenuItem key={token.symbol} value={token.symbol} className={classes.tokenItem}>
              <TokenIcon token={token} />
              <span className={classes.tokenItemSymbol}>{token.symbol}</span>
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className={classes.inputField}>
        <InputBase
          className={clsx(classes.input, variantClass(classes, 'inputVariant', variant))}
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
      </div>
    </div>
  );
};
