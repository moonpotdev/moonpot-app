import React, { forwardRef, useCallback, useState } from 'react';
import clsx from 'clsx';
import { Collapse, makeStyles, Typography } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import styles from './styles';
import { Translate } from '../Translate';
import { variantClass } from '../../helpers/utils';

const useStyles = makeStyles(styles);

export function Cards({ className, children, sameHeight = true, oneUp = false, ...rest }) {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.cards, className, {
        [classes.cardsOne]: oneUp,
        [classes.cardsNormalHeight]: sameHeight !== true,
      })}
      {...rest}
    >
      <div className={classes.cardsInner}>{children}</div>
    </div>
  );
}

export const Card = forwardRef(function (
  { variant = 'tealLight', className, children, ...rest },
  ref
) {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.card, variantClass(classes, 'variant', variant), className)}
      ref={ref}
      {...rest}
    >
      {children}
    </div>
  );
});

export function CardTitle({ className, children, ...rest }) {
  const classes = useStyles();

  return (
    <Typography variant="h2" className={clsx(classes.title, className)} {...rest}>
      {children}
    </Typography>
  );
}

export function CardAccordionGroup({ className, children }) {
  const classes = useStyles();

  return <div className={clsx(classes.accordionGroup, className)}>{children}</div>;
}

export function CardAccordionItem({
  titleKey,
  children,
  className,
  onChange,
  collapsable = true,
  startOpen = false,
}) {
  const classes = useStyles();
  const [isOpen, setOpen] = useState(startOpen);
  const toggleOpen = useCallback(() => {
    setOpen(!isOpen);

    if (onChange) {
      onChange(!isOpen);
    }
  }, [setOpen, isOpen, onChange]);
  const toggleIcon = isOpen ? <ExpandLess /> : <ExpandMore />;

  return (
    <div className={clsx(classes.accordionItem, className)}>
      <button
        className={clsx(classes.accordionItemTitle, { [classes.accordionItemToggle]: collapsable })}
        onClick={collapsable ? toggleOpen : null}
      >
        <Translate i18nKey={titleKey} />
        {collapsable ? toggleIcon : null}
      </button>
      <Collapse in={!collapsable || isOpen}>
        <div className={classes.accordionItemInner}>{children}</div>
      </Collapse>
    </div>
  );
}
