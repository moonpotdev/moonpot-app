import React, { memo, useMemo } from 'react';
import { CardAccordionGroup, CardAccordionItem } from '../../../../components/Cards';
import { makeStyles } from '@material-ui/core';
import { Pot as BasePot, PrizeSplit } from '../../../../components/Pot/Pot';
import { ZapPotDeposit } from '../../../../components/ZapPotDeposit/ZapPotDeposit';
import styles from './styles';
import { PotDeposit } from '../../../../components/PotDeposit';
import { PotWithdraw } from '../../../../components/PotWithdraw';
import { useBonusesEarned, usePot, useTokenBalance } from '../../../../helpers/hooks';
import PotBonus from '../../../pots/MyPots/components/Pot/PotBonus';
import { useSelector } from 'react-redux';
import { ZapPotWithdraw } from '../../../../components/PotWithdraw/ZapPotWithdraw';
import { WalletRequired } from '../../../../components/WalletRequired/WalletRequired';
import { selectWalletAddress } from '../../../wallet/selectors';
import { DepositsPaused } from '../../../../components/DepositsPaused';

const useStyles = makeStyles(styles);

function handleButtonVariant(vaultType) {
  if (vaultType === 'main') {
    return 'teal';
  } else if (vaultType === 'community') {
    return 'blueCommunity';
  } else if (vaultType === 'side') {
    return 'greySide';
  }
}

const BonusAccordionItem = memo(function ({ pot }) {
  const bonuses = useBonusesEarned(pot.id);
  const hasEarned = useMemo(() => bonuses.find(bonus => bonus.earned > 0) !== undefined, [bonuses]);

  return hasEarned ? (
    <CardAccordionItem
      titleKey={pot.id === 'pots' ? 'pot.earnings' : 'pot.bonusEarnings'}
      startOpen={true}
    >
      <PotBonus pot={pot} buttonVariant={handleButtonVariant(pot.vaultType)} />
    </CardAccordionItem>
  ) : null;
});

const WithdrawAccordionItem = memo(function ({ pot, onFairplayLearnMore }) {
  const address = useSelector(selectWalletAddress);
  const depositBalance = useTokenBalance(pot.contractAddress + ':total', 18, pot.network);
  const hasDeposit = address && depositBalance.gt(0);

  return hasDeposit ? (
    <CardAccordionItem titleKey="pot.withdraw">
      {pot.hasZapOut ? (
        <ZapPotWithdraw id={pot.id} onLearnMore={onFairplayLearnMore} variant="teal" />
      ) : (
        <PotWithdraw id={pot.id} onLearnMore={onFairplayLearnMore} variant="teal" />
      )}
    </CardAccordionItem>
  ) : null;
});

const Bottom = function ({ id, onFairplayLearnMore, variant }) {
  const pot = usePot(id);
  const classes = useStyles();

  return (
    <CardAccordionGroup>
      <div className={classes.rowPrizeSplit}>
        <PrizeSplit
          baseToken={pot.token}
          awardBalance={pot.projectedAwardBalance || pot.awardBalance}
          awardBalanceUsd={pot.projectedAwardBalanceUsd || pot.awardBalanceUsd}
          sponsors={pot.projectedSponsors || pot.sponsors}
          numberOfWinners={pot.numberOfWinners}
          nfts={pot.nfts}
          nftPrizeOnly={pot.nftPrizeOnly}
        />
      </div>
      <CardAccordionItem titleKey="pot.deposit" collapsable={false} startOpen={true}>
        <WalletRequired network={pot.network}>
          {pot.status === 'active' ? (
            pot.depositsPaused ? (
              <DepositsPaused reason={pot.depositsPausedReason} variant="teal" />
            ) : (
              <>
                {pot.hasZapIn ? (
                  <ZapPotDeposit id={id} onLearnMore={onFairplayLearnMore} variant="teal" />
                ) : (
                  <PotDeposit id={id} onLearnMore={onFairplayLearnMore} variant="teal" />
                )}
              </>
            )
          ) : null}
        </WalletRequired>
      </CardAccordionItem>
      <BonusAccordionItem pot={pot} />
      <WithdrawAccordionItem pot={pot} onFairplayLearnMore={onFairplayLearnMore} />
    </CardAccordionGroup>
  );
};

export const Pot = function ({ id, onFairplayLearnMore, variant, oneColumn }) {
  return (
    <BasePot
      id={id}
      variant={variant}
      oneColumn={oneColumn}
      bottom={<Bottom id={id} onFairplayLearnMore={onFairplayLearnMore} variant={variant} />}
    />
  );
};
