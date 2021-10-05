import React, { memo, useMemo } from 'react';
import { CardAccordionGroup, CardAccordionItem } from '../../../../components/Cards';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import { LPPotDeposit } from '../../../../components/LPPotDeposit/LPPotDeposit';
import { Pot as BasePot, PrizeSplit } from '../../../../components/Pot/Pot';
import styles from './styles';
import { PotDeposit } from '../../../../components/PotDeposit';
import { PotWithdraw } from '../../../../components/PotWithdraw';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useBonusesEarned, usePot, useTokenBalance } from '../../../../helpers/hooks';
import { Translate } from '../../../../components/Translate';
import PotBonus from '../../../home/MyPots/components/Pot/PotBonus';
import { useSelector } from 'react-redux';
import { LPPotWithdraw } from '../../../../components/PotWithdraw/LPPotWithdraw';
import { TooltipWithIcon } from '../../../../components/Tooltip/tooltip';

const useStyles = makeStyles(styles);

const PrizeSplitInner = memo(function ({
  awardBalance,
  awardBalanceUsd,
  baseToken,
  count,
  sponsors,
}) {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item xs={3}>
        <Translate i18nKey="pot.prizeSplitWinner" values={{ count: count }} />
      </Grid>
      <Grid item xs={9} className={classes.prizeSplitValue}>
        <PrizeSplit
          baseToken={baseToken}
          awardBalance={awardBalance}
          awardBalanceUsd={awardBalanceUsd}
          sponsors={sponsors}
          numberOfWinners={count}
        />
      </Grid>
    </Grid>
  );
});

const EolNotice = function ({ id }) {
  const pot = usePot(id);

  const classes = useStyles();
  return (
    <Alert severity={'warning'} className={classes.migrationNotice}>
      <AlertTitle>
        <Translate i18nKey="deposit.eolNotice.title" />
      </AlertTitle>
      <Typography>
        <Translate i18nKey="deposit.eolNotice.message" values={{ token: pot.token }} />
      </Typography>
    </Alert>
  );
};

const BonusAccordionItem = memo(function ({ pot }) {
  const bonuses = useBonusesEarned(pot.id);
  const hasEarned = useMemo(() => bonuses.find(bonus => bonus.earned > 0) !== undefined, [bonuses]);

  return hasEarned ? (
    <CardAccordionItem
      titleKey={pot.id === 'pots' ? 'pot.earnings' : 'pot.bonusEarnings'}
      startOpen={true}
    >
      <PotBonus
        item={pot}
        buttonVariant={pot.vaultType === 'community' ? 'blueCommunity' : 'teal'}
      />
    </CardAccordionItem>
  ) : null;
});

const WithdrawAccordionItem = memo(function ({ pot, onFairplayLearnMore }) {
  const address = useSelector(state => state.walletReducer.address);
  const depositBalance = useTokenBalance(pot.contractAddress + ':total', 18);
  const hasDeposit = address && depositBalance.gt(0);

  return hasDeposit ? (
    <CardAccordionItem titleKey="pot.withdraw">
      {pot.vaultType === 'lp' || pot.vaultType === 'stable' ? (
        <LPPotWithdraw
          id={pot.id}
          onLearnMore={onFairplayLearnMore}
          variant={handleVariant(pot.vaultType)}
        />
      ) : (
        <PotWithdraw
          id={pot.id}
          onLearnMore={onFairplayLearnMore}
          variant={handleVariant(pot.vaultType)}
        />
      )}
    </CardAccordionItem>
  ) : null;
});

function handleVariant(vaultType) {
  if (vaultType === 'community') {
    return 'purpleAlt';
  } else if (vaultType === 'lp') {
    return 'green';
  } else if (vaultType === 'stable') {
    return 'greenStable';
  }

  // default/main
  return 'teal';
}

const Bottom = function ({ id, onFairplayLearnMore, variant }) {
  const pot = usePot(id);

  return (
    <CardAccordionGroup>
      <CardAccordionItem
        titleKey="pot.prizeSplit"
        tooltip={<TooltipWithIcon i18nKey={'pot.prizeSplitToolTip'} />}
      >
        <PrizeSplitInner
          count={pot.numberOfWinners}
          baseToken={pot.token}
          awardBalance={pot.projectedAwardBalance || pot.awardBalance}
          awardBalanceUsd={pot.projectedAwardBalanceUsd || pot.awardBalanceUsd}
          sponsors={pot.projectedSponsors || pot.sponsors}
        />
      </CardAccordionItem>
      <CardAccordionItem titleKey="pot.deposit" collapsable={false} startOpen={true}>
        {pot.status === 'active' ? (
          <>
            {pot.vaultType === 'lp' || pot.vaultType === 'stable' ? (
              <LPPotDeposit
                id={id}
                onLearnMore={onFairplayLearnMore}
                variant={handleVariant(pot.vaultType)}
              />
            ) : (
              <PotDeposit
                id={id}
                onLearnMore={onFairplayLearnMore}
                variant={handleVariant(pot.vaultType)}
              />
            )}
          </>
        ) : (
          <EolNotice id={id} />
        )}
      </CardAccordionItem>
      <BonusAccordionItem pot={pot} />
      <WithdrawAccordionItem pot={pot} onFairplayLearnMore={onFairplayLearnMore} />
    </CardAccordionGroup>
  );
};

export const Pot = function ({ id, onFairplayLearnMore, variant }) {
  return (
    <BasePot
      id={id}
      variant={variant}
      bottom={<Bottom id={id} onFairplayLearnMore={onFairplayLearnMore} variant={variant} />}
    />
  );
};
