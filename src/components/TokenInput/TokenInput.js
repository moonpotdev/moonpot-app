import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { InputBase, makeStyles } from '@material-ui/core';
import { bigNumberTruncate } from '../../helpers/format';
import styles from './styles';
import { variantClass } from '../../helpers/utils';
import clsx from 'clsx';
import BigNumber from 'bignumber.js';
import { MaxButton } from './MaxButton';
import { TokenIcon } from '../TokenIcon';

const MAX_DECIMALS = 8;
const useStyles = makeStyles(styles);

// For toString
BigNumber.config({ EXPONENTIAL_AT: 21 });

export const TokenInput = function ({
  variant = 'teal',
  token,
  max,
  value,
  setValue,
  setIsMax,
  className,
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

  return (
    <InputBase
      startAdornment={<TokenIcon token={token} className={classes.token} />}
      className={clsx(classes.input, variantClass(classes, 'variant', variant), className)}
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
  );
};
