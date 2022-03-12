import { memo } from 'react';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { variantClass } from '../../../../helpers/utils';
import ziggyDeposit from '../../../../images/ziggy/howDeposit.svg';
import ziggyEarn from '../../../../images/ziggy/howEarn.svg';
import ziggyWin from '../../../../images/ziggy/howWin.svg';
import clsx from 'clsx';
import styles from './styles';

const useStyles = makeStyles(styles);

const typeToZiggyUrl = {
  deposit: ziggyDeposit,
  earn: ziggyEarn,
  win: ziggyWin,
};

const Card = memo(function Card({ type }) {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={clsx(classes.card, variantClass(classes, 'card', type))}>
      <div>
        <img src={typeToZiggyUrl[type]} height="120" alt="" />
      </div>
      <h3 className={classes.cardTitle}>{t(`home.howToPlay.cards.${type}.title`)}</h3>
      <div className={classes.cardText}>
        {t(`home.howToPlay.cards.${type}.text`, { returnObjects: true }).map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>
    </div>
  );
});

export const HowToPlay = memo(function HowToPlay() {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.howToPlay}>
      <div className={classes.container}>
        <h2 className={classes.title}>{t('home.howToPlay.title')}</h2>
        <div className={classes.row}>
          <div className={classes.column}>
            <Card type="deposit" />
          </div>
          <div className={classes.column}>
            <Card type="earn" />
          </div>
          <div className={classes.column}>
            <Card type="win" />
          </div>
        </div>
      </div>
    </div>
  );
});
