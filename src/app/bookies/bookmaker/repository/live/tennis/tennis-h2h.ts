import { Cleaner, Place, Postulate } from '@bookmaker/controllers';
import { H2HGenetic } from '@genetics';
import { Bet, BetEvent, BookieName, PartialBet } from '@models';
import { randomInt, sleep } from '@utils';
import { createCursor, GhostCursor } from 'ghost-cursor';
import { Browser, ElementHandle, Page } from 'puppeteer';

export class TennisH2H {
  private static page: Page;
  private static cursor: GhostCursor;

  /**
   * Main retriever method
   * @param page
   * @param browser
   */
  public static async get(page: Page, browser: Browser) {
    console.log(
      '[IMPORTANT] TennisH2H is now modified to test soccer - this is a temporary workaround',
    );
    if (!this.page) {
      this.cursor = createCursor(page);
      // Page should already come loaded
      this.page = await this.navigateTo(page, 'TENNIS', this.cursor);
      this.page.setDefaultTimeout(8000);
    }

    // Get rows
    console.log(
      '[Bookmaker] Searching for matches (TENNIS CLASS MODIFIED TO NAVIGATE TO SOCCER)...',
    );
    const _rows = await this.eventRows(this.page);

    // Create events
    const _events = _rows.map(async (_row) => this.createBetEvent(_row));
    const events = await Promise.all(_events);

    return events;
  }

  /**
   * Retrieves each event row as Elements
   * @param page
   */
  private static async eventRows(page: Page) {
    // This is the original tennis selector
    const matchesQuery = 'app-schedule-game-american';

    // Also try these selectors for soccer matches
    const soccerQueries = [
      'app-schedule-game-american',
      '.event-item',
      '.match-row',
      '.soccer-match',
      '.event-row',
      '.game-item',
    ];

    console.log(
      `[Bookmaker] Looking for match rows with original query: ${matchesQuery}`,
    );
    try {
      await page.waitForSelector(matchesQuery, {
        timeout: 8000,
      });
      const rows = await page.$$(matchesQuery);
      console.log(
        `[Bookmaker] Found ${rows.length} matches with the tennis selector`,
      );
      if (rows.length > 0) {
        return rows;
      }
    } catch (err) {
      console.log(
        `[Bookmaker] No matches found with tennis selector: ${matchesQuery}`,
      );
    }

    // If original query failed, try soccer queries
    for (const query of soccerQueries) {
      console.log(`[Bookmaker] Trying soccer selector: ${query}`);
      try {
        await page.waitForSelector(query, {
          timeout: 3000,
        });
        const rows = await page.$$(query);
        console.log(
          `[Bookmaker] Found ${rows.length} matches with soccer selector: ${query}`,
        );
        if (rows.length > 0) {
          return rows;
        }
      } catch (err) {
        console.log(
          `[Bookmaker] No matches found with soccer selector: ${query}`,
        );
      }
    }

    console.log('[Bookmaker] No soccer events found with any selector');
    return [];
  }

  /**
   * Creates a BetEvent from given event row element
   * @param row
   * @param page
   */
  private static async createBetEvent(
    row: ElementHandle<Element>,
  ): Promise<BetEvent> {
    const _partials: PartialBet[] = await row.evaluate((row: Element) => {
      // @ts-ignore
      const runners = [
        row.querySelector('.teams .visitor')?.textContent.trim(),
        row.querySelector('.teams .home')?.textContent.trim(),
      ];

      // @ts-ignore
      const buttons = [
        row.querySelector('app-money-line .mline-1'),
        row.querySelector('app-money-line .mline-2'),
      ];

      // Buttons are already ordered
      return buttons.map((button, index) => {
        const odds = +button.textContent?.trim();
        return {
          title: runners[index],
          odds: !!odds ? odds : 0,
        };
      });
    }, row);

    // Already ordered
    const buttons = [
      await row.$('app-money-line .mline-1'),
      await row.$('app-money-line .mline-2'),
    ];

    const bets: Bet[] = _partials.map((partial, index) => {
      const buttonElement = buttons[index];
      return {
        title: partial.title,
        odds: partial.odds,
        element: buttonElement,
        genetic: new H2HGenetic(partial.title),
        place: () =>
          Place.do(this.page, buttonElement, partial.odds, this.cursor),
        clean: () => Cleaner.do(this.page),
        postulate: (amount: number) =>
          Postulate.do(
            this.page,
            buttonElement,
            amount,
            partial.odds,
            this.cursor,
          ),
      };
    });

    // Return event
    return {
      bets: bets,
      bookie: BookieName.Bookmaker,
      title: `${bets[0]?.title} ${bets[1]?.title}`,
    };
  }

