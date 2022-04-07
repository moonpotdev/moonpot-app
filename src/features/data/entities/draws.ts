import { ApiPrizeDraw } from '../apis/draws';
import { NetworkEntity } from './network';

export type DrawEntity = ApiPrizeDraw & { potId: string };

export type PotPrizeTotalsEntity = {
  id: string;
  networkId: NetworkEntity['id'];
  potId: string;
  awards: {
    token: string;
    amount: string;
  }[];
};
