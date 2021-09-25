import React, { memo } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import styles from './styles';

const useStyles = makeStyles(styles);

export const TokenIcon = memo(function TokenImage({ token, className }) {
  const classes = useStyles();
  const classNames = clsx(
    {
      [classes.icon]: true,
      [classes.lpWithdraw]: !token.icon && token.type === 'lp' && !token.isRemove,
      [classes.lpRemove]: !token.icon && token.type === 'lp' && token.isRemove === true,
    },
    className
  );

  if (token.icon) {
    return (
      <div className={classNames}>
        <img
          src={require(`../../images/tokens/${token.icon}.svg`).default}
          alt=""
          aria-hidden={true}
          width={24}
          height={24}
        />
      </div>
    );
  }

  if (token.type === 'lp') {
    return (
      <div className={classNames}>
        <img
          src={require(`../../images/tokens/${token.lp[0].toLowerCase()}.svg`).default}
          alt=""
          aria-hidden={true}
          width={24}
          height={24}
        />
        <img
          src={require(`../../images/tokens/${token.lp[1].toLowerCase()}.svg`).default}
          alt=""
          aria-hidden={true}
          width={24}
          height={24}
        />
      </div>
    );
  }

  return (
    <div className={classNames}>
      <img
        src={require(`../../images/tokens/${token.symbol.toLowerCase()}.svg`).default}
        alt=""
        aria-hidden={true}
        width={24}
        height={24}
      />
    </div>
  );
});
