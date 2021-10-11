import { Card } from '../../components/Cards/Cards';
import { OpenInNew } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core';
import styles from './styles';
import { Typography } from '@material-ui/core';
import { Trans } from 'react-i18next';

const useStyles = makeStyles(styles);

const SidePotExplainer = () => {
  const classes = useStyles();

  return (
    <Card variant="purpleInfo" style={{ marginBottom: '24px' }}>
      <Typography className={classes.sidePotExplainer}>
        <Trans i18nKey="sidePotExplainerA" />
        &nbsp;
        <span>
          <a href="/#/main">
            <Trans i18nKey="mainPot" />
          </a>
        </span>
        &nbsp;
        <Trans i18nKey="sidePotExplainerB" />
      </Typography>
      <a
        className={classes.learnMore}
        href={`https://moonpot.com/alpha/launch/side-pots-are-ready-for-lift-off/`}
        rel="noreferrer"
        target="_blank"
      >
        <Trans i18nKey="learnMore" />
        <OpenInNew fontSize="inherit" />
      </a>
    </Card>
  );
};

export default SidePotExplainer;
