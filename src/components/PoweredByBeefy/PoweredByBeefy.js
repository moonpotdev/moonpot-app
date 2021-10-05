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
      <div className={classes.poweredByItem}>
        <Translate i18nKey="poweredBy" />
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
      <div className={classes.poweredByItem}>
        <Translate i18nKey="auditedBy" />
      </div>
      <div className={classes.poweredByItem}>
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
