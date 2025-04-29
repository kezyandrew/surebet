# Soccer H2H Implementation for Bookmaker

This directory contains the implementation for soccer Head-to-Head (H2H) betting for the Bookmaker bookie.

## Implementation Details

The implementation follows the same pattern as the other sports implementations:

- `SoccerH2H` class with static methods for navigation and data extraction
- Methods to navigate to the soccer section of the Bookmaker site
- Methods to extract soccer matches and their odds

## Usage

Once TypeScript recognizes the implementation, you can use it in `src/index.ts` as follows:

```typescript
// In index.ts
const retrievers = [
  // Other retrievers...
  {
    bookie: bookmaker,
    retriever: () => bookmaker.repo().live.soccer.h2h(),
  },
];
```

## Troubleshooting

### TypeScript Type Issues

If TypeScript doesn't recognize the soccer implementation, you might see errors like:

```
Property 'soccer' does not exist on type '{ tennis: { h2h: () => Promise<BetEvent[]>; }; }'.
```

This is because TypeScript's type definitions haven't been updated to include the new soccer implementation. There are a few possible solutions:

1. **Rebuild TypeScript declarations**: Try running `npx tsc --declaration --emitDeclarationOnly` to regenerate type definitions.

2. **Temporary workaround**: Use the tennis implementation while the soccer code is being developed:

```typescript
// In index.ts
const retrievers = [
  {
    bookie: bookmaker,
    // Use tennis as a temporary workaround
    retriever: () => bookmaker.repo().live.tennis.h2h(),
  },
];
```

3. **Direct class usage**: Import and use the class directly (advanced, not recommended for production):

```typescript
import { SoccerH2H } from '@bookmaker/repository/live/soccer/soccer-h2h';

// In your code
const retrievers = [
  {
    bookie: bookmaker,
    retriever: () => {
      // Assuming these properties exist
      return SoccerH2H.get(somePageObject, someBrowserObject);
    },
  },
];
```

## Selector Information

The implementation tries multiple possible selectors for soccer:

- `.sports-controls [cat="SOCCER"]`
- `.sports-controls [cat="soccer"]`
- `.sports-controls [cat="FOOTBALL"]`
- `.sports-controls [cat="football"]`
- `.sports-controls [cat="Soccer"]`
- `.sports-controls [cat="Football"]`

If none of these match, it will search all controls for anything containing "soccer", "football", or "futbol" in the cat attribute.
