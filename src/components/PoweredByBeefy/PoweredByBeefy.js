import React from 'react';
import { Box, Link, makeStyles } from '@material-ui/core';

import BeefyCow from '../../images/beefy.svg';
import styles from './styles';
import clsx from 'clsx';
import { Translate } from '../Translate';

const useStyles = makeStyles(styles);

export function PoweredByBeefy({ className }) {
  const classes = useStyles();

  return (
    <Box className={clsx(classes.poweredBy, className)}>
      <div>
        <Translate i18nKey="poweredBy" />{' '}
        <Link
          href={'https://www.beefy.finance/'}
          target="_blank"
          rel="noreferrer"
          className={classes.beefyLink}
        >
          Beefy
        </Link>
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
        <Translate i18nKey="auditedBy" />{' '}
        <Link
          href={'https://www.certik.org/projects/moonpot'}
          target="_blank"
          rel="noreferrer"
          className={classes.beefyLink}
        >
          Certik
        </Link>
      </div>
    </Box>
  );
}
