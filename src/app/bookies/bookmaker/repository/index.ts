import { Browser, Page } from 'puppeteer';
import { BasketballH2H } from './live/basketball/basketball-h2h';
import { SoccerH2H } from './live/soccer/soccer-h2h';
import { TableTennisH2H } from './live/table-tennis/table-tennis-h2h';
import { TennisH2H } from './live/tennis/tennis-h2h';
import { UFCH2H } from './live/ufc/ufc-h2h';

// Reset the static page reference in classes
const resetPreviousState = () => {
  // Adding this technique to reset static properties between calls
  // These properties are not exposed directly, but we can trick the classes
  // to reset their state on the next call
  SoccerH2H['page'] = null;
  TennisH2H['page'] = null;
  BasketballH2H['page'] = null;
  TableTennisH2H['page'] = null;
  UFCH2H['page'] = null;
};

export const repo = (page: Page, browser: Browser) => {
  return {
    live: {
      tennis: {
        h2h: () => {
          resetPreviousState();
          return TennisH2H.get(page, browser);
        },
      },
      tableTennis: {
        h2h: () => {
          resetPreviousState();
          return TableTennisH2H.get(page, browser);
        },
      },
      basketball: {
        h2h: () => {
          resetPreviousState();
          return BasketballH2H.get(page, browser);
        },
      },
      ufc: {
        h2h: () => {
          resetPreviousState();
          return UFCH2H.get(page, browser);
        },
      },
      soccer: {
        h2h: () => {
          resetPreviousState();
          return SoccerH2H.get(page, browser);
        },
      },
    },
  };
};
