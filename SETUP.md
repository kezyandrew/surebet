# Surebet Application Setup Guide

This guide provides detailed instructions for setting up and running the Surebet application for arbitrage betting.

## Prerequisites

- Node.js (v14 or newer)
- npm (v6 or newer)
- Git

## Installation Steps

1. Clone the repository (if not already done):

   ```bash
   git clone https://github.com/danielcardeenas/surebet.git
   cd surebet
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the TypeScript project:
   ```bash
   npm run build
   ```

## Running the Application

1. Run the application:

   ```bash
   npm start
   ```

   This will first build the project and then run it. The application uses Puppeteer to control web browsers for interacting with bookmaker websites.

2. For development, you can use the watch mode:

   ```bash
   npm run watch
   ```

   This will rebuild the application automatically when source files change.

## Important Notes

- By default, the application runs in headless mode (no visible browser). You can change this by setting `headless: false` in the initialization options.
- No real money is at risk unless you explicitly implement and enable real betting functionality.
- The WebSocket broker runs on localhost:8080. Make sure this port is available.
- Screenshots are saved in the screenshots directory.

## Keyboard Controls

While the application is running, you can use the following keyboard shortcuts:

- `p` - Pause the arber
- `r` - Resume the arber
- `Ctrl+C` - Stop the application

## Customization

You can customize the application by:

1. Adding new bookmakers in the `src/app/bookies` directory
2. Creating custom arbitrage strategies by extending the base `Arber` class
3. Adjusting investment amount and currency in `src/index.ts`

## Troubleshooting

1. **WebSocket Connection Error**: By default, the application tries to connect to a WebSocket server at localhost:8080. If you're seeing WebSocket connection errors, you can disable this feature by setting `ENABLE_WEBSOCKET = false` in `src/app/broker/broker.ts`.

2. **Browser Session Issues**: If you encounter errors related to browser sessions, try cleaning the sessions directory:

   ```bash
   rm -rf sessions/*
   mkdir -p sessions/session-betfair sessions/session-bookmaker
   ```

3. **TypeScript Build Errors**: If you encounter TypeScript errors during the build, check that all necessary types are defined. Some imports may be missing or referring to modules that don't exist.

4. **Browser Launch Failures**: If Puppeteer fails to launch browsers, ensure you have a compatible Chrome/Chromium installation. You may also need to set `headless: true` in `src/index.ts` to avoid issues with browser visibility.

5. **Network Issues**: If you experience networking issues with the browsers, verify that your firewall isn't blocking browser connections.

## Next Steps

- Implement login functionality with your bookmaker credentials
- Customize retrievers to focus on specific sports/markets
- Adjust betting strategies to match your preferences

For more information, refer to the main README.md file.
