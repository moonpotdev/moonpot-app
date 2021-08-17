import React, { useCallback, useState } from 'react';
import { HEADER_FULL_LOGO_WIDTH, HEADER_FULL_NAV_WIDTH, styles } from './styles';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useRouteMatch } from 'react-router';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import { Drawer, IconButton, makeStyles, useMediaQuery } from '@material-ui/core';
import WalletConnector from './components/WalletConnector';
import MoonpotDotCom from '../../images/moonpot-white-single-line.svg';
import Moonpot from '../../images/moonpot-notext.svg';
import Pots from '../../images/tokens/pots.svg';
import clsx from 'clsx';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import { useDispatch, useSelector } from 'react-redux';
import reduxActions from '../../features/redux/actions';
import CustomDropdown from '../customDropdown';

const useStyles = makeStyles(styles);

const links = [
  {
    label: 'header.moonpots',
    href: '/',
    match: { exact: true },
  },
  {
    label: 'header.myPots',
    href: '/my-moonpots',
  },
  {
    label: 'header.winners',
    href: '/winners',
  },
  {
    label: 'header.docs',
    href: 'https://docs.moonpot.com',
    external: true,
  },
  // {
  //   label: 'header.vote',
  //   href: '#',
  // },
];

const buyPotsUrl = 'https://app.1inch.io/#/56/classic/swap/BUSD/POTS';

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

function LanguageSelector({ css }) {
  const walletReducer = useSelector(state => state.walletReducer);
  const { i18n } = useTranslation();
  const dispatch = useDispatch();

  const handleLanguageSwitch = value => {
    i18n.changeLanguage(value).then(() => dispatch(reduxActions.wallet.setLanguage(value)));
  };

  return (
    <CustomDropdown
      list={{ en: 'English', zh: '中文' }}
      selected={walletReducer.language}
      handler={e => {
        handleLanguageSwitch(e.target.value);
      }}
      css={css}
    />
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
          <LanguageSelector css={{ marginTop: 32 }} />
        </nav>
        <div className={classes.sidebarBottom}>
          <div className={classes.sidebarPotsPrice}>
            <img
              src={Pots}
              width={36}
              height={36}
              aria-hidden={true}
              alt=""
              className={classes.sidebarPotsLogo}
            />
            <div className={classes.sidebarPotsText}>
              <div className={classes.sidebarPotsLabel}>
                <Trans i18nKey="header.potsPrice" />
              </div>
              <div className={classes.sidebarPotsValue}>
                <PotsPrice />
              </div>
            </div>
          </div>
          <PrimaryButton
            variant="purple"
            className={clsx(classes.buyButton, classes.sidebarBuyButton)}
            href={buyPotsUrl}
            target="_blank"
            rel="noreferrer"
          >
            <Trans i18nKey="header.buyPots" />
          </PrimaryButton>
        </div>
      </Drawer>
    </>
  );
}

function PotsPrice() {
  const price = useSelector(state => state.pricesReducer.prices['POTS'] || 0);
  return (
    '$' +
    price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

function Nav() {
  const classes = useStyles();

  return (
    <nav className={classes.nav}>
      {links.map(link => (
        <MenuLink key={link.href} {...link} className={classes.navItem} />
      ))}
      <LanguageSelector css={{ marginLeft: 24 }} />
    </nav>
  );
}

function NavbarPotsPrice() {
  const classes = useStyles();

  return (
    <div className={classes.navbarPotsPrice}>
      <img
        src={Pots}
        width={24}
        height={24}
        aria-hidden={true}
        alt=""
        className={classes.navbarPotsLogo}
      />
      <div className={classes.navbarPotsValue}>
        <PotsPrice />
      </div>
      <PrimaryButton
        variant="purple"
        className={clsx(classes.buyButton, classes.navbarBuyButton)}
        href={buyPotsUrl}
        target="_blank"
        rel="noreferrer"
      >
        <Trans i18nKey="header.buyPots" />
      </PrimaryButton>
    </div>
  );
}

export function Header() {
  const classes = useStyles();
  const history = useHistory();
  const showFullNav = useMediaQuery(`(min-width:${HEADER_FULL_NAV_WIDTH}px)`);
  const showFullLogo = useMediaQuery(`(min-width: ${HEADER_FULL_LOGO_WIDTH}px)`);

  const handleHome = useCallback(
    e => {
      e.preventDefault();
      history.push('/');
    },
    [history]
  );

  return (
    <div className={classes.bar}>
      <div className={classes.barSizer}>
        <div className={classes.barInner}>
          <div className={classes.barItem}>
            <a href="/" onClick={handleHome} className={classes.logoLink}>
              <img
                src={showFullLogo ? MoonpotDotCom : Moonpot}
                alt="Moonpot.com"
                className={classes.logo}
                width={showFullLogo ? (2700 / 620) * 36 : (569.052 / 605.212) * 36}
                height={36}
              />
            </a>
          </div>
          {showFullNav ? (
            <>
              <div className={clsx(classes.barItem, classes.pushRight)}>
                <Nav />
              </div>
              <div className={clsx(classes.barItem)}>
                <NavbarPotsPrice />
              </div>
            </>
          ) : null}
          <div className={clsx(classes.barItem, { [classes.pushRight]: !showFullNav })}>
            <WalletConnector variant="small" />
          </div>
          {showFullNav ? null : (
            <div className={clsx(classes.barItem)}>
              <Sidebar />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
