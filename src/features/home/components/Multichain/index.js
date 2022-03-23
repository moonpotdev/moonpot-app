import { memo } from 'react';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { variantClass } from '../../../../helpers/utils';
import { ReactComponent as LogoBsc } from '../../../../images/networks/large/bsc.svg';
import { ReactComponent as LogoFantom } from '../../../../images/networks/large/fantom.svg';
import { ReactComponent as LogoPolygon } from '../../../../images/networks/large/polygon.svg';
import { ReactComponent as LogoAvax } from '../../../../images/networks/large/avax.svg';
import clsx from 'clsx';
import styles from './styles';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(styles);

const networkToLogo = {
  bsc: LogoBsc,
  fantom: LogoFantom,
  polygon: LogoPolygon,
  avax: LogoAvax,
};

const networkToName = {
  bsc: 'BNB Chain',
  fantom: 'Fantom',
  polygon: 'Polygon',
  avax: 'Avalanche',
};

const Card = memo(function Card({ chain, active = true }) {
  const classes = useStyles();
  const Component = active ? Link : 'div';
  const Logo = networkToLogo[chain];

  return (
    <Component to={active ? `/moonpots/${chain}` : undefined} className={classes.card}>
      <Logo
        aria-label={networkToName[chain]}
        role="img"
        className={clsx(
          classes.chain,
          variantClass(classes, 'chain', chain),
          variantClass(classes, 'chain', active ? 'active' : 'inactive')
        )}
      />
    </Component>
  );
});

export const Multichain = memo(function Multichain() {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.multichain}>
      <div className={classes.container}>
        <h2 className={classes.title}>{t('home.multichain.title')}</h2>
        <div className={classes.row}>
          <div className={classes.column}>
            <Card chain="bsc" active={true} />
          </div>
          <div className={classes.column}>
            <Card chain="fantom" active={true} />
          </div>
          <div className={classes.column}>
            <Card chain="polygon" active={false} />
          </div>
          <div className={classes.column}>
            <Card chain="avax" active={false} />
          </div>
        </div>
      </div>
    </div>
  );
});
