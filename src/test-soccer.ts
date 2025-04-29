// Keep import order
require('module-alias/register'); // @ paths
import 'reflect-metadata'; // Dependency injection

import { SeleniumBookmaker } from '@bookies';
import { money } from '@money/currencies';
import { SoccerH2H } from './app/bookies/bookmaker/repository/live/soccer/soccer-h2h';
import { Browser, Page } from 'puppeteer';

async function testSoccer() {
  console.log('Starting Soccer Implementation Test...');

  try {
    // Initialize browser with the same options as the main app
    const browserOptions = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
    };

    // Create bookmaker instance
    const bookmaker = await SeleniumBookmaker.instance(
      browserOptions,
      money.USD,
    );
    console.log('Bookmaker initialized with Selenium');

    // Navigate to their homepage to establish a session
    console.log('Navigating to bookmaker homepage...');
    await bookmaker.browser.goto('https://www.bookmaker.eu/');

    // We need to test our SoccerH2H implementation but we have a problem:
    // SoccerH2H expects Puppeteer Browser/Page but we have SeleniumBrowser
    console.log(
      'Warning: Cannot directly test SoccerH2H with Selenium due to Puppeteer dependency',
    );
    console.log(
      'This test script demonstrates the issue with our implementation approach',
    );

    // Demonstrate how the repo would be called if TypeScript recognized it
    console.log(
      '\nThe following would be the correct way to call our implementation:',
    );
    console.log('bookmaker.repo().live.soccer.h2h()');

    // Print our implementation file contents for confirmation
    console.log('\nOur implementation exists at:');
    console.log(
      'src/app/bookies/bookmaker/repository/live/soccer/soccer-h2h.ts',
    );

    // Close browser when done
    await bookmaker.browser.close();
    console.log('\nTest completed.');
    console.log('To resolve this issue:');
    console.log(
      '1. The issue is that the SoccerH2H implementation uses Puppeteer but we have SeleniumBrowser',
    );
    console.log('2. We need to either:');
    console.log(
      '   a. Create a SeleniumSoccerH2H class that uses Selenium WebDriver instead of Puppeteer',
    );
    console.log(
      '   b. Create a compatibility layer that adapts SeleniumBrowser to Puppeteer interfaces',
    );
    console.log(
      'Note: Currently the tennis implementation works because the _repo method in SeleniumBookmaker',
    );
    console.log('has a special implementation for tennis but not soccer.');
  } catch (error) {
    console.error('Error during soccer test:', error);
  }
}

// Run the test function
testSoccer().catch((error) => {
  console.error('Unexpected error during test:', error);
});
