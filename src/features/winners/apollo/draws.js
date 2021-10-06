import {
  ApolloClient,
  gql,
  InMemoryCache,
  makeVar,
  useQuery,
  useReactiveVar,
} from '@apollo/client';
import { useCallback, useMemo } from 'react';
import { potsByNetworkPrizePoolAddress } from '../../../config/vault';

const hasMoreDraws = makeVar(false);

const query = gql`
  query ($timestamp: BigInt!, $limit: Int!) {
    prizeDraws(
      orderBy: timestamp
      orderDirection: desc
      where: { timestamp_lt: $timestamp }
      first: $limit
    ) {
      id
      drawNumber
      txHash
      timestamp
      totalPlayers
      prizePool {
        address
      }
      awards {
        token
        amount
      }
      winners {
        address
        staked
      }
    }
  }
`;

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/moonpotdev/moonpot-draws',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          prizeDraws: {
            keyArgs: false,
            merge(existing = {}, incoming, { readField, variables }) {
              // Copy
              const merged = { ...existing };

              // Do not add the last item, its used only to tell if there is another page
              incoming
                .slice(0, variables.limit - 1)
                .forEach(ref => (merged[readField('id', ref)] = ref));

              // Due to above, we have more draws if we got the full limit of items
              hasMoreDraws(incoming.length > variables.limit - 1);

              return merged;
            },
            read(existing, { readField }) {
              if (existing) {
                const draws = Object.values(existing);

                draws.sort((refA, refB) => {
                  const a = Number(readField('timestamp', refA));
                  const b = Number(readField('timestamp', refB));
                  return (a < b) - (a > b);
                });

                return draws;
              }
            },
          },
        },
      },
    },
  }),
});

function decorateDraw(draw, network) {
  const obj = { ...draw };
  const pots = potsByNetworkPrizePoolAddress[network][draw.prizePool.address.toLowerCase()];

  // add static pot info
  if (pots && pots.length) {
    const pot = pots[0];
    if (pot.status !== 'eol' || draw.drawNumber <= pot.eolDrawNumber) {
      obj.pot = pot;
    }
  }

  // TEMP FIX: remove 0 staked
  obj.winners = obj.winners.filter(winner => winner.staked !== '0');

  return obj;
}

export const useHasMoreDraws = function () {
  return useReactiveVar(hasMoreDraws);
};

export const useDraws = function () {
  const network = 'bsc';

  const { loading, error, data, fetchMore } = useQuery(query, {
    client: client,
    variables: {
      timestamp: Math.floor(Date.now() / 1000),
      limit: 20 + 1, // fetch 1 more than needed so we can work out if there is another 'page'
    },
  });
  const prizeDraws = !loading && !error ? data?.prizeDraws : null;
  const hasMore = useHasMoreDraws();

  const draws = useMemo(() => {
    if (prizeDraws && prizeDraws.length) {
      return prizeDraws.map(draw => decorateDraw(draw, network)).filter(draw => !!draw.pot);
    }

    return null;
  }, [prizeDraws]);

  const handleFetchMore = useCallback(() => {
    if (draws && draws.length) {
      const minTimestamp = Math.min(...draws.map(draw => draw.timestamp));
      return fetchMore({
        variables: {
          timestamp: minTimestamp,
        },
      });
    }
  }, [draws, fetchMore]);

  return { loading, error, draws, fetchMore: handleFetchMore, hasMore };
};
