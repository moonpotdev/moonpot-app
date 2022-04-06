import React, { memo, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import { networkIds } from '../../../../config/networks';
import { ReactComponent as LogoBsc } from '../../../../images/networks/bsc.svg';
import { ReactComponent as LogoFantom } from '../../../../images/networks/fantom.svg';
import styles from './styles';
import clsx from 'clsx';

const networkToLogo = {
  bsc: LogoBsc,
  fantom: LogoFantom,
};

const useStyles = makeStyles(styles);

const NetworkIcon = memo(function NetworkIcon({ network, ...rest }) {
  const Component = networkToLogo[network];
  return <Component {...rest} />;
});

export const NetworksSelect = memo(function NetworkSelect({ value, onChange, className }) {
  const classes = useStyles();

  const handleToggle = useCallback(
    event => {
      onChange({ ...value, [event.target.value]: event.target.checked });
    },
    [onChange, value]
  );

  return (
    <div className={clsx(classes.box, className)}>
      {networkIds.map(key => (
        <label key={key} className={classes.label}>
          <input
            type="checkbox"
            value={key}
            checked={value[key]}
            onChange={handleToggle}
            className={classes.checkbox}
          />
          <NetworkIcon network={key} width={24} height={24} className={classes.icon} />
        </label>
      ))}
    </div>
  );
});
