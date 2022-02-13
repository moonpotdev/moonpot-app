import { Card, Cards } from '../Cards';
import { OpenInNew } from '@material-ui/icons';
import { makeStyles, Typography } from '@material-ui/core';
import styles from './styles';
import { Translate } from '../Translate';
import { memo } from 'react';

const useStyles = makeStyles(styles);

const MainPotLink = memo(function ({ children }) {
  return <a href="/#/main">{children}</a>;
});

const SidePotExplainer = memo(function () {
  const classes = useStyles();

  return (
    <Cards>
      <Card variant="purpleInfo" style={{ marginBottom: '24px' }} oneColumn={true}>
        <Typography className={classes.sidePotExplainer}>
          <Translate i18nKey="sidePotExplainer" components={{ MainPotLink: <MainPotLink /> }} />
        </Typography>
        <a
          className={classes.learnMore}
          href={`https://moonpot.com/alpha/launch/side-pots-are-ready-for-lift-off/`}
          rel="noreferrer"
          target="_blank"
        >
          <Translate i18nKey="learnMore" />
          <OpenInNew fontSize="inherit" />
        </a>
      </Card>
    </Cards>
  );
});

export default SidePotExplainer;
