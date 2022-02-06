import React, { memo, useMemo } from 'react';
import { CardAccordionGroup, CardAccordionItem } from '../../../../components/Cards';
import { Grid, makeStyles } from '@material-ui/core';
import { Pot as BasePot, PrizeSplit } from '../../../../components/Pot/Pot';
import { ZapPotDeposit } from '../../../../components/ZapPotDeposit/ZapPotDeposit';
import styles from './styles';
import { PotDeposit } from '../../../../components/PotDeposit';
import { PotWithdraw } from '../../../../components/PotWithdraw';
import { useBonusesEarned, usePot, useTokenBalance } from '../../../../helpers/hooks';
import { Translate } from '../../../../components/Translate';
import PotBonus from '../../../home/MyPots/components/Pot/PotBonus';
import { useSelector } from 'react-redux';
import { ZapPotWithdraw } from '../../../../components/PotWithdraw/ZapPotWithdraw';
import { TooltipWithIcon } from '../../../../components/Tooltip/tooltip';
import { WalletRequired } from '../../../../components/WalletRequired/WalletRequired';

const useStyles = makeStyles(styles);

const PrizeSplitInner = memo(function ({
  awardBalance,
  awardBalanceUsd,
  baseToken,
  sponsors,
  nfts,
  nftPrizeOnly,
  numberOfWinners,
}) {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item xs={3}>
        <Translate i18nKey="pot.prizeSplitWinner" values={{ count: numberOfWinners }} />
      </Grid>
      <Grid item xs={9} className={classes.prizeSplitValue}>
        <PrizeSplit
          baseToken={baseToken}
          awardBalance={awardBalance}
          awardBalanceUsd={awardBalanceUsd}
          sponsors={sponsors}
          numberOfWinners={numberOfWinners}
          nfts={nfts}
          nftPrizeOnly={nftPrizeOnly}
        />
      </Grid>
    </Grid>
  );
});

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
      <PotBonus item={pot} buttonVariant={handleButtonVariant(pot.vaultType)} />
    </CardAccordionItem>
  ) : null;
});

const WithdrawAccordionItem = memo(function ({ pot, onFairplayLearnMore }) {
  const address = useSelector(state => state.wallet.address);
  const depositBalance = useTokenBalance(pot.contractAddress + ':total', 18);
  const hasDeposit = address && depositBalance.gt(0);

  return hasDeposit ? (
    <CardAccordionItem titleKey="pot.withdraw">
      {pot.isZap ? (
        <ZapPotWithdraw
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
  } else if (vaultType === 'side') {
    return 'greySide';
  } else if (vaultType === 'nft') {
    return 'purpleNft';
  } else if (vaultType === 'xmas') {
    return 'purpleXmas';
  }

  // default/main
  return 'teal';
}

const Bottom = function ({ id, onFairplayLearnMore, variant }) {
  const pot = usePot(id);

  return (
    <CardAccordionGroup>
      <CardAccordionItem
        titleKey={pot.isPrizeOnly ? 'pot.prizeSplit' : 'pot.prizeSplitProjected'}
        tooltip={pot.isPrizeOnly ? null : <TooltipWithIcon i18nKey={'pot.prizeSplitToolTip'} />}
      >
        <PrizeSplitInner
          baseToken={pot.token}
          awardBalance={pot.projectedAwardBalance || pot.awardBalance}
          awardBalanceUsd={pot.projectedAwardBalanceUsd || pot.awardBalanceUsd}
          sponsors={pot.projectedSponsors || pot.sponsors}
          nftPrizeOnly={pot.nftPrizeOnly}
          nfts={pot.nfts}
          numberOfWinners={pot.numberOfWinners}
        />
      </CardAccordionItem>
      <WalletRequired network={pot.network}>
        <CardAccordionItem titleKey="pot.deposit" collapsable={false} startOpen={true}>
          {pot.status === 'active' ? (
            <>
              {pot.isZap ? (
                <ZapPotDeposit
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
          ) : null}
        </CardAccordionItem>
        <BonusAccordionItem pot={pot} />
        <WithdrawAccordionItem pot={pot} onFairplayLearnMore={onFairplayLearnMore} />
      </WalletRequired>
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
