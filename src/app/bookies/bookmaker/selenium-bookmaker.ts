import { SeleniumBookie } from '../selenium-bookie';
import {
  SeleniumBrowser,
  BrowserOptions,
} from '../../browser/selenium-browser';
import { Currency } from '@money/types';
import { BookieName, BetEvent } from '@models';
import { Credentials } from '../../models/types/credentials';
import { createSeleniumBetEvent } from '../../models/selenium-adapter';

export class SeleniumBookmaker extends SeleniumBookie {
  public name: BookieName = BookieName.Bookmaker;

  // Factory method for creating instances
  static async instance(options: BrowserOptions, currency: Currency) {
    const browser = await SeleniumBrowser.create(options);
    return new SeleniumBookmaker(browser, currency);
  }

  constructor(browser: SeleniumBrowser, currency: Currency) {
    super(browser, currency);
  }

  // Implement required methods (login, repository, etc.)
  protected async _login(credentials: Credentials): Promise<boolean> {
    try {
      await this.browser.goto('https://www.bookmaker.eu/'); // Example URL

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
          h2h: async () => {
            try {
              console.log(`[${this.name}] Navigating to tennis section`);
              // Navigate to tennis section (example URL)
              await this.browser.goto('https://www.bookmaker.eu/live/tennis');

              console.log(`[${this.name}] Searching for tennis matches...`);

              // In a real implementation, we would locate the tennis section
              await this.browser.waitForSelector(
                '.sports-controls [cat="TENNIS"]',
              );

              // Wait for matches to load
              const matchElements =
                await this.browser.waitForSelectorAll('.event-item');
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
        // Soccer implementation
        soccer: {
          h2h: async () => {
            try {
              console.log(`[${this.name}] Navigating to soccer section`);
              // Navigate to soccer section (example URL)
              await this.browser.goto(
                'https://lines.bookmaker.eu/en/sports/soccer/',
              );

              console.log(`[${this.name}] Searching for soccer matches...`);

              // Try multiple possible selectors for soccer
              const possibleSelectors = [
                '.sports-controls [cat="top-leagues"]',
                // '.sports-controls [cat="soccer"]',
                // '.sports-controls [cat="FOOTBALL"]',
                // '.sports-controls [cat="football"]',
                // '.sports-controls [cat="Soccer"]',
                // '.sports-controls [cat="Football"]'
              ];

              let foundSelector = false;
              for (const selector of possibleSelectors) {
                try {
                  console.log(`[${this.name}] Trying selector: ${selector}`);
                  // Use a default timeout value since the method already has a default
                  await this.browser.waitForSelector(selector);
                  await this.browser.click(selector);
                  console.log(
                    `[${this.name}] Found soccer section with selector: ${selector}`,
                  );
                  foundSelector = true;
                  break;
                } catch (err) {
                  // Continue to next selector
                }
              }

              if (!foundSelector) {
                console.log(
                  `[${this.name}] Could not find soccer section with known selectors`,
                );
                // Try to find any controls and log them for debugging
                try {
                  const controls = await this.browser.waitForSelectorAll(
                    '.sports-controls [cat]',
                  );
                  console.log(
                    `[${this.name}] Found ${controls.length} sport controls`,
                  );
                  for (const control of controls) {
                    const catValue = await control.getAttribute('cat');
                    console.log(
                      `[${this.name}] Found sport control with cat="${catValue}"`,
                    );

                    // If it looks like soccer, click it
                    if (
                      catValue &&
                      (catValue.toLowerCase().includes('soccer') ||
                        catValue.toLowerCase().includes('football') ||
                        catValue.toLowerCase().includes('futbol'))
                    ) {
                      console.log(
                        `[${this.name}] This looks like soccer, clicking it`,
                      );
                      await control.click();
                      foundSelector = true;
                      break;
                    }
                  }
                } catch (err) {
                  console.error(
                    `[${this.name}] Error checking available sports controls:`,
                    err,
                  );
                }
              }

              // Wait for matches to load
              const matchElements = await this.browser.waitForSelectorAll(
                'app-schedule-game-american',
              );
              console.log(
                `[${this.name}] Found ${matchElements.length} soccer matches`,
              );

              // Extract matches info
              const matches: BetEvent[] = [];
              for (const element of matchElements) {
                try {
                  // Get team names
                  const visitor = await this.browser.evaluate(
                    'return arguments[0].querySelector(".teams .visitor").textContent.trim()',
                    element,
                  );
                  const home = await this.browser.evaluate(
                    'return arguments[0].querySelector(".teams .home").textContent.trim()',
                    element,
                  );

                  // Get odds
                  const odds1 = (await this.browser.evaluate(
                    'return parseFloat(arguments[0].querySelector("app-money-line .mline-1").textContent.trim())',
                    element,
                  )) as number;
                  const odds2 = (await this.browser.evaluate(
                    'return parseFloat(arguments[0].querySelector("app-money-line .mline-2").textContent.trim())',
                    element,
                  )) as number;

                  // Create bets for both teams
                  const title = `${visitor} vs ${home}`;
                  const betEvent = createSeleniumBetEvent(
                    element,
                    title,
                    Math.max(odds1 || 0, odds2 || 0), // Use 0 as fallback if odds are null/undefined
                    this.name,
                  );

                  matches.push(betEvent);
                } catch (err) {
                  console.error(
                    `[${this.name}] Error processing soccer match:`,
                    err,
                  );
                }
              }

              return matches;
            } catch (error) {
              console.error(`[${this.name}] Error fetching soccer h2h:`, error);
              return [];
            }
          },
        },
      },
    };
  };
}
