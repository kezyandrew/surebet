import { Bookie } from '@bookies';
import { IBookieBase } from '@broker/store/store';
import { BetEvent } from '@models';

export type BookieRetrieverTuple = {
  bookie: Bookie | IBookieBase;
  retriever: () => Promise<BetEvent[]>;
};
