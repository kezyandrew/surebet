import { WebElement } from 'selenium-webdriver';
import { Bet, BetEvent, BookieName, PostulateResult } from '@models';

// Create an adapter to convert Selenium WebElements to objects compatible with the existing system
export function createSeleniumBetEvent(
  webElement: WebElement,
  title: string,
  odds: number,
  bookie: BookieName,
): BetEvent {
  // Create a Bet object that's compatible with the system
  const bet: Bet = {
    title: title,
    odds: odds,
    element: webElement as any, // Type casting here since we're adapting
    postulate: async () => {
      // Return a valid PostulateResult
      return {
        valid: true,
        odds: odds,
        reason: 'Selenium postulate successful',
        maxStake: 100,
      };
    },
    place: async () => true,
    bookie: bookie,
  };

  // Return a BetEvent object
  return {
    bets: [bet],
    bookie: bookie,
    title: title,
  };
}
