# mw-experiments

A TypeScript library for parsing and managing AB Tasty experiments from HTTP request headers.

## Features

- 🔍 Parse AB Tasty experiment data from request headers
- 🍪 Fallback to cookie parsing when headers are unavailable
- 🎯 Helper functions to find and check active experiments
- 🔧 Support for multiple header types (Web API Headers, Express-style objects, Map)
- ✅ Fully typed with TypeScript
- 🧪 Comprehensive test coverage

## Installation

This library is part of the `@nx-proto` monorepo. To use it in your project, add it as a dependency:

```typescript
import { parseExperiments, findExperiment, isVariationActive } from '@nx-proto/mw-experiments';
```

## Usage

### Basic Usage

```typescript
import { parseExperiments } from '@nx-proto/mw-experiments';

// In a Next.js API route or server component
export async function GET(request: Request) {
  const experiments = parseExperiments({ headers: request.headers });
  
  console.log('Active experiments:', experiments);
  // Output: [{ campaignId: '123456', variationGroupId: '1', variationId: '2' }]
  
  return Response.json({ experiments });
}
```

### Finding a Specific Experiment

```typescript
import { parseExperiments, findExperiment } from '@nx-proto/mw-experiments';

const experiments = parseExperiments({ headers: request.headers });
const myExperiment = findExperiment(experiments, '123456');

if (myExperiment) {
  console.log(`User is in variation ${myExperiment.variationId}`);
}
```

### Checking if a Variation is Active

```typescript
import { parseExperiments, isVariationActive } from '@nx-proto/mw-experiments';

const experiments = parseExperiments({ headers: request.headers });

if (isVariationActive(experiments, '123456', '2')) {
  // User is in variation 2 of campaign 123456
  console.log('Showing variant B');
} else {
  console.log('Showing control');
}
```

### Custom Header Name

```typescript
const experiments = parseExperiments(
  { headers: request.headers },
  { headerName: 'x-custom-experiments' }
);
```

### With Express

```typescript
import { Request, Response } from 'express';

app.get('/api/experiments', (req: Request, res: Response) => {
  const experiments = parseExperiments({ headers: req.headers });
  res.json({ experiments });
});
```

## AB Tasty Header Format

The library expects experiment data in the following format:

- **Single experiment**: `campaignId_variationGroupId_variationId`
  - Example: `123456_1_2`
  
- **Multiple experiments**: Separated by semicolons or commas
  - Example: `123456_1_2;789012_2_3`
  - Example: `123456_1_2,789012_2_3`

- **Without variation group**: `campaignId_variationId`
  - Example: `123456_2`

- **Alternative format**: Hyphens instead of underscores
  - Example: `123456-1-2`

## API Reference

### `parseExperiments(request, options?)`

Parses AB Tasty experiment data from request headers.

**Parameters:**
- `request`: Object with a `headers` property (Headers, Map, or plain object)
- `options?`: Optional configuration object
  - `headerName?: string` - Custom header name (default: `'x-abtasty-experiments'`)
  - `includeEmpty?: boolean` - Include empty experiments (default: `false`)

**Returns:** `Experiment[]`

### `findExperiment(experiments, campaignId)`

Finds a specific experiment by campaign ID.

**Parameters:**
- `experiments`: Array of experiments from `parseExperiments`
- `campaignId`: The campaign ID to search for

**Returns:** `Experiment | undefined`

### `isVariationActive(experiments, campaignId, variationId)`

Checks if a specific variation is active for a campaign.

**Parameters:**
- `experiments`: Array of experiments from `parseExperiments`
- `campaignId`: The campaign ID to check
- `variationId`: The variation ID to check

**Returns:** `boolean`

## Types

### `Experiment`

```typescript
interface Experiment {
  campaignId: string;
  variationId: string;
  variationGroupId?: string;
}
```

### `ParseExperimentsOptions`

```typescript
interface ParseExperimentsOptions {
  headerName?: string;
  includeEmpty?: boolean;
}
```

## Building

Run `nx build mw-experiments` to build the library.

## Running unit tests

Run `nx test mw-experiments` to execute the unit tests via [Jest](https://jestjs.io).
