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

  //Buybacks Data
  const buybacks = useSelector(state => state.buybacksReducer.buybacks || []);
  console.log(buybacks);

  //TVL Data
  const tvl = useSelector(state => state.vaultReducer.totalTvl || 0).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

  //Total Prize Data
  const { total } = useTotalPrizeValue();
  const totalFormatted = total.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

  return (
    <React.Fragment>
      <Container maxWidth="xl" className={variant === 'light' ? classes.light : ''}>
        <Grid container spacing={2} className={classes.footer}>
          <Grid item xs={12} className={classes.footerLinks}>
            <Link href={'https://docs.moonpot.com/'}>
              <Typography className={classes.textButton}>{t('header.docs')}</Typography>
            </Link>
            <Link href={'https://moonpot.com/alpha'}>
              <Typography className={classes.textButton}>{t('header.articles')}</Typography>
            </Link>
            <Link href={'https://vote.moonpot.com/#/'}>
              <Typography className={classes.textButton}>{t('header.vote')}</Typography>
            </Link>
            <Link>
              <Typography className={classes.textButton}>{t('header.audit')}</Typography>
            </Link>
          </Grid>
          <Grid item xs={12} className={classes.footerStats}>
            <StatButton label={'HOLDERS'} value={'25.6K'} />
            <StatButton label={'PRIZES'} value={'$' + totalFormatted} />
            <StatButton label={'TVL'} value={'$' + tvl} />
            <StatButton label={'BUYBACK'} value={'$34K'} />
          </Grid>
          <Grid className={classes.footerIcons} item xs={12}>
            <Link href={'https://github.com/moonpotdev'}>
              <img
                alt="Github"
                src={require('../../images/footer/github.svg').default}
                className={classes.footerImage}
              />
            </Link>
            <Link href={'https://t.me/moonpotdotcom'}>
              <img
                alt="Telegram"
                src={require('../../images/footer/telegram.svg').default}
                className={classes.footerImage}
              />
            </Link>
            <Link href={'https://discord.gg/8YquFwfw3N'}>
              <img
                alt="Discord"
                src={require('../../images/footer/discord.svg').default}
                className={classes.footerImage}
              />
            </Link>
            <Link href={'https://www.youtube.com/channel/UCCwZh5FBKusmzmT5Q3Yisdg'}>
              <img
                alt="Youtube"
                src={require('../../images/footer/youtube.svg').default}
                className={classes.footerImage}
              />
            </Link>
            <Link href={'https://twitter.com/moonpotdotcom'}>
              <img
                alt="Twitter"
                src={require('../../images/footer/twitter.svg').default}
                className={classes.footerImage}
              />
            </Link>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default Footer;
