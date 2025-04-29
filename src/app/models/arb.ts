import { Bookie } from '@bookies';
import { IBookieBase } from '@broker/store/store';
import { Bet } from '@models';

export interface Arb {
  stake: string;
  winnings: string;
  profit: string;
  currency: string;
  bet: Bet;
  bookie: Bookie | IBookieBase;
  viable: boolean;
}

export type ArbGroup = Arb[];
