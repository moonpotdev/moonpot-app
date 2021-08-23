import { config } from '../config';
import { groupBy } from '../../helpers/utils';

export const potsByNetwork = Object.fromEntries(
  Object.keys(config).map(network => [network, require(`./${network}.json`)])
);

export const potsByNetworkPrizePoolAddress = Object.fromEntries(
  Object.entries(potsByNetwork).map(([network, pots]) => [
    network,
    groupBy(pots, 'prizePoolAddress', k => k.toLowerCase()),
  ])
);
