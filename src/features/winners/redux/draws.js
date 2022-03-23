import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { potsByNetworkPrizePoolAddress } from '../../../config/vault';

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
      ppfs
      prizePool {
        address
      }
      winners {
        address
        staked
        awards {
          token
          amount
          tokenIds
        }
      }
    }
  }
`;

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/moonpotdev/moonpot-draws',
  cache: new InMemoryCache(),
});

function decorateDraw(draw, network) {
  const obj = { ...draw, network };
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

export const DRAWS_PER_PAGE = 100;

export const fetchDraws = createAsyncThunk('winners/fetchDraws', async (timestamp, thunkAPI) => {
  const limit = DRAWS_PER_PAGE + 1;
  const results = await client.query({
    query: query,
    variables: {
      timestamp: timestamp || Math.floor(Date.now() / 1000),
      limit,
    },
  });

  const unfilteredDraws = results?.data?.prizeDraws || [];
  const draws = unfilteredDraws
    .slice(0, DRAWS_PER_PAGE)
    .map(draw => decorateDraw(draw, 'bsc'))
    .filter(draw => !!draw.pot && draw.winners.length);

  return {
    draws,
    hasMore: unfilteredDraws.length === limit,
  };
});
