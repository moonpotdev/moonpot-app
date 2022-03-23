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
import { tokensByNetworkAddress } from '../../../../../config/tokens';
import { selectWalletAddress } from '../../../../wallet/selectors';

const useStyles = makeStyles(styles);

const Play = memo(function ({ id, token, contractAddress, variant }) {
  const address = useSelector(selectWalletAddress);
  const balance = useSelector(state => state.balance.tokens[contractAddress + ':total']?.balance);
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
  ticketAddress,
  ticketTotalSupply,
  depositAmountUsd,
  winners,
  network = 'bsc',
}) {
  const ticketPrice = useTokenAddressPrice(ticketAddress, network);
  const ticket = tokensByNetworkAddress[network][ticketAddress.toLowerCase()];
  const stakedMultiplier = ticket.stakedMultiplier;
  const ticketDecimals = ticket.tokenDecimals;

  const odds = useMemo(() => {
    if (ticketPrice) {
      const depositAmountTickets = depositAmountUsd / ticketPrice / stakedMultiplier;

      return investmentOdds(
        byDecimals(ticketTotalSupply, ticketDecimals),
        winners,
        0,
        depositAmountTickets
      );
    }

    return 0;
  }, [ticketTotalSupply, depositAmountUsd, ticketPrice, winners, ticketDecimals, stakedMultiplier]);

  return (
    <Translate
      i18nKey="pot.oddsPerDeposit"
      values={{ odds: odds, deposit: '$' + depositAmountUsd }}
    />
  );
});

const Bottom = function ({ id }) {
  const classes = useStyles();
  const pot = usePot(id);

  return (
    <>
      <CardAccordionGroup className={classes.rowPrizeSplit}>
        <CardAccordionItem
          titleKey={pot.isPrizeOnly ? 'pot.prizeSplit' : 'pot.prizeSplitProjected'}
          tooltip={pot.isPrizeOnly ? null : <TooltipWithIcon i18nKey={'pot.prizeSplitToolTip'} />}
          collapsable={true}
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
                nfts={pot.nfts}
                nftPrizeOnly={pot.nftPrizeOnly}
              />
            </Grid>
          </Grid>
        </CardAccordionItem>
      </CardAccordionGroup>
      <div className={classes.rowPlay}>
        <Play id={pot.id} token={pot.token} contractAddress={pot.contractAddress} variant="teal" />
      </div>
      <div className={classes.rowOdds}>
        <NewDepositOdds
          ticketAddress={pot.rewardAddress}
          ticketTotalSupply={pot.totalTickets}
          depositAmountUsd={1000}
          winners={pot.numberOfWinners}
          network={pot.network}
        />
        <br />
        <Translate i18nKey="pot.noMinimumDeposit" />
      </div>
    </>
  );
};

export const Pot = function ({ id, variant }) {
  return <BasePot id={id} variant={variant} bottom={<Bottom id={id} />} simple={true} />;
};
