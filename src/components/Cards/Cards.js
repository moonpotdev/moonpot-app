import React, { useCallback, useState } from 'react';
import { useStyles } from './styles';
import clsx from 'clsx';
import { Collapse, Typography } from '@material-ui/core';
import { Trans } from 'react-i18next';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

function variantClass(classes, prefix, variant) {
  const key = prefix + variant[0].toUpperCase() + variant.substr(1);
  return key in classes ? classes[key] : false;
}

export function Cards({ className, children, ...rest }) {
  const classes = useStyles();

  return <div className={clsx(classes.cards, className)} {...rest}>{children}</div>;
}

export function Card({ variant = 'tealLight', className, children, ...rest }) {
  const classes = useStyles();

  return <div
    className={clsx(classes.card, variantClass(classes, 'variant', variant), className)} {...rest}>{children}</div>;
}

export function CardTitle({ className, children, ...rest }) {
  const classes = useStyles();

  return <Typography variant="h2" className={clsx(classes.title, className)} {...rest}>{children}</Typography>;
}

export function CardAccordionGroup({ className, children }) {
  const classes = useStyles();

  return <div className={clsx(classes.accordionGroup, className)}>
    {children}
  </div>;
}

export function CardAccordionItem({ titleKey, children, className, onChange, startOpen = false }) {
  const classes = useStyles();
  const [isOpen, setOpen] = useState(startOpen);
  const toggleOpen = useCallback(() => {
    setOpen(!isOpen);

    if (onChange) {
      onChange(!isOpen);
    }
  }, [setOpen, isOpen, onChange]);

  return <div className={clsx(classes.accordionItem, className)}>
    <button className={classes.accordionItemToggle} onClick={toggleOpen}>
      <Trans i18nKey={titleKey} />{isOpen ? (<ExpandLess />) : (<ExpandMore />)}
    </button>
    <Collapse in={isOpen}>
      <div className={classes.accordionItemInner}>
        {children}
      </div>
    </Collapse>
  </div>;
}