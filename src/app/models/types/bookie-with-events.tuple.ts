import { Bookie } from '../../bookies/bookie';
import { IBookieBase } from '@broker/store/store';
import { BetEvent } from '../bet-event';

export type BookieEvents = {
  bookie: Bookie | IBookieBase;
  events: BetEvent[];
};
