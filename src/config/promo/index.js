import { config } from '../config';

export const promosByNetwork = Object.fromEntries(
  Object.keys(config).map(network => [
    network,
    require(`./${network}.json`).map(pot => ({ ...pot, network })),
  ])
);

export const promosAll = Object.values(promosByNetwork).flat();
