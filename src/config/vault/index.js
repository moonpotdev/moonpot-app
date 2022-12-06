import { networkIds } from '../networks';

export const potsByNetwork = Object.fromEntries(
  networkIds.map(network => [
    network,
    require(`./${network}.json`).map(pot => ({ ...pot, network })),
  ])
);

export const potsAll = Object.values(potsByNetwork).flat();

export const potsByNetworkSupportingClaimAllBonuses = Object.fromEntries(
  Object.entries(potsByNetwork).map(([network, pots]) => [
    network,
    pots.filter(pot => pot.supportsClaimAllBonuses),
  ])
);
