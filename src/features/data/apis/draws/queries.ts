import { gql } from '@apollo/client';

export const queryTotalAwardForPrizePools = gql`
  query ($pools: [String!]) {
    prizePools(where: { id_in: $pools }) {
      address
      totalAwards {
        token
        amount
      }
    }
  }
`;

export interface QueryTotalPrizePool {
  address: string;
  totalAwards: QueryTotalAward[];
}

export interface QueryTotalAward {
  token: string;
  amount: string;
}

export interface QueryTotalAwardForPrizePoolsReturnType {
  prizePools: QueryTotalPrizePool[];
}

export const queryPrizeDrawsBeforeDate = gql`
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

export interface QueryAward {
  amount: string;
  token: string;
  tokenIds: string[] | null;
}

export interface QueryWinner {
  address: string;
  staked: string;
  awards: QueryAward[];
}

export interface QueryPrizePool {
  address: string;
}

export interface QueryPrizeDraw {
  id: string;
  drawNumber: string;
  ppfs: string;
  prizePool: QueryPrizePool;
  timestamp: string;
  totalPlayers: string;
  txHash: string;
  winners: QueryWinner[];
}

export interface QueryPrizeDrawsBeforeDateReturnType {
  prizeDraws: QueryPrizeDraw[];
}

export const queryWinningDrawsForAccountBeforeDate = gql`
  query ($account: String!, $timestamp: BigInt!, $limit: Int!) {
    accounts(where: { id: $account }) {
      id
      winners(
        orderBy: timestamp
        orderDirection: desc
        where: { timestamp_lt: $timestamp }
        first: $limit
      ) {
        prizeDraw {
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
    }
  }
`;

export interface QueryWinningDrawsForAccountBeforeDateReturnType {
  accounts: {
    id: string;
    winners: {
      prizeDraw: QueryPrizeDraw;
    }[];
  }[];
}
