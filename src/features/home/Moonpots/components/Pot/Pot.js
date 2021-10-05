import React, { memo, useMemo } from 'react';
import { CardAccordionGroup, CardAccordionItem } from '../../../../../components/Cards';
import { Grid, makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { PrimaryButton } from '../../../../../components/Buttons/PrimaryButton';
import { investmentOdds } from '../../../../../helpers/utils';
import { Pot as BasePot, PrizeSplit } from '../../../../../components/Pot/Pot';
import { usePot, useTokenAddressPrice, useTranslatedToken } from '../../../../../helpers/hooks';
import { Translate } from '../../../../../components/Translate';
import { byDecimals } from '../../../../../helpers/format';
import { TooltipWithIcon } from '../../../../../components/Tooltip/tooltip';
import styles from './styles';

const useStyles = makeStyles(styles);

const Play = memo(function ({ id, token, contractAddress, variant }) {
  const address = useSelector(state => state.walletReducer.address);
  const balance = useSelector(
    state => state.balanceReducer.tokens[contractAddress + ':total']?.balance
  );
  const hasStaked = address && balance > 0;
  const translatedToken = useTranslatedToken(token);

  return (
    <PrimaryButton to={`/pot/${id}`} variant={variant} fullWidth={true}>
      <Translate
        i18nKey={hasStaked ? 'pot.playWithMore' : 'pot.playWith'}
        values={{ token: translatedToken }}
      />
    </PrimaryButton>
  );
});

const NewDepositOdds = memo(function ({
  tokenAddress,
  tokenDecimals,
  ticketTotalSupply,
  depositAmountUsd,
  winners,
}) {
  const tokenPrice = useTokenAddressPrice(tokenAddress);

  const odds = useMemo(() => {
    if (tokenPrice) {
      const depositAmountTickets = depositAmountUsd / tokenPrice / 2;

      return investmentOdds(
        byDecimals(ticketTotalSupply, tokenDecimals),
        winners,
        0,
        depositAmountTickets
      );
    }

    return 0;
  }, [ticketTotalSupply, depositAmountUsd, tokenPrice, winners, tokenDecimals]);

  return (
    <Translate
      i18nKey="pot.oddsPerDeposit"
      values={{ odds: odds, deposit: '$' + depositAmountUsd }}
    />
  );
});

function handleVariant(vaultType) {
  if (vaultType === 'community') {
    return 'blueCommunity';
  } else if (vaultType === 'lp') {
    return 'green';
  } else if (vaultType === 'stable') {
    return 'greenStable';
  }

  // default/main
  return 'teal';
}

const Bottom = function ({ id }) {
  const classes = useStyles();
  const pot = usePot(id);

  return (
    <>
      <CardAccordionGroup className={classes.rowPrizeSplit}>
        <CardAccordionItem
          titleKey="pot.prizeSplit"
          collapsable={false}
          tooltip={
            <TooltipWithIcon
              i18nKey={'pot.prizeSplitToolTip'}
              style={{ marginLeft: '0', marginRight: 'auto' }}
            />
          }
        >
          <Grid container>
            <Grid item xs={3}>
              <Translate i18nKey="pot.prizeSplitWinner" values={{ count: pot.numberOfWinners }} />
            </Grid>
            <Grid item xs={9} className={classes.prizeSplitValue}>
              <PrizeSplit
                baseToken={pot.token}
                awardBalance={pot.projectedAwardBalance || pot.awardBalance}
                awardBalanceUsd={pot.projectedAwardBalanceUsd || pot.awardBalanceUsd}
                sponsors={pot.projectedSponsors || pot.sponsors}
                numberOfWinners={pot.numberOfWinners}
              />
            </Grid>
          </Grid>
        </CardAccordionItem>
      </CardAccordionGroup>
      <div className={classes.rowPlay}>
        <Play
          id={pot.id}
          token={pot.token}
          contractAddress={pot.contractAddress}
          variant={handleVariant(pot.vaultType)}
        />
      </div>
      <div className={classes.rowOdds}>
        <NewDepositOdds
          tokenAddress={pot.tokenAddress}
          tokenDecimals={pot.tokenDecimals}
          ticketTotalSupply={pot.totalTickets}
          depositAmountUsd={1000}
          winners={pot.numberOfWinners}
        />
        <br />
        <Translate i18nKey="pot.noMinimumDeposit" />
      </div>
    </>
  );
};

export const Pot = function ({ id, variant }) {
  return <BasePot id={id} variant={variant} bottom={<Bottom id={id} />} />;
};
