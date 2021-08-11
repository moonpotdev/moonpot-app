import React, { useCallback, useState } from 'react';
import { HEADER_DESKTOP_WIDTH, styles } from './styles';
import { useTranslation } from 'react-i18next';
import { useHistory, useRouteMatch } from 'react-router';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import { Drawer, IconButton, makeStyles, useMediaQuery } from '@material-ui/core';
import WalletConnector from './components/WalletConnector';
import MoonpotDotCom from '../../images/moonpot-white-single-line.svg';
import clsx from 'clsx';

const useStyles = makeStyles(styles);

const links = [
  {
    label: 'buttons.moonpots',
    href: '/',
    match: { exact: true },
  },
  {
    label: 'buttons.myPots',
    href: '/my-moonpots',
  },
  {
    label: 'buttons.ido',
    href: '/ido',
  },
  {
    label: 'buttons.docs',
    href: 'https://docs.moonpot.com',
    external: true,
  },
];

function MenuLink({ external, href, label, match, onClick, ...rest }) {
  const { t } = useTranslation();
  const history = useHistory();
  const active = useRouteMatch({
    path: href,
    ...(match || {}),
  });

  const handleClick = useCallback(
    e => {
      if (!external) {
        e.preventDefault();
        history.push(href);
      }

      if (onClick) {
        onClick();
      }
    },
    [external, href, history, onClick]
  );

  const props = {
    href: href.substr(0, 1) === '/' ? '/#' + href : href,
  };

  if (external) {
    props.target = '_blank';
    props.rel = 'noreferrer';
  }

  return (
    <a {...rest} {...props} onClick={handleClick} data-active={active}>
      {t(label)}
    </a>
  );
}

function Sidebar() {
  const classes = useStyles();
  const [isOpen, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), [setOpen]);
  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  return (
    <>
      <IconButton
        className={classes.toggleSidebar}
        color="inherit"
        aria-label="Show Sidebar"
        onClick={handleOpen}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={handleClose}
        classes={{ paper: classes.sidebar }}
      >
        <div className={classes.sidebarTop}>
          <IconButton
            className={classes.toggleSidebar}
            color="inherit"
            aria-label="Hide Sidebar"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <nav className={classes.sidebarNav}>
          {links.map(link => (
            <MenuLink
              key={link.href}
              {...link}
              onClick={handleClose}
              className={classes.sidebarItem}
            />
          ))}
        </nav>
        <div className={classes.sidebarBottom}>
          <WalletConnector onConnect={handleClose} fullWidth={true} />
        </div>
      </Drawer>
    </>
  );
}

function Nav() {
  const classes = useStyles();

  return (
    <nav className={classes.nav}>
      {links.map(link => (
        <MenuLink key={link.href} {...link} className={classes.navItem} />
      ))}
    </nav>
  );
}

export function Header() {
  const classes = useStyles();
  const history = useHistory();
  const showSidebar = !useMediaQuery(`(min-width:${HEADER_DESKTOP_WIDTH}px)`);

  const handleHome = useCallback(
    e => {
      e.preventDefault();
      history.push('/');
    },
    [history]
  );

  return (
    <div className={classes.bar}>
      <div className={classes.barInner}>
        <div className={classes.barItem}>
          <a href="/" onClick={handleHome} className={classes.logoLink}>
            <img
              src={MoonpotDotCom}
              alt="Moonpot.com"
              className={classes.logo}
              width="157"
              height="36"
            />
          </a>
        </div>
        {showSidebar ? null : (
          <div className={clsx(classes.barItem, classes.pushRight)}>
            <Nav />
          </div>
        )}
        <div className={clsx(classes.barItem, { [classes.pushRight]: showSidebar })}>
          {showSidebar ? <Sidebar /> : <WalletConnector variant="small" />}
        </div>
      </div>
    </div>
  );
}
