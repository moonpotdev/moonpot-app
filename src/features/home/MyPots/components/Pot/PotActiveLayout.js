import React from 'react';
import { isEmpty } from '../../../../../helpers/utils';
import { PotDeposit } from '../../../../../components/PotDeposit/PotDeposit';
import { PotWithdraw } from '../../../../../components/PotWithdraw/PotWithdraw';
import { CardAccordionItem } from '../../../../../components/Cards/Cards';
import PotBonus from './PotBonus';

const ActiveLayout = function ({ item, wallet, balance, prices }) {
  const [steps, setSteps] = React.useState({
    modal: false,
    currentStep: -1,
    items: [],
    finished: false,
  });

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
    <>
      {/*Bonus*/}
      <CardAccordionItem titleKey={item.token === 'POTS' ? 'pot.earnings' : 'pot.bonusEarnings'}>
        <PotBonus item={item} prices={prices} wallet={wallet} balance={balance} />
      </CardAccordionItem>
      {/*Deposit*/}
      <CardAccordionItem titleKey="pot.depositMore">
        <PotDeposit id={item.id} onLearnMore={null} variant="purple" />
        <div style={{ height: '12px' }} />
      </CardAccordionItem>
      {/*Withdraw*/}
      <CardAccordionItem titleKey="pot.withdraw">
        <PotWithdraw id={item.id} onLearnMore={null} variant="purple" />
      </CardAccordionItem>
    </>
  );
};

export default ActiveLayout;
