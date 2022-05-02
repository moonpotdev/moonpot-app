import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import {
  QueryPrizeDraw,
  queryPrizeDrawsBeforeDate,
  QueryPrizeDrawsBeforeDateReturnType,
  queryTotalAwardForPrizePools,
  QueryTotalAwardForPrizePoolsReturnType,
  QueryTotalPrizePool,
  queryWinningDrawsForAccountBeforeDate,
  QueryWinningDrawsForAccountBeforeDateReturnType,
} from './queries';
import { ApiPrizeDraw, ApiPrizeTotals } from './types';
import BigNumber from 'bignumber.js';
import { uniqBy } from 'lodash';
import axios from 'axios';

export class DrawsAPI {
  private readonly graph: ApolloClient<NormalizedCacheObject>;
  private readonly networkId: string;

  constructor(networkId: string, endpoint: string) {
    this.networkId = networkId;
    this.graph = new ApolloClient({
      uri: endpoint,
      cache: new InMemoryCache({
        addTypename: false,
      }),
      defaultOptions: {
        query: {
          fetchPolicy: 'no-cache',
        },
      },
    });
  }

  transformPrizePoolTotal(pool: QueryTotalPrizePool): ApiPrizeTotals {
    return {
      id: `${this.networkId}-${pool.address}`,
      networkId: this.networkId,
      prizePool: pool.address,
      awards: pool.totalAwards,
    };
  }

  async fetchTotalPrizesForPrizePools(prizePools: string[]): Promise<ApiPrizeTotals[]> {
    const result = await this.graph.query<QueryTotalAwardForPrizePoolsReturnType>({
      query: queryTotalAwardForPrizePools,
      variables: {
        pools: prizePools.map(address => address.toLowerCase()),
      },
    });

    return result.data.prizePools.map(pool => this.transformPrizePoolTotal(pool));
  }

  transformPrizeDraw(draw: QueryPrizeDraw): ApiPrizeDraw {
    return {
      id: `${this.networkId}-${draw.id}`,
      networkId: this.networkId,
      drawNumber: Number(draw.drawNumber),
      ppfs: new BigNumber(draw.ppfs),
      prizePool: {
        address: draw.prizePool.address,
      },
      timestamp: Number(draw.timestamp),
      totalPlayers: Number(draw.totalPlayers),
      txHash: draw.txHash,
      winners: draw.winners.map(winner => ({
        address: winner.address,
        staked: new BigNumber(winner.staked),
        awards: winner.awards.map(award => ({
          amount: new BigNumber(award.amount),
          token: award.token,
          tokenIds: award.tokenIds === null ? award.tokenIds : award.tokenIds.map(id => Number(id)),
        })),
      })),
    };
  }

  async fetchPrizeDrawsBefore(timestamp: number, limit: number = 1000): Promise<ApiPrizeDraw[]> {
    const result = await this.graph.query<QueryPrizeDrawsBeforeDateReturnType>({
      query: queryPrizeDrawsBeforeDate,
      variables: {
        timestamp,
        limit,
      },
    });

    return result.data.prizeDraws.map(draw => this.transformPrizeDraw(draw));
  }

  async fetchWinningDrawsForAccountBefore(
    address: string,
    timestamp: number,
    limit: number = 1000
  ): Promise<ApiPrizeDraw[]> {
    const result = await this.graph.query<QueryWinningDrawsForAccountBeforeDateReturnType>({
      query: queryWinningDrawsForAccountBeforeDate,
      variables: {
        address: address.toLowerCase(),
        timestamp,
        limit,
      },
    });

    if (result.data.accounts.length === 1 && result.data.accounts[0].winners.length) {
      return uniqBy(
        result.data.accounts[0].winners.map(winner => this.transformPrizeDraw(winner.prizeDraw)),
        draw => draw.id
      );
    }

    return [];
  }

  async fetchUniqueWinnersCount(): Promise<number> {
    const request = await axios.get('https://api.moonpot.com/winners/unique', {
      timeout: 2000,
    });

    if (request.status !== 200) {
      throw new Error(`fetchUniqueWinnersCount: invalid status ${request.status}`);
    }

    if (!request.data || !request.data.data || !('uniqueWinners' in request.data.data)) {
      throw new Error(`fetchUniqueWinnersCount: malformed response`);
    }

    return Number(request.data.data.uniqueWinners);
  }
}
