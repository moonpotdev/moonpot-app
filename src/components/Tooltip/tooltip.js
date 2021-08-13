import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import styles from './styles';
import { Fade, Tooltip } from '@material-ui/core';
import { HelpOutline } from '@material-ui/icons';

const useStyles = makeStyles(styles);

const StyledTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: '#373737',
    color: '#FFFFFF',
    fontSize: '15px',
    lineHeight: '24px',
    fontWeight: 'normal',
    padding: '16px',
    borderRadius: '10px',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  arrow: {
    color: '#373737',
  },
}))(Tooltip);

export function TooltipWithIcon({ i18nKey }) {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <>
      <StyledTooltip
        arrow
        TransitionComponent={Fade}
        title={t(i18nKey)}
        placement="top"
        enterTouchDelay={0}
        leaveTouchDelay={5000}
      >
        <HelpOutline fontSize="inherit" className={classes.icon} />
      </StyledTooltip>
    </>
  );
}
