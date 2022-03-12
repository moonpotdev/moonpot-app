import { memo } from 'react';
import { makeStyles } from '@material-ui/core';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '../../../../components/Buttons/PrimaryButton';
import { SecondaryButton } from '../../../../components/Buttons/SecondaryButton';
import { ReactComponent as IconDiscord } from '../../../../images/socials/discord.svg';

const useStyles = makeStyles(styles);

export const Hero = memo(function Hero() {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.hero}>
      <div className={classes.foreground}>
        <div className={classes.foregroundSizer}>
          <h1 className={classes.title}>{t('home.hero.title')}</h1>
          <div className={classes.text}>
            {t('home.hero.text', { returnObjects: true }).map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>
          <div className={classes.buttons}>
            <PrimaryButton to="/moonpots" variant="purple">
              {t('buttons.exploreMoonpots')}
            </PrimaryButton>
            <SecondaryButton
              to="https://discord.gg/8YquFwfw3N"
              target="_blank"
              rel="noopener"
              variant="purple"
            >
              <IconDiscord className={classes.buttonIcon} />
              {t('buttons.joinOurDiscord')}
            </SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  );
});
