import React, { memo } from 'react';
import { CardAccordionGroup, CardAccordionItem } from '../../../../components/Cards/Cards';
import { Grid, makeStyles, Typography } from '@material-ui/core';

import { Pot as BasePot, PrizeSplit } from '../../../../components/Pot/Pot';
import styles from './styles';
import { PotDeposit } from '../../../../components/PotDeposit';
import { PotWithdraw } from '../../../../components/PotWithdraw';
import { Alert, AlertTitle } from '@material-ui/lab';
import { usePot } from '../../../../helpers/hooks';
import { Translate } from '../../../../components/Translate';

const useStyles = makeStyles(styles);

const PrizeSplitAccordion = memo(function ({
  awardBalance,
  awardBalanceUsd,
  baseToken,
  count,
  sponsors,
}) {
  const classes = useStyles();

  return (
    <CardAccordionGroup>
      <CardAccordionItem titleKey="pot.prizeSplit">
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
      </CardAccordionItem>
    </CardAccordionGroup>
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

const Bottom = function ({ id, onFairplayLearnMore, variant }) {
  const classes = useStyles();
  const pot = usePot(id);

  return (
    <>
      <PrizeSplitAccordion
        count={pot.numberOfWinners}
        baseToken={pot.token}
        awardBalance={pot.awardBalance}
        awardBalanceUsd={pot.awardBalanceUsd}
        sponsors={pot.sponsors}
      />
      <div className={classes.depositHolder}>
        {pot.status === 'active' ? (
          <PotDeposit
            id={id}
            onLearnMore={onFairplayLearnMore}
            variant={pot.vaultType === 'main' ? 'teal' : 'purpleAlt'}
          />
        ) : (
          <EolNotice id={id} />
        )}
      </div>
      <CardAccordionItem titleKey="pot.withdraw">
        <PotWithdraw
          id={id}
          onLearnMore={onFairplayLearnMore}
          variant={pot.vaultType === 'main' ? 'teal' : 'purpleAlt'}
        />
      </CardAccordionItem>
    </>
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
