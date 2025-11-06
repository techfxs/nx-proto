# mw-experiments Library - Implementation Summary

## ✅ What Was Created

### 1. New Library: `@nx-proto/mw-experiments`
Located at: `packages/mw-experiments/`

A fully-featured TypeScript library for parsing and managing AB Tasty experiments from HTTP request headers.

### 2. Core Features

#### Main Functions:
- **`parseExperiments(request, options?)`** - Parses AB Tasty experiment data from request headers
- **`findExperiment(experiments, campaignId)`** - Finds a specific experiment by campaign ID
- **`isVariationActive(experiments, campaignId, variationId)`** - Checks if a specific variation is active

#### Types:
- **`Experiment`** - Interface representing an active experiment
- **`ParseExperimentsOptions`** - Configuration options for parsing

### 3. Supported Header Types
- Web API Headers (Next.js, Fetch API)
- Express-style plain objects
- Map-based headers
- Cookie fallback (ABTasty cookie parsing)

### 4. Supported AB Tasty Formats
- `campaignId_variationGroupId_variationId` (e.g., `123456_1_2`)
- `campaignId_variationId` (e.g., `123456_2`)
- Multiple experiments: `123456_1_2;789012_2_3` (semicolon or comma separated)
- Hyphen separators: `123456-1-2`

### 5. Test Coverage
✅ 20 passing tests covering:
- Single and multiple experiment parsing
- Different header types (Headers, Map, Object)
- Multiple separators (semicolons, commas)
- Custom header names
- Edge cases (empty values, whitespace, missing data)
- Helper functions (findExperiment, isVariationActive)

### 6. Integration Examples

#### API Route
Created: `apps/mw-home/src/app/api/experiments/route.ts`
- GET endpoint that returns all active experiments
- Example usage of all helper functions

#### Server Component
Created: `apps/mw-home/src/app/experiments/page.tsx`
- Demonstrates conditional rendering based on experiments
- Shows debug information
- Uses Next.js 15 `headers()` API

#### Example Code
Created: `packages/mw-experiments/src/examples/next-js-example.ts`
- Multiple usage patterns with Next.js
- Middleware example
- Feature flag examples

### 7. Configuration Updates

#### TypeScript Configuration
- ✅ Updated `tsconfig.base.json` with path mapping
- ✅ Updated `apps/mw-home/tsconfig.json` with references
- ✅ All TypeScript errors resolved

#### Package Structure
```
packages/mw-experiments/
├── src/
│   ├── index.ts                    # Main exports
│   ├── lib/
│   │   ├── mw-experiments.ts      # Implementation
│   │   └── mw-experiments.spec.ts # Tests
│   └── examples/
│       └── next-js-example.ts     # Usage examples
├── README.md                       # Comprehensive documentation
├── package.json                    # Package configuration
├── tsconfig.json                   # TypeScript config
├── tsconfig.lib.json              # Library-specific config
├── jest.config.ts                 # Jest configuration
└── eslint.config.mjs              # ESLint configuration
```

## 🚀 How to Use

### Basic Usage in Next.js API Route
```typescript
import { parseExperiments } from '@nx-proto/mw-experiments';

export async function GET(request: Request) {
  const experiments = parseExperiments({ headers: request.headers });
  return Response.json({ experiments });
}
```

### Conditional Rendering in Server Component
```typescript
import { parseExperiments, isVariationActive } from '@nx-proto/mw-experiments';
import { headers } from 'next/headers';

export default async function Page() {
  const headersList = await headers();
  const experiments = parseExperiments({ headers: headersList });
  
  if (isVariationActive(experiments, '123456', '2')) {
    return <VariantB />;
  }
  return <Control />;
}
```

### Testing with cURL
```bash
# Test the API endpoint
curl -H "x-abtasty-experiments: 123456_1_2;789012_2_1" \
  http://localhost:3000/api/experiments

# Test the experiments page
curl -H "x-abtasty-experiments: 123456_1_2;789012_2_1" \
  http://localhost:3000/experiments
```

## 📝 Testing

Run tests:
```bash
npx nx test mw-experiments
```

All 20 tests passing! ✅

## 📚 Documentation

Full documentation available in `packages/mw-experiments/README.md` including:
- Installation instructions
- API reference
- Usage examples
- Supported formats
- Type definitions

## 🎯 Next Steps

1. **Start the dev server**: `npx nx dev mw-home`
2. **Visit test pages**:
   - `/api/experiments` - API endpoint
   - `/experiments` - Demo page with conditional rendering
3. **Add AB Tasty header** to requests to test experiment detection
4. **Integrate** into your actual pages and components

## ✨ Features Included

- ✅ Full TypeScript support with strict typing
- ✅ Comprehensive test coverage (20 tests)
- ✅ Multiple header format support
- ✅ Cookie fallback support
- ✅ Helper utilities for common use cases
- ✅ Next.js integration examples
- ✅ Complete documentation
- ✅ Zero dependencies (uses only built-in APIs)
- ✅ ESM module format
- ✅ Nx monorepo integration

