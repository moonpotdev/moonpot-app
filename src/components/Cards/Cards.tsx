import React, { Component, forwardRef, PropsWithChildren, useCallback, useState } from 'react';
import clsx from 'clsx';
import { Collapse, Grid, GridJustification, makeStyles, Typography } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import styles from './styles';
import { Translate } from '../Translate';
import { variantClass } from '../../helpers/utils';

const useStyles = makeStyles(styles);

export type CardsProps = PropsWithChildren<{
  className?: string;
  sameHeight?: boolean;
  justifyContent?: GridJustification;
}>;
export function Cards({
  className,
  children,
  sameHeight = true,
  justifyContent = 'center',
  ...rest
}: CardsProps) {
  const classes = useStyles();

  return (
    <Grid
      container
      className={classes.cardGrid}
      justifyContent={justifyContent || 'center'}
      {...rest}
    >
      {children}
    </Grid>
  );
}

export type CardProps = PropsWithChildren<{
  variant: string;
  className?: string;
  oneColumn?: boolean;
}>;
export const Card = forwardRef<HTMLDivElement, CardProps>(function (
  { variant = 'tealLight', className, children, oneColumn = false, ...rest },
  ref
) {
  const classes = useStyles();

  return (
    <Grid
      item
      lg={4}
      md={6}
      sm={6}
      xs={12}
      className={oneColumn ? classes.cardGridInnerCentered : classes.cardGridInner}
    >
      <div
        className={clsx(classes.card, variantClass(classes, 'variant', variant), className)}
        ref={ref}
        {...rest}
      >
        {children}
      </div>
    </Grid>
  );
});

export type CardTitleProps = PropsWithChildren<{
  className?: string;
}>;
export function CardTitle({ className, children, ...rest }: CardTitleProps) {
  const classes = useStyles();

  return (
    <Typography variant="h2" className={clsx(classes.title, className)} {...rest}>
      {children}
    </Typography>
  );
}

export type CardAccordionGroupProps = PropsWithChildren<{
  className?: string;
}>;
export function CardAccordionGroup({ className, children }: CardAccordionGroupProps) {
  const classes = useStyles();

  return <div className={clsx(classes.accordionGroup, className)}>{children}</div>;
}

export type CardAccordionItemProps = PropsWithChildren<{
  titleKey: string;
  className?: string;
  onChange?: any;
  collapsable?: boolean;
  startOpen?: boolean;
  tooltip?: Component;
}>;
export function CardAccordionItem({
  titleKey,
  children,
  className,
  onChange,
  collapsable = true,
  startOpen = false,
  tooltip,
}: CardAccordionItemProps) {
  const classes = useStyles();
  const [isOpen, setOpen] = useState(startOpen);
  const toggleOpen = useCallback(() => {
    setOpen(!isOpen);

    if (onChange) {
      onChange(!isOpen);
    }
  }, [setOpen, isOpen, onChange]);
  const toggleIcon = isOpen ? (
    <ExpandLess style={{ position: 'absolute', right: '0' }} />
  ) : (
    <ExpandMore style={{ position: 'absolute', right: '0' }} />
  );

  return (
    <div className={clsx(classes.accordionItem, className)}>
      <button
        className={clsx(classes.accordionItemTitle, { [classes.accordionItemToggle]: collapsable })}
        onClick={collapsable ? toggleOpen : undefined}
        style={{ width: 'auto' }}
      >
        <Translate i18nKey={titleKey} />
        {tooltip}
        {collapsable ? toggleIcon : null}
      </button>
      <Collapse in={!collapsable || isOpen}>
        <div className={classes.accordionItemInner}>{children}</div>
      </Collapse>
    </div>
  );
}
