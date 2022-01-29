import { groupBy } from '../../helpers/utils';
import { networkKeys } from '../networks';

export const potsByNetwork = Object.fromEntries(
  networkKeys.map(network => [
    network,
    require(`./${network}.json`).map(pot => ({ ...pot, network })),
  ])
);

export const potsAll = Object.values(potsByNetwork).flat();

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
