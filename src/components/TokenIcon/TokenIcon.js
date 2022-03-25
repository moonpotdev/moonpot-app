import React, { memo } from 'react';
import clsx from 'clsx';
import { slug } from '../../helpers/format';
import { makeStyles } from '@material-ui/core';
import styles from './styles';

const useStyles = makeStyles(styles);

function getTokenSrc(name) {
  const tokenSlug = slug(name);
  const asset = require(`../../images/tokens/${tokenSlug}.svg`);

  return asset.default;
}

export const TokenIcon = memo(function TokenImage({ token, className }) {
  const classes = useStyles();
  const isTwoTokenLP = token.type === 'lp' && token.lp && token.lp.length === 2;
  const classNames = clsx(
    {
      [classes.icon]: true,
      [classes.lpWithdraw]: !token.icon && isTwoTokenLP && !token.isRemove,
      [classes.lpRemove]: !token.icon && isTwoTokenLP && token.isRemove === true,
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

  if (isTwoTokenLP) {
    return (
      <div className={classNames}>
        <img src={getTokenSrc(token.lp[0])} alt="" aria-hidden={true} width={24} height={24} />
        <img src={getTokenSrc(token.lp[1])} alt="" aria-hidden={true} width={24} height={24} />
      </div>
    );
  }

  return (
    <div className={classNames}>
      <img src={getTokenSrc(token.symbol)} alt="" aria-hidden={true} width={24} height={24} />
    </div>
  );
});
