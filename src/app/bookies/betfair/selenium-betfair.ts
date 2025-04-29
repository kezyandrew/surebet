import { SeleniumBookie } from '../selenium-bookie';
import {
  SeleniumBrowser,
  BrowserOptions,
} from '../../browser/selenium-browser';
import { Currency } from '@money/types';
import { BookieName, BetEvent } from '@models';
import { Credentials } from '../../models/types/credentials';
import { createSeleniumBetEvent } from '../../models/selenium-adapter';

export class SeleniumBetfair extends SeleniumBookie {
  public name: BookieName = BookieName.Betfair;

  // Factory method for creating instances
  static async instance(options: BrowserOptions, currency: Currency) {
    const browser = await SeleniumBrowser.create(options);
    return new SeleniumBetfair(browser, currency);
  }

  constructor(browser: SeleniumBrowser, currency: Currency) {
    super(browser, currency);
  }

  // Implement required methods (login, repository, etc.)
  protected async _login(credentials: Credentials): Promise<boolean> {
    try {
      await this.browser.goto('https://www.betfair.com/');

      // Login implementation using Selenium
      console.log(
        `[${this.name}] Login would be implemented here with credentials:`,
        credentials.user.substring(0, 2) + '***',
      );

      return true;
    } catch (error) {
      console.error(`[${this.name}] Login error:`, error);
      return false;
    }
  }

  public _repo = () => {
    return {
      live: {
        tennis: {
          h2h: async ({ include = [] } = {}) => {
            try {
              console.log(`[${this.name}] Navigating to tennis section`);
              // Navigate to tennis section
              await this.browser.goto(
                'https://www.betfair.com/exchange/plus/tennis',
              );

              console.log(`[${this.name}] Searching for tennis matches...`);

              // Wait for matches to load
              const matchElements =
                await this.browser.waitForSelectorAll('.event-list-item');
              console.log(
                `[${this.name}] Found ${matchElements.length} matches`,
              );

              // Extract matches info
              const matches: BetEvent[] = [];
              for (const element of matchElements) {
                try {
                  const title = await element.getText();
                  const odds = 1.5 + Math.random(); // Random odds between 1.5 and 2.5

                  // Use adapter to create compatible BetEvent
                  const betEvent = createSeleniumBetEvent(
                    element,
                    title || 'Unknown Match',
                    odds,
                    this.name,
                  );

                  matches.push(betEvent);
                } catch (err) {
                  console.error(`[${this.name}] Error processing match:`, err);
                }
              }

              return matches;
            } catch (error) {
              console.error(`[${this.name}] Error fetching tennis h2h:`, error);
              return [];
            }
          },
        },
        // Other sports could be implemented here
      },
    };
  };
}
