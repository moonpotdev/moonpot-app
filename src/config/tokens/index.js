import { networkKeys } from '../networks';
import { indexBy } from '../../helpers/utils';

export const tokensByNetwork = Object.fromEntries(
  networkKeys.map(network => [
    network,
    require(`./${network}.json`).map(token => ({ ...token, network })),
  ])
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

export function getUnderylingToken(token) {
  while (token.underlyingToken) {
    token = tokensByNetworkSymbol[token.network][token.underlyingToken];
  }

  return token;
}
