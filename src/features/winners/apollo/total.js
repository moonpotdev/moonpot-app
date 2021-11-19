import { ApolloClient, gql, InMemoryCache, useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { tokensByNetworkAddress } from '../../../config/tokens';
import { byDecimals } from '../../../helpers/format';
import { potsByNetworkPrizePoolAddress } from '../../../config/vault';
import BigNumber from 'bignumber.js';
import { ZERO } from '../../../helpers/utils';

const query = gql`
  query ($pools: [String!]) {
    prizePools(where: { id_in: $pools }) {
      totalAwards {
        token
        amount
      }
    }
  }
`;

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/moonpotdev/moonpot-draws',
  cache: new InMemoryCache(),
});

function getAllPrizePoolAddresses(network) {
  return Object.keys(potsByNetworkPrizePoolAddress[network]);
}

export const useTotalPrizeValue = function () {
  const network = 'bsc';
  const { loading, error, data } = useQuery(query, {
    client: client,
    variables: {
      pools: getAllPrizePoolAddresses(network),
    },
  });

  const prizePools = !loading && !error ? data?.prizePools : null;
  const prices = useSelector(state => state.pricesReducer.byNetworkAddress[network]);

  const total = useMemo(() => {
    let sum = ZERO;

    if (prizePools && prizePools.length) {
      for (const prizePool of prizePools) {
        for (const { token, amount } of prizePool.totalAwards) {
          const tokenData = tokensByNetworkAddress[network]?.[token.toLowerCase()];
          if (tokenData) {
            const numericAmount = byDecimals(amount, tokenData.decimals);
            const price = new BigNumber(prices[tokenData.address] || 0);
            sum = sum.plus(numericAmount.multipliedBy(price));
          } else {
            console.error(`No token for ${token} on ${network} found`);
          }
        }
      }
    }

    return sum.toNumber();
  }, [prizePools, prices]);

  return { loading, error, total };
};
