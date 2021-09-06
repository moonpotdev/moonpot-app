import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { byDecimals } from '../../../../../helpers/format';
import BigNumber from 'bignumber.js';
import { Box, makeStyles } from '@material-ui/core';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import alertIcon from '../../../../../images/icons/alert.svg';
import { ButtonLink } from '../../../../../components/ButtonLink/ButtonLink';

const useStyles = makeStyles(styles);

function MigrationNotice({ pot }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const balanceString = useSelector(
    state => state.balanceReducer.tokens[pot.contractAddress]?.balance || '0'
  );
  const balanceTokenDecimals = pot.tokenDecimals;
  const balanceBigNumber = useMemo(
    () => byDecimals(new BigNumber(balanceString), balanceTokenDecimals),
    [balanceString, balanceTokenDecimals]
  );
  const hasBalance = !balanceBigNumber.isZero();

  if (hasBalance) {
    return (
      <Box className={classes.notice}>
        <div className={classes.text}>
          <img
            className={classes.alertIcon}
            src={alertIcon}
            width="20"
            height="20"
            alt=""
            aria-hidden={true}
            role="presentation"
          />
          <p>
            {t('migrationNoticeTitle', { asset: pot.token, pot: pot.name })}
            {pot.migrationLearnMoreUrl ? (
              <>
                {' '}
                <a
                  href={pot.migrationLearnMoreUrl}
                  className={classes.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('migrationNoticeLearnMore')}
                </a>
              </>
            ) : null}
          </p>
          {pot.migrationExplainer
            ? pot.migrationExplainer.map((text, index) => <p key={index}>{text}</p>)
            : null}
        </div>
        <ButtonLink to="/my-moonpots/eol" className={classes.button}>
          {t('migrationNoticeMove', { asset: pot.token })}
        </ButtonLink>
      </Box>
    );
  }

  return null;
}

export function MigrationNotices({ potType }) {
  const classes = useStyles();
  const currentNetwork = useSelector(state => state.walletReducer.network);
  const currentAddress = useSelector(state => state.walletReducer.address);
  const allPots = useSelector(state => state.vaultReducer.pools);

  const potsNeedingMigration = useMemo(() => {
    return Object.values(allPots).filter(
      pot =>
        pot.status === 'eol' &&
        (potType === 'all' || pot.vaultType === potType) &&
        pot.network === currentNetwork &&
        pot.migrationNeeded
    );
  }, [potType, allPots, currentNetwork]);
  const hasPotsNeedingMigration = potsNeedingMigration.length > 0;

  if (currentAddress && hasPotsNeedingMigration) {
    return (
      <div className={classes.notices}>
        {potsNeedingMigration.map(pot => (
          <MigrationNotice key={pot.id} pot={pot} />
        ))}
      </div>
    );
  }

  return null;
}
