import React from 'react';
import { isEmpty } from '../../../../../helpers/utils';
import { PotDeposit } from '../../../../../components/PotDeposit';
import { PotWithdraw } from '../../../../../components/PotWithdraw';
import { CardAccordionItem } from '../../../../../components/Cards';
import PotBonus from './PotBonus';
import { ZapPotWithdraw } from '../../../../../components/PotWithdraw/ZapPotWithdraw';
import { ZapPotDeposit } from '../../../../../components/ZapPotDeposit/ZapPotDeposit';
import { useSelector } from 'react-redux';

const ActiveLayout = function ({ item }) {
  const wallet = useSelector(state => state.wallet);
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
      {'bonuses' in item && item.bonuses.length ? (
        <CardAccordionItem titleKey={item.id === 'pots' ? 'pot.earnings' : 'pot.bonusEarnings'}>
          <PotBonus item={item} />
        </CardAccordionItem>
      ) : null}
      {/*Deposit*/}
      <CardAccordionItem titleKey="pot.depositMore">
        {item.isZap ? (
          <ZapPotDeposit id={item.id} onLearnMore={null} variant="purple" />
        ) : (
          <PotDeposit id={item.id} onLearnMore={null} variant="purple" />
        )}
        <div style={{ height: '12px' }} />
      </CardAccordionItem>
      {/*Withdraw*/}
      <CardAccordionItem titleKey="pot.withdraw">
        {item.isZap ? (
          <ZapPotWithdraw id={item.id} onLearnMore={null} variant="purple" />
        ) : (
          <PotWithdraw id={item.id} onLearnMore={null} variant="purple" />
        )}
      </CardAccordionItem>
    </>
  );
};

export default ActiveLayout;
