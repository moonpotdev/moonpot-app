import { Container, Grid, Link, makeStyles, Typography } from '@material-ui/core';
import * as React from 'react';
import styles from './styles';
import StatButton from './components/StatButton';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useTotalPrizeValue } from '../../features/winners/apollo/total';

const useStyles = makeStyles(styles);

const Footer = ({ variant }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  //Holders Data
  const cadets = useSelector(state => state.holders.cadets || 0);
  const cadetsFormatted = cadets.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

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
  const { total } = useTotalPrizeValue();
  const totalFormatted = total.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

  return (
    <>
      <Container maxWidth="xl" className={variant === 'light' ? classes.light : ''}>
        <Grid container spacing={2} className={classes.footer}>
          <Grid item xs={12} className={classes.footerLinks}>
            <Link href={'https://docs.moonpot.com/'} target="_blank" rel="noopener">
              <Typography className={classes.textButton}>{t('header.docs')}</Typography>
            </Link>
            <Link href={'https://moonpot.com/alpha'} target="_blank" rel="noopener">
              <Typography className={classes.textButton}>{t('header.articles')}</Typography>
            </Link>
            <Link href={'https://vote.moonpot.com/#/'} target="_blank" rel="noopener">
              <Typography className={classes.textButton}>{t('header.vote')}</Typography>
            </Link>
            <Link href={'https://www.certik.com/projects/moonpot'} target="_blank" rel="noopener">
              <Typography className={classes.textButton}>{t('header.audit')}</Typography>
            </Link>
          </Grid>
          <Grid item xs={12} className={classes.footerStats}>
            <StatButton label={t('footer.cadets')} value={cadetsFormatted} />
            <StatButton label={t('footer.prizes')} value={'$' + totalFormatted} />
            <StatButton label={t('footer.tvl')} value={'$' + tvl} />
            <StatButton label={t('footer.buybacks')} value={'$' + buybacksInUsd} />
          </Grid>
          <Grid className={classes.footerIcons} item xs={12}>
            <Link href={'https://github.com/moonpotdev'} target="_blank" rel="noopener">
              <img
                alt="Github"
                src={require('../../images/footer/github.svg').default}
                className={classes.footerImage}
              />
            </Link>
            <Link href={'https://t.me/moonpotdotcom'} target="_blank" rel="noopener">
              <img
                alt="Telegram"
                src={require('../../images/footer/telegram.svg').default}
                className={classes.footerImage}
              />
            </Link>
            <Link href={'https://discord.gg/8YquFwfw3N'} target="_blank" rel="noopener">
              <img
                alt="Discord"
                src={require('../../images/footer/discord.svg').default}
                className={classes.footerImage}
              />
            </Link>
            <Link
              href={'https://www.youtube.com/channel/UCCwZh5FBKusmzmT5Q3Yisdg'}
              target="_blank"
              rel="noopener"
            >
              <img
                alt="Youtube"
                src={require('../../images/footer/youtube.svg').default}
                className={classes.footerImage}
              />
            </Link>
            <Link href={'https://twitter.com/moonpotdotcom'} target="_blank" rel="noopener">
              <img
                alt="Twitter"
                src={require('../../images/footer/twitter.svg').default}
                className={classes.footerImage}
              />
            </Link>
            <Link
              href={'https://www.facebook.com/Moonpot-111024264744176/'}
              target="_blank"
              rel="noopener"
            >
              <img
                alt="Facebook"
                src={require('../../images/footer/facebook.svg').default}
                className={classes.footerImage}
              />
            </Link>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Footer;
