import BigNumber from 'bignumber.js';

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
