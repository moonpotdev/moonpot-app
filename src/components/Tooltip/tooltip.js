import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Fade, Tooltip } from '@material-ui/core';
import { HelpOutline } from '@material-ui/icons';
import styles from './styles';

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
    '& p': {
      marginTop: '1em',
      marginBottom: 0,
      '&:first-child': {
        marginTop: 0,
      },
    },
  },
  arrow: {
    color: '#373737',
  },
}))(Tooltip);

export function TooltipWithIcon({ i18nKey, i18nValues = {} }) {
  const { t } = useTranslation();
  const classes = useStyles();

  const content = useMemo(() => {
    const text = t(i18nKey, { ...i18nValues, returnObjects: true });

    if (Array.isArray(text)) {
      return (
        <>
          {text.map(paragraph => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </>
      );
    }

    return text;
  }, [t, i18nKey, i18nValues]);

  return (
    <>
      <StyledTooltip
        arrow
        TransitionComponent={Fade}
        title={content}
        placement="top"
        enterTouchDelay={0}
        leaveTouchDelay={5000}
      >
        <HelpOutline fontSize="inherit" className={classes.icon} />
      </StyledTooltip>
    </>
  );
}
