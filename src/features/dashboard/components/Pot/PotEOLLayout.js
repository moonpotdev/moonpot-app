import React from 'react';
import { Divider, Grid, makeStyles } from '@material-ui/core';
import styles from '../../styles';
import { CardAccordionItem } from '../../../../components/Cards/Cards';
import PotBonus from './PotBonus';
import { PotWithdraw } from '../../../../components/PotWithdraw/PotWithdraw';
import { PotMigrate } from './PotMigrate';
import { PotWinners } from './PotComponents';

const useStyles = makeStyles(styles);

const EOLLayout = function ({ item, wallet, balance, prices }) {
  const classes = useStyles();

  return (
    <React.Fragment>
      {/*Pot with migration */}
      {item.migrationContractAddress ? (
        <React.Fragment>
          <PotMigrate item={item} wallet={wallet} balance={balance} />
          <Grid item xs={12}>
            <Divider className={classes.divider} />
          </Grid>
          <CardAccordionItem titleKey="pot.withdraw">
            <PotWithdraw id={item.id} onLearnMore={null} />
            <div style={{ height: '12px' }} />
          </CardAccordionItem>
        </React.Fragment>
      ) : (
        // ----------------
        // Standard eol pot
        // ----------------
        <React.Fragment>
          {/*Bonus*/}
          <CardAccordionItem titleKey="bonusEarnings">
            <PotBonus item={item} prices={prices} wallet={wallet} balance={balance} />
          </CardAccordionItem>
          {/*Withdraw*/}
          <CardAccordionItem titleKey="pot.withdraw">
            <PotWithdraw id={item.id} onLearnMore={null} />
            <div style={{ height: '12px' }} />
          </CardAccordionItem>
        </React.Fragment>
      )}
      {/*Winners*/}
      <CardAccordionItem titleKey="prizeWinners">
        <PotWinners item={item} />
      </CardAccordionItem>
    </React.Fragment>
  );
};

export default EOLLayout;
