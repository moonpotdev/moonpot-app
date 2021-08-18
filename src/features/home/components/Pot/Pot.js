import React, { memo, useMemo } from 'react';
import { CardAccordionGroup, CardAccordionItem } from '../../../../components/Cards';
import { Grid, makeStyles } from '@material-ui/core';
import { Trans } from 'react-i18next';
import { useSelector } from 'react-redux';
import { PrimaryButton } from '../../../../components/Buttons/PrimaryButton';
import { investmentOdds } from '../../../../helpers/utils';
import { BigNumber } from 'bignumber.js';
import { Pot as BasePot, PrizeSplit } from '../../../../components/Pot/Pot';
import { usePot } from '../../../../helpers/hooks';
import styles from './styles';

const useStyles = makeStyles(styles);

const Play = memo(function ({ id, token, rewardToken }) {
  const address = useSelector(state => state.walletReducer.address);
  const balance = useSelector(state => state.balanceReducer.tokens[rewardToken]?.balance);
  const hasStaked = address && balance;

  return (
    <PrimaryButton to={`/pot/${id}`} variant="teal" fullWidth={true}>
      <Trans i18nKey={hasStaked ? 'pot.playWithMore' : 'pot.playWith'} values={{ token }} />
    </PrimaryButton>
  );
});

const Odds = memo(function ({ tvlUsd, depositAmount, winners }) {
  const odds = useMemo(() => {
    return investmentOdds(tvlUsd, new BigNumber(depositAmount), winners);
  }, [tvlUsd, depositAmount, winners]);

  return (
    <Trans i18nKey="pot.oddsPerDeposit" values={{ odds: odds, deposit: '$' + depositAmount }} />
  );
});

const Bottom = function ({ id }) {
  const classes = useStyles();
  const pot = usePot(id);

  return (
    <>
      <CardAccordionGroup>
        <CardAccordionItem titleKey="pot.prizeSplit" collapsable={false}>
          <Grid container>
            <Grid item xs={3}>
              <Trans i18nKey="pot.prizeSplitWinner" values={{ count: pot.numberOfWinners }} />
            </Grid>
            <Grid item xs={9} className={classes.prizeSplitValue}>
              <PrizeSplit
                baseToken={pot.token}
                awardBalance={pot.awardBalance}
                awardBalanceUsd={pot.awardBalanceUsd}
                sponsors={pot.sponsors}
                numberOfWinners={pot.numberOfWinners}
              />
            </Grid>
          </Grid>
        </CardAccordionItem>
      </CardAccordionGroup>
      <div className={classes.rowPlay}>
        <Play id={pot.id} token={pot.token} rewardToken={pot.rewardToken} />
      </div>
      <div className={classes.rowOdds}>
        <Odds tvlUsd={pot.totalStakedUsd} depositAmount={1000} winners={pot.numberOfWinners} />
      </div>
    </>
  );
};

export const Pot = function ({ id }) {
  return <BasePot id={id} variant="tealLight" bottom={<Bottom id={id} />} />;
};
