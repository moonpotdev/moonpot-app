import React, { memo } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import { Translate } from '../Translate';
import BeefyCow from '../../images/beefy.svg';
import styles from './styles';

const useStyles = makeStyles(styles);

const BeefyLink = memo(function ({ children }) {
  return (
    <a href="https://www.beefy.finance/" target="_blank" rel="noreferrer">
      {children}
    </a>
  );
});

const CertikLink = memo(function ({ children }) {
  return (
    <a href="https://www.certik.org/projects/moonpot" target="_blank" rel="noreferrer">
      {children}
    </a>
  );
});

export const PoweredByBeefy = memo(function PoweredByBeefy({ className }) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.poweredBy, className)}>
      <div>
        <Translate i18nKey="poweredByBeefy" components={{ BeefyLink: <BeefyLink /> }} />
      </div>
      <div className={classes.beefyLogoItem}>
        <img
          alt=""
          aria-hidden={true}
          src={BeefyCow}
          width={20}
          height={15.2}
          className={classes.beefyLogo}
        />
      </div>
      <div>
        <Translate i18nKey="auditedByCertik" components={{ CertikLink: <CertikLink /> }} />
      </div>
    </div>
  );
});
