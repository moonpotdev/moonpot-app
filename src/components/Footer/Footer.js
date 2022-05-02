import { makeStyles } from '@material-ui/core';
import * as React from 'react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ReactComponent as IconGithub } from '../../images/socials/github.svg';
import { ReactComponent as IconTelegram } from '../../images/socials/telegram.svg';
import { ReactComponent as IconDiscord } from '../../images/socials/discord.svg';
import { ReactComponent as IconTwitter } from '../../images/socials/twitter.svg';
import { ReactComponent as IconYoutube } from '../../images/socials/youtube.svg';
import { ReactComponent as IconFacebook } from '../../images/socials/facebook.svg';
import styles from './styles';
import clsx from 'clsx';
import { useTotalPrizeValue } from '../../features/winners/hooks';

const useStyles = makeStyles(styles);

const navLinks = [
  {
    title: 'header.docs',
    path: 'https://docs.moonpot.com/',
  },
  {
    title: 'header.articles',
    path: 'https://www.moonpot.com/alpha',
  },
  {
    title: 'header.vote',
    path: 'https://vote.moonpot.com/',
  },
  {
    title: 'header.audit',
    path: 'https://www.certik.com/projects/moonpot',
  },
];

const socialLinks = [
  {
    title: 'GitHub',
    path: 'https://github.com/moonpotdev',
    Icon: IconGithub,
  },
  {
    title: 'Telegram',
    path: 'https://t.me/moonpotdotcom',
    Icon: IconTelegram,
  },
  {
    title: 'Discord',
    path: 'https://discord.gg/8YquFwfw3N',
    Icon: IconDiscord,
  },
  {
    title: 'YouTube',
    path: 'https://www.youtube.com/channel/UCCwZh5FBKusmzmT5Q3Yisdg',
    Icon: IconYoutube,
  },
  {
    title: 'Twitter',
    path: 'https://twitter.com/moonpotdotcom',
    Icon: IconTwitter,
  },
  {
    title: 'Facebook',
    path: 'https://www.facebook.com/Moonpot-111024264744176/',
    Icon: IconFacebook,
  },
];

// This wraps the top half of the page so that on short pages, the footer is pushed to the bottom
export const WrappedFooter = memo(function WrappedFooter({ children }) {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className={classes.wrapperTop}>{children}</div>
      <Footer />
    </div>
  );
});

// Stats are more likely to need a re-render
const FooterStats = memo(function FooterStats() {
  const { t } = useTranslation();
  const classes = useStyles();

  //Holders Data
  // const cadets = useSelector(state => state.holders.cadets || 0);
  // const cadetsFormatted = cadets.toLocaleString(undefined, {
  //   maximumFractionDigits: 0,
  // });

  //Buybacks Data
  const buybacksInPots = useSelector(state => state.buybacks.allTimeBuyback || 0);
  const potsPrice = useSelector(state => state.prices.prices['POTS'] || 0);
  const buybacksInUsd = (buybacksInPots * potsPrice).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

  //TVL Data
  const tvl = useSelector(state => state.vault.totalTvl || 0).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

  //Total Prize Data
  const total = useTotalPrizeValue();
  const totalFormatted = total.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

  const stats = useMemo(() => {
    return [
      // { label: t('footer.cadets'), value: cadetsFormatted },
      { label: t('footer.prizes'), value: '$' + totalFormatted },
      { label: t('footer.tvl'), value: '$' + tvl },
      { label: t('footer.buybacks'), value: '$' + buybacksInUsd },
    ];
  }, [t, /*cadetsFormatted,*/ totalFormatted, tvl, buybacksInUsd]);

  return (
    <ul className={clsx(classes.stats)}>
      {stats.map(({ label, value }) => (
        <li key={label} className={classes.statsItem}>
          <div className={classes.stat}>
            <div className={classes.statLabel}>{label}</div>
            <div className={classes.statValue}>{value}</div>
          </div>
        </li>
      ))}
    </ul>
  );
});

const Footer = memo(function Footer() {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.footer}>
      <ul className={classes.nav}>
        {navLinks.map(({ title, path }) => (
          <li key={path} className={classes.navItem}>
            <a href={path} target="_blank" rel="noopener" className={classes.navLink}>
              {t(title)}
            </a>
          </li>
        ))}
      </ul>
      <FooterStats />
      <ul className={clsx(classes.nav, classes.socials)}>
        {socialLinks.map(({ title, path, Icon }) => (
          <li key={path} className={classes.navItem}>
            <a
              href={path}
              target="_blank"
              rel="noopener"
              className={clsx(classes.navLink, classes.navLinkIcon)}
              title={t(title)}
            >
              <Icon />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
});
