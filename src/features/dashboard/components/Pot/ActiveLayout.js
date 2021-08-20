import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import styles from '../../styles';
import { useTranslation } from 'react-i18next';
import { isEmpty } from '../../../../helpers/utils';
import { PotDeposit } from '../../../../components/PotDeposit/PotDeposit';
import { PotWithdraw } from '../../../../components/PotWithdraw/PotWithdraw';
import { CardAccordionItem } from '../../../../components/Cards/Cards';
import PotBonus from './PotBonus';

const ActiveLayout = function ({ item }) {
  const { t } = useTranslation();
  const fairplayRef = React.useRef(null);
  const { vault, wallet, balance, prices, earned } = useSelector(state => ({
    vault: state.vaultReducer,
    wallet: state.walletReducer,
    balance: state.balanceReducer,
    prices: state.pricesReducer,
    earned: state.earnedReducer,
  }));
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

  const handleFairplayLearnMore = useCallback(() => {
    if (fairplayRef.current) {
      window.scrollTo(0, fairplayRef.current.offsetTop);
    }
  }, [fairplayRef]);

  return (
    <>
      {/*Bonus*/}
      <CardAccordionItem titleKey="bonusEarnings">
        <PotBonus item={item} prices={prices} wallet={wallet} balance={balance} />
      </CardAccordionItem>
      {/*Deposit*/}
      <CardAccordionItem titleKey="depositMore">
        <PotDeposit id={item.id} onLearnMore={handleFairplayLearnMore} variant="purple" />
      </CardAccordionItem>
      {/*Withdraw*/}
      <CardAccordionItem titleKey="pot.withdraw">
        <PotWithdraw id={item.id} onLearnMore={handleFairplayLearnMore} />
      </CardAccordionItem>
    </>
  );
};

export default ActiveLayout;
