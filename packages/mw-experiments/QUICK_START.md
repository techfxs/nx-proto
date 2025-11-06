# Quick Start Guide - mw-experiments

## 🚀 Quick Setup (2 minutes)

### 1. Import in your Next.js app
```typescript
import { parseExperiments, isVariationActive } from '@nx-proto/mw-experiments';
import { headers } from 'next/headers';
```

### 2. Use in Server Component
```typescript
export default async function MyPage() {
  const headersList = await headers();
  const experiments = parseExperiments({ headers: headersList });
  
  const showNewFeature = isVariationActive(experiments, 'campaign-123', 'variant-2');
  
  return (
    <div>
      {showNewFeature ? <NewFeature /> : <OldFeature />}
    </div>
  );
}
```

### 3. Use in API Route
```typescript
export async function GET(request: Request) {
  const experiments = parseExperiments({ headers: request.headers });
  return Response.json({ experiments });
}
```

## 🧪 Testing Locally

### With Browser DevTools or Postman
Add this header to your request:
```
x-abtasty-experiments: 123456_1_2;789012_2_3
```

### With cURL
```bash
curl -H "x-abtasty-experiments: 123456_1_2" http://localhost:3000/api/experiments
```

### Test Pages Already Created
1. Start dev server: `npx nx dev mw-home`
2. Visit:
   - `http://localhost:3000/api/experiments` - API endpoint
   - `http://localhost:3000/experiments` - Demo page

## 📋 Common Patterns

### Pattern 1: A/B Test Hero Section
```typescript
const experiments = parseExperiments({ headers: await headers() });
const heroVariant = findExperiment(experiments, 'hero-test-123');

return heroVariant?.variationId === '2' ? <HeroV2 /> : <HeroV1 />;
```

### Pattern 2: Feature Flag
```typescript
const experiments = parseExperiments({ headers: await headers() });
const newCheckoutEnabled = isVariationActive(experiments, '789012', '1');

if (newCheckoutEnabled) {
  // Show new checkout flow
}
```

### Pattern 3: Multiple Experiments
```typescript
const experiments = parseExperiments({ headers: await headers() });

const config = {
  newHero: isVariationActive(experiments, 'exp-1', 'var-2'),
  newCTA: isVariationActive(experiments, 'exp-2', 'var-1'),
  enhancedSearch: isVariationActive(experiments, 'exp-3', 'var-3'),
};
```

## 🎯 AB Tasty Header Format

Your header should look like:
```
x-abtasty-experiments: campaignId_variationGroupId_variationId
```

Examples:
- Single: `123456_1_2`
- Multiple: `123456_1_2;789012_2_3`
- No group: `123456_2`
- Hyphens: `123456-1-2`

## ✅ Verification

Run these commands to verify everything works:
```bash
# Tests
npx nx test mw-experiments

# Lint
npx nx lint mw-experiments

# Check integration
npx nx dev mw-home
```

## 📚 Full Documentation

See `README.md` for complete API reference and advanced usage.

## 🐛 Troubleshooting

**Problem**: "Cannot find module '@nx-proto/mw-experiments'"
**Solution**: Make sure tsconfig has the reference:
```json
"references": [
  { "path": "../../packages/mw-experiments/tsconfig.lib.json" }
]
```

**Problem**: No experiments detected
**Solution**: Check that header name matches (default: `x-abtasty-experiments`)
```typescript
parseExperiments({ headers }, { headerName: 'your-custom-header' })
```

