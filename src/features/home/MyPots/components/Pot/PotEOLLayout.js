import React from 'react';
import { Divider, Grid, makeStyles } from '@material-ui/core';
import styles from './styles';
import { CardAccordionGroup, CardAccordionItem } from '../../../../../components/Cards';
import PotBonus from './PotBonus';
import { PotWithdraw } from '../../../../../components/PotWithdraw';
import { PotMigrate } from './PotMigrate';

const useStyles = makeStyles(styles);

const EOLLayout = function ({ item, wallet, balance, prices }) {
  const classes = useStyles();

  return (
    <React.Fragment>
      {/*Pot with migration */}
      {item.migrationContractAddress ? (
        <>
          <PotMigrate item={item} wallet={wallet} balance={balance} />
          <Grid item xs={12}>
            <Divider className={classes.divider} />
          </Grid>
        </>
      ) : null}
      <CardAccordionGroup>
        {/*Bonus*/}
        {item.migrationContractAddress ? null : (
          <CardAccordionItem titleKey="pot.bonusEarnings">
            <PotBonus item={item} prices={prices} wallet={wallet} balance={balance} />
          </CardAccordionItem>
        )}
        {/*Withdraw*/}
        <CardAccordionItem titleKey="pot.withdraw">
          <PotWithdraw id={item.id} onLearnMore={null} variant="purple" />
        </CardAccordionItem>
      </CardAccordionGroup>
    </React.Fragment>
  );
};

export default EOLLayout;
