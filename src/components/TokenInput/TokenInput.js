import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { InputBase, makeStyles, withStyles } from '@material-ui/core';
import { bigNumberTruncate } from '../../helpers/format';
import styles from './styles';
import { BaseButton } from '../Buttons/BaseButton';
import { styledBy } from '../../helpers/utils';
import clsx from 'clsx';
import BigNumber from 'bignumber.js';

const MAX_DECIMALS = 8;
const useStyles = makeStyles(styles);

// For toString
BigNumber.config({ EXPONENTIAL_AT: 21 });

const MaxButton = withStyles({
  root: {
    color: 'rgba(255, 255, 255, 0.95)',
    backgroundColor: styledBy('variant', {
      teal: '#6B96BD',
    }),
    '&:hover': {
      color: 'rgba(255, 255, 255, 0.95)',
      backgroundColor: styledBy('variant', {
        teal: '#628cad',
      }),
    },
    '&:focus': {
      color: 'rgba(255, 255, 255, 0.95)',
      backgroundColor: styledBy('variant', {
        teal: '#628cad',
      }),
    },
    '& .MuiTouchRipple-child': {
      backgroundColor: styledBy('variant', {
        teal: '#50758f',
      }),
    },
  },
})(BaseButton);

export const TokenInput = function ({ variant, token, max, value, setValue, setIsMax, className }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const tokenIcon = require(`../../images/tokens/${token.toLowerCase()}.svg`).default;
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
      startAdornment={
        <img
          src={tokenIcon}
          alt=""
          aria-hidden={true}
          className={classes.token}
          width={24}
          height={24}
        />
      }
      className={clsx(classes.input, className)}
      placeholder={t('tokenInput.placeholder', { token })}
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
