import React from 'react';
import { useTranslation } from 'react-i18next';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import styles from './styles';
import { Tooltip } from '@material-ui/core';

const useStyles = makeStyles(styles);

export function TooltipWithIcon(i18nkey) {
  const { t } = useTranslation();
  const classes = useStyles();
  const src = require('../../images/tooltip/tooltipicon.svg').default;

  const LightTooltip = withStyles(theme => ({
    tooltip: {
      backgroundColor: '#373737',
      fontSize: '15px',
      fontWeight: '300',
      padding: '16px',
      borderRadius: '10px',
    },
    arrow: {
      color: '#373737',
    },
  }))(Tooltip);

  return (
    <div>
      <LightTooltip disableFocusListener arrow title={t(i18nkey.i18nkey)} placement="top">
        <img className={classes.icon} src={src} />
      </LightTooltip>
    </div>
  );
}
