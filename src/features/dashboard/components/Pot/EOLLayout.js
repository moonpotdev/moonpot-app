import React from 'react';
import { Divider, Grid, makeStyles } from '@material-ui/core';
import styles from '../../styles';
import { isEmpty } from '../../../../helpers/utils';
import { CardAccordionItem } from '../../../../components/Cards/Cards';
import PotBonus from './PotBonus';
import { PotWithdraw } from '../../../../components/PotWithdraw/PotWithdraw';
import { PotMigrate } from './PotMigrate';
import { PotWinners } from './PotComponents';

const useStyles = makeStyles(styles);

const EOLLayout = function ({ item, wallet, balance, prices }) {
  const classes = useStyles();

  const [steps, setSteps] = React.useState({
    modal: false,
    currentStep: -1,
    items: [],
    finished: false,
  });
  const [stepsItem, setStepsItem] = React.useState(null);

  React.useEffect(() => {
    const index = steps.currentStep;
    if (!isEmpty(steps.items[index]) && steps.modal) {
      const items = steps.items;
      if (!items[index].pending) {
        items[index].pending = true;
        items[index].action();
        setSteps({ ...steps, items: items });
      } else {
        if (wallet.action.result === 'success' && !steps.finished) {
          const nextStep = index + 1;
          if (!isEmpty(items[nextStep])) {
            setSteps({ ...steps, currentStep: nextStep });
          } else {
            setSteps({ ...steps, finished: true });
          }
        }
      }
    }
  }, [steps, wallet.action]);

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
