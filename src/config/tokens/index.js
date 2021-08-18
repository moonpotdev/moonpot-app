import { config } from '../config';
import { indexBy } from '../../helpers/utils';

const tokensByNetwork = Object.fromEntries(
  Object.keys(config).map(network => [network, require(`./${network}.json`)])
);

export const tokensByNetworkAddress = Object.fromEntries(
  Object.entries(tokensByNetwork).map(([network, tokens]) => [
    network,
    indexBy(tokens, 'address', k => k.toLowerCase()),
  ])
);

export const tokensByNetworkSymbol = Object.fromEntries(
  Object.entries(tokensByNetwork).map(([network, tokens]) => [network, indexBy(tokens, 'symbol')])
);
