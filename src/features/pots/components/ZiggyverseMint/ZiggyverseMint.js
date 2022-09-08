import React, { memo } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import styles from './styles';
import ziggyverseMint1x from '../../../../images/ziggy/ziggyverse-mint.png';
import ziggyverseMint2x from '../../../../images/ziggy/ziggyverse-mint@2x.png';
import ziggyverseMintMobile1x from '../../../../images/ziggy/ziggyverse-mint-mobile.png';
import ziggyverseMintMobile2x from '../../../../images/ziggy/ziggyverse-mint-mobile@2x.png';

const useStyles = makeStyles(styles);

const ZiggyverseMint = memo(function ZiggyverseMint() {
  const classes = useStyles();

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12} className={classes.holder}>
        <a
          href="https://www.rareboard.com/ziggy"
          target="_blank"
          rel="noopener"
          className={classes.link}
        >
          <picture>
            <source
              src={ziggyverseMintMobile1x}
              srcSet={`${ziggyverseMintMobile1x} 1x, ${ziggyverseMintMobile2x} 2x`}
              media="(max-width: 640px)"
              sizes="100vw"
            />
            <img
              src={ziggyverseMint1x}
              srcSet={`${ziggyverseMint1x} 1x, ${ziggyverseMint2x} 2x`}
              sizes="(min-width: 1240px) 1220px, 100vw"
              alt="The genesis Ziggy mint is now live!"
              className={classes.img}
            />
          </picture>
        </a>
      </Grid>
    </Grid>
  );
});

export default ZiggyverseMint;
