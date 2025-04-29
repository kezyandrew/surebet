import { Bookie } from '@bookies';
import { IBookieBase } from '@broker/store/store';
import { Bet } from '@models';

export type BookieBet = { bookie: Bookie | IBookieBase; bet: Bet };
