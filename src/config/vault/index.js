import { config } from '../config';
import { groupBy } from '../../helpers/utils';

export const potsByNetwork = Object.fromEntries(
  Object.keys(config).map(network => [
    network,
    require(`./${network}.json`).map(pot => ({ ...pot, network })),
  ])
);

export const potsByNetworkPrizePoolAddress = Object.fromEntries(
  Object.entries(potsByNetwork).map(([network, pots]) => [
    network,
    groupBy(pots, 'prizePoolAddress', k => k.toLowerCase()),
  ])
);

export const potsByNetworkSupportingClaimAllBonuses = Object.fromEntries(
  Object.entries(potsByNetwork).map(([network, pots]) => [
    network,
    pots.filter(pot => pot.supportsClaimAllBonuses),
  ])
);
