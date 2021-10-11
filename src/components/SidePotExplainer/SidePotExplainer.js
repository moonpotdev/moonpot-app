import { Card } from '../Cards';
import { OpenInNew } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core';
import styles from './styles';
import { Typography } from '@material-ui/core';
import { Translate } from '../Translate';
import { memo } from 'react';

const useStyles = makeStyles(styles);

const MainPotLink = memo(function ({ children }) {
  return <a href="/#/main">{children}</a>;
});

const SidePotExplainer = memo(function () {
  const classes = useStyles();

  return (
    <Card variant="purpleInfo" style={{ marginBottom: '24px' }}>
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
  );
});

export default SidePotExplainer;
