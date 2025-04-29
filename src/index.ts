// Keep import order
require('module-alias/register'); // @ paths
import 'reflect-metadata'; // Dependency injection

import { H2HArber } from '@arbers';
import { SeleniumBetfair, SeleniumBookmaker } from '@bookies';
import { money } from '@money/currencies';
import { take } from 'rxjs/operators';

async function main() {
  console.log('Starting Surebet application with Selenium...');

  try {
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

    const [betfair, bookmaker] = await Promise.all([
      SeleniumBetfair.instance(browserOptions, money.USD),
      SeleniumBookmaker.instance(browserOptions, money.USD),
    ]);

    console.log('Bookmakers initialized with Selenium');

    // Using our new soccer implementation
    const retrievers = [
      {
        bookie: bookmaker,
        retriever: () => bookmaker.repo().live.soccer.h2h(),
      },
    ];

    // Define investment amount
    const investment = { amount: 200, currency: money.USD };

    // Create and start the arber
    const arber = new H2HArber(retrievers, investment);

    console.log('Starting soccer arbitrage scanner...');
    arber.start();

    // Listen for the close event
    arber.closed.pipe(take(1)).subscribe(() => {
      console.log('Arber closed, exiting application');
      process.exit(0);
    });

    console.log('Application running. Press Ctrl+C to exit.');
  } catch (error) {
    console.error('Error starting application:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