  /**
   * Loads tennis matches in the browser
   * @param page
   * @param section ("cat" property)
   * @returns
   */
  private static async navigateTo(
    page: Page,
    section: string,
    cursor: GhostCursor,
  ) {
    console.log(
      'REDIRECTING: Using soccer section instead of tennis for testing!',
    );
    // Override section to use soccer instead of tennis
    // Soccer section testing - using multiple possible selector formats
    const possibleSelectors = [
      `.sports-controls [cat="SOCCER"]`,
      `.sports-controls [cat="soccer"]`,
      `.sports-controls [cat="FOOTBALL"]`,
      `.sports-controls [cat="football"]`,
      `.sports-controls [cat="Soccer"]`,
      `.sports-controls [cat="Football"]`,
    ];

    console.log('[Bookmaker] Looking for soccer control...');

    // Try each selector
    for (const selector of possibleSelectors) {
      console.log(`[Bookmaker] Trying selector: ${selector}`);
      try {
        const control = await page.waitForSelector(selector, { timeout: 3000 });

        if (control) {
          console.log(
            `[Bookmaker] Found soccer control with selector: ${selector}`,
          );
          await cursor.move(control);
          await control.click({ delay: randomInt(10, 50) });
          await sleep(3000);
          return page;
        }
      } catch (error) {
        console.log(`[Bookmaker] Selector ${selector} not found`);
        // Continue to next selector
      }
    }

    // If we get here, we couldn't find any of the selectors, so let's list all available sports
    console.log(
      '[Bookmaker] No soccer control found with known selectors. Checking all available sports:',
    );
    try {
      const allControls = await page.$$('.sports-controls [cat]');
      if (allControls.length === 0) {
        console.log(
          '[Bookmaker] No sports controls found at all. Checking if sports-controls exists:',
        );
        const sportsControls = await page.$('.sports-controls');
        if (!sportsControls) {
          console.log('[Bookmaker] sports-controls element not found');
        } else {
          console.log(
            '[Bookmaker] sports-controls exists but no [cat] elements found',
          );
        }
      } else {
        for (const ctrl of allControls) {
          const catValue = await page.evaluate(
            (el) => el.getAttribute('cat'),
            ctrl,
          );
          console.log(
            `[Bookmaker] Found sports control with cat="${catValue}"`,
          );

          // If it looks like it might be soccer, try clicking it
          if (
            catValue.toLowerCase().includes('soccer') ||
            catValue.toLowerCase().includes('football') ||
            catValue.toLowerCase().includes('futbol')
          ) {
            console.log(
              `[Bookmaker] This looks like soccer, trying to click it`,
            );
            await cursor.move(ctrl);
            await ctrl.click({ delay: randomInt(10, 50) });
            await sleep(3000);
            return page;
          }
        }
      }
    } catch (error) {
      console.error(
        '[Bookmaker] Error checking available sports controls:',
        error.message,
      );
    }

    // If we can't find soccer controls, fall back to original behavior
    console.log('[Bookmaker] Falling back to original tennis selector');
    const control = await page.waitForSelector(
      `.sports-controls [cat="${section}"]`,
    );

    await cursor.move(control);
    await control.click({ delay: randomInt(10, 50) });
    await sleep(3000);
    return page;
  }
}
