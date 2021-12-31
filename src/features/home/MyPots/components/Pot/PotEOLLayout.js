import React from 'react';
import { CardAccordionGroup, CardAccordionItem } from '../../../../../components/Cards';
import PotBonus from './PotBonus';
import { PotWithdraw } from '../../../../../components/PotWithdraw';
import { PotMigrate } from './PotMigrate';

const EOLLayout = function ({ item }) {
  return (
    <React.Fragment>
      {/*Pot with migration */}
      {item.migrationContractAddress ? <PotMigrate item={item} /> : null}
      <CardAccordionGroup>
        {/*Bonus*/}
        {item.migrationContractAddress || !('bonuses' in item) || !item.bonuses.length ? null : (
          <CardAccordionItem titleKey="pot.bonusEarnings">
            <PotBonus item={item} />
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
