
<p align="center">
  <img width="369" height="84" src="https://github.com/user-attachments/assets/a21cff5d-9433-4015-91a9-867642b2c89c">
</p>

# Surebet 💵
[![GitHub license](https://img.shields.io/github/license/danielcardeenas/surebet)](https://github.com/danielcardeenas/surebet/blob/master/LICENSE)
[![codebeat badge](https://codebeat.co/badges/7e510d47-8689-49da-abd8-a9a29d106a2b)](https://codebeat.co/projects/github-com-danielcardeenas-surebet-main)
> Extendible, customizable real-time arbitrage scanning and placing software

---

> Surebet is an extendible and customizable real-time arbitrage scanning and placing software designed to help you find and place arbitrage bets across multiple bookmakers or sources. It supports various betting strategies, uses fuzzy string matching to identify matching events between sources, and is built for flexibility and scalability.

## Table of Contents
- [<code>Features</code>](#features)
- [<code>Installation</code>](#installation)
- [<code>Usage</code>](#usage)
  - [<code>Getting Started</code>](#getting-started)
  - [<code>Example</code>](#example)
- [<code>Customization</code>](#customization)
  - [<code>Custom Arbers</code>](#custom-arbers)
  - [<code>Custom Retrievers</code>](#custom-retrievers)
- [<code>📦 Build and Run</code>](#build-and-run)
- [<code>License</code>](#license)

---

## Features

Surebet offers the following key features:

| Feature                     | Description                                                                                  |
|-----------------------------|----------------------------------------------------------------------------------------------|
| **Retriever Agnostic**      | Supports any retriever type (websockets, API calls, Selenium, Puppeteer, etc.) via a common interface. |
| **Multiple Sources/Bookies**| Handles arbitrage opportunities across multiple bookmakers simultaneously.                   |
| **Customizable Arbers**     | Allows custom arbitrage strategies. Examples: [H2H Arber](src/app/arbers/h2h/h2h-arber.ts), [1x2 Arber](src/app/arbers/h2h/1x2.arber.ts). |
| **Genetic Strategies**      | Built-in support for customizable genetic algorithms. See [available strategies](src/app/genetics). |
| **Fiat Conversion**         | Includes fixed fiat-to-fiat conversion for betting across currencies. See [money module](src/app/money). |
| **Fuzzy String Matching**   | Uses fuzzy string matching (via [fuzzball.js](https://github.com/nol13/fuzzball.js)) to identify similar events between bookmakers. |
| **Predefined Arbers**       | Includes predefined strategies for markets like H2H (tennis, MMA) and 1x2 (soccer). |

---

## Installation

To get started with Surebet, clone the repository and install the necessary dependencies:

```bash
git clone https://github.com/danielcardeenas/surebet.git
cd surebet
npm install
```

---

## Usage

### Getting Started

Here's how to use Surebet for basic H2H arbitrage betting:

1. Import the required modules:
   ```ts
   import { H2HArber } from '@arbers';
   import { Betfair, Bookmaker } from '@bookies';
   import { money } from '@money/currencies';
   ```

2. Create instances of your bookmakers:
   ```ts
   const [betfair, bookmaker] = await Promise.all([
     Betfair.instance({ headless: false }, money.USD),
     Bookmaker.instance({ headless: false }, money.USD),
   ]);
   ```

3. Login to the bookmaker accounts:
   ```ts
   await betfair.login({ user: 'yourUsername', password: 'yourPassword' });
   ```

4. Define retrievers to fetch live betting opportunities:
   ```ts
   const retrievers = [
     {
       bookie: betfair,
       retriever: () => betfair.repo().live.tennis.h2h({ include: ['back'] }),
     },
     {
       bookie: bookmaker,
       retriever: () => bookmaker.repo().live.tennis.h2h(),
     },
   ];
   ```

5. Start the arbitrage process:
   ```ts
   const investment = { amount: 200, currency: money.USD };
   const tennisArber = new H2HArber(retrievers, investment);

   tennisArber.start();

   // Listen for the close event
   tennisArber.closed.pipe(take(1)).subscribe(() => {
     process.exit(0);
   });
   ```

---

### Example

The following example demonstrates Surebet's output when identifying arbitrage opportunities:

<p align="center">
  <img src="https://github.com/user-attachments/assets/16d53304-66f5-4536-9416-a0f6a9c73560" alt="shell example" width="550"/>
</p>

---

## Customization

### Custom Arbers

Surebet supports custom arbitrage strategies. You can implement your own by extending the base `Arber` class. Examples of predefined arbers include:
- [H2H Arber](src/app/arbers/h2h/h2h-arber.ts) for head-to-head markets like tennis or MMA.
- [1x2 Arber](src/app/arbers/h2h/1x2.arber.ts) for soccer markets.

To create a custom arber:
1. Extend the base `Arber` class.
2. Implement your strategy logic based on your requirements.

### Custom Retrievers

Retrievers are responsible for fetching live betting opportunities from sources or bookmakers. Surebet supports retrievers from various sources, such as APIs, websockets, or browser automation tools like Puppeteer.

To create a custom retriever:
1. Implement a retriever function that conforms to the common interface.
2. Use the retriever in your arber setup.

Example retriever for a custom source:
```ts
const customRetriever = {
  bookie: customBookieInstance,
  retriever: () => customBookieInstance.repo().live.soccer.h2h(),
};
```

---

## Build and Run

To build and run the project, use the following commands:

```bash
# Build the project
npm run build

# Run tests (optional)
npm test

# Start the application
npm start
```

---

## License

Surebet is licensed under the [MIT License](https://github.com/danielcardeenas/surebet/blob/master/LICENSE). Feel free to use, modify, and distribute the software as per the license terms.

---

For more details, visit the [Surebet Repository](https://github.com/danielcardeenas/surebet).

## 🖥️ Working example


https://github.com/user-attachments/assets/9283abda-3a35-4de4-a237-0c877d20e8a6
