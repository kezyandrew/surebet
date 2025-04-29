import { BetEvent } from '..';
import { Bookie } from '../../bookies/bookie';
import { IBookieBase } from '@broker/store/store';

export type BookieEvent = {
  event: BetEvent;
  bookie: Bookie | IBookieBase;
};
