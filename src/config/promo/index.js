import { networkKeys } from '../networks';

export const promosByNetwork = Object.fromEntries(
  networkKeys.map(network => [
    network,
    require(`./${network}.json`).map(pot => ({ ...pot, network })),
  ])
);

export const promosAll = Object.values(promosByNetwork).flat();
