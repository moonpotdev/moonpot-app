import BigNumber from 'bignumber.js';
import { NetworkEntity } from '../../entities/network';

export interface ApiAward {
  amount: BigNumber;
  token: string;
  tokenIds: number[] | null;
}

export interface ApiWinner {
  address: string;
  staked: BigNumber;
  awards: ApiAward[];
}

export interface ApiPrizePool {
  address: string;
}

export interface ApiPrizeDraw {
  id: string;
  networkId: string;
  drawNumber: number;
  ppfs: BigNumber;
  prizePool: ApiPrizePool;
  timestamp: number;
  totalPlayers: number;
  txHash: string;
  winners: ApiWinner[];
}

export interface ApiPrizePoolTotalAward {
  token: string;
  amount: string;
}

export interface ApiPrizeTotals {
  id: string;
  networkId: NetworkEntity['id'];
  prizePool: string;
  awards: ApiPrizePoolTotalAward[];
}
