import React, { memo } from 'react';
import { CardAccordionGroup, CardAccordionItem } from '../../../../components/Cards/Cards';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import { Trans } from 'react-i18next';
import { Pot as BasePot, PrizeSplit } from '../../../../components/Pot/Pot';
import styles from './styles';
import { PotDeposit } from '../../../../components/PotDeposit';
import { PotWithdraw } from '../../../../components/PotWithdraw';
import { Alert, AlertTitle } from '@material-ui/lab';
import { usePot } from '../../../../helpers/hooks';

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
            <Trans i18nKey="pot.prizeSplitWinner" values={{ count: count }} />
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
        <Trans i18nKey="deposit.eolNotice.title" />
      </AlertTitle>
      <Typography>
        <Trans i18nKey="deposit.eolNotice.message" values={{ token: pot.token }} />
      </Typography>
    </Alert>
  );
};

const Bottom = function ({ id, onFairplayLearnMore }) {
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
          <PotDeposit id={id} onLearnMore={onFairplayLearnMore} />
        ) : (
          <EolNotice id={id} />
        )}
      </div>
      <CardAccordionItem titleKey="pot.withdraw">
        <PotWithdraw id={id} onLearnMore={onFairplayLearnMore} />
      </CardAccordionItem>
    </>
  );
};

export const Pot = function ({ id, onFairplayLearnMore }) {
  return (
    <BasePot
      id={id}
      variant="tealDark"
      bottom={<Bottom id={id} onFairplayLearnMore={onFairplayLearnMore} />}
    />
  );
};
