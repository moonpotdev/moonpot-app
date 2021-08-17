import React from 'react';
import { Box, Link, makeStyles } from '@material-ui/core';
import { Trans } from 'react-i18next';
import BeefyCow from '../../images/beefy.svg';
import styles from './styles';
import clsx from 'clsx';

const useStyles = makeStyles(styles);

export function PoweredByBeefy({ className }) {
  const classes = useStyles();

  return (
    <Box className={clsx(classes.poweredBy, className)}>
      <div className={classes.poweredByItem}>
        <Trans i18nKey="poweredBy" />
      </div>
      <div className={classes.poweredByItem}>
        <Link
          href={'https://www.beefy.finance/'}
          target="_blank"
          rel="noreferrer"
          className={classes.beefyLink}
        >
          Beefy.Finance
        </Link>
      </div>
      <div className={classes.poweredByItem}>
        <img
          alt=""
          aria-hidden={true}
          src={BeefyCow}
          width={20}
          height={15.2}
          className={classes.beefyLogo}
        />
      </div>
    </Box>
  );
}
