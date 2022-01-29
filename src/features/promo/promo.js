import * as React from 'react';
import { useCallback, useEffect } from 'react';
import styles from './styles';
import { Container, makeStyles, Typography } from '@material-ui/core';
import { Card } from '../../components/Cards/Cards';
import { PrimaryButton } from '../../components/Buttons/PrimaryButton';
import { RouteLoading } from '../../components/RouteLoading';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useParams } from 'react-router';
import { claimTokenId, fetchEligibleInfo, fetchPromoCodes } from './nftPromoCodes';
import { promosAll } from '../../config/promo';
import { WalletConnectButton } from '../../components/Buttons/WalletConnectButton';
import { isEmpty } from '../../helpers/utils';
import { Translate } from '../../components/Translate';
import { OpenInNew } from '@material-ui/icons';

const useStyles = makeStyles(styles);

const Promo = () => {
  const { name } = useParams();
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const address = useSelector(state => state.wallet.address);
  const promo = promosAll.find(p => p.name === name);
  const data = useSelector(state => state.promo);

  useEffect(() => {
    if (!promo || !address) return;
    dispatch(fetchEligibleInfo(promo.id));
  }, [dispatch, promo, address]);

  const handleClaim = useCallback(async () => {
    if (!promo || !address) return;
    dispatch(claimTokenId(promo.id, data.tokenIds[0]));
  }, [dispatch, promo, data, address]);

  const handleReveal = useCallback(async () => {
    if (!promo || !address) return;
    dispatch(fetchPromoCodes(promo));
  }, [dispatch, promo, address]);

  if (!promo) {
    return <Redirect to="/" />;
  }

  return (
    <React.Fragment>
      <Container maxWidth="xs">
        <Typography className={classes.mainTitle}>{promo.desc}</Typography>
        {!address ? (
          <WalletConnectButton variant="purple" fullWidth={true} />
        ) : data.pending ? (
          <RouteLoading />
        ) : (
          <>
            {data.tokenIds.length > 0 ? (
              <>
                <Typography className={classes.title}>
                  <Translate i18nKey="promo.canClaim" values={{ count: data.tokenIds.length }} />
                </Typography>
                <PrimaryButton
                  variant="purple"
                  fullWidth={true}
                  onClick={handleClaim}
                  style={{ marginBottom: '16px' }}
                >
                  {t('promo.claim')}
                </PrimaryButton>
              </>
            ) : (
              ''
            )}

            {!isEmpty(data.promoCodes) ? (
              <>
                <Typography className={classes.title}>{t('promo.myPromocodes')}</Typography>
                {data.promoCodes?.map((code, i) => (
                  <Card variant="purpleDark" style={{ marginTop: '10px' }} key={i}>
                    <Typography className={classes.title}>{code}</Typography>
                  </Card>
                ))}

                <p style={{ textAlign: 'center' }}>
                  <a href={promo.link} rel="noreferrer" target="_blank" className={classes.link}>
                    <Translate i18nKey={promo.linkTextKey} />
                    <OpenInNew fontSize="inherit" />
                  </a>
                </p>
              </>
            ) : (
              ''
            )}

            {isEmpty(data.promoCodes) && !isEmpty(data.codeIds) ? (
              <>
                <Typography className={classes.title}>
                  <Translate i18nKey="promo.claimed" values={{ count: data.codeIds.length }} />
                </Typography>
                <PrimaryButton
                  variant="purple"
                  fullWidth={true}
                  onClick={handleReveal}
                  style={{ marginBottom: '16px' }}
                >
                  {t('Reveal')}
                </PrimaryButton>
              </>
            ) : (
              ''
            )}

            {isEmpty(data.tokenIds) && isEmpty(data.codeIds) ? (
              <Typography className={classes.title}>{t('promo.noNfts')}</Typography>
            ) : (
              ''
            )}
          </>
        )}
      </Container>
    </React.Fragment>
  );
};
export default Promo;
