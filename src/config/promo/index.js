import { networkIds } from '../networks';

export const promosByNetwork = Object.fromEntries(
  networkIds.map(network => [
    network,
    require(`./${network}.json`).map(promo => ({ ...promo, network })),
  ])
);

export const promosAll = Object.values(promosByNetwork).flat();
