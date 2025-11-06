/**
 * Example usage of mw-experiments with Next.js
 *
 * This file demonstrates how to use the AB Tasty experiment parser
 * in different Next.js contexts.
 */

import { parseExperiments, findExperiment, isVariationActive } from '../index';
import type { NextRequest } from 'next/server';

/**
 * Example 1: Using in Next.js API Route (App Router)
 */
export async function GET(request: NextRequest) {
  // Parse all active experiments
  const experiments = parseExperiments({ headers: request.headers });

  return Response.json({
    experiments,
    count: experiments.length,
  });
}

/**
 * Example 2: Middleware for experiment-based routing
 */
export function middleware(request: NextRequest) {
  const experiments = parseExperiments({ headers: request.headers });

  // Check if user is in a specific experiment variant
  if (isVariationActive(experiments, '123456', '2')) {
    // Redirect to variant B page
    return Response.redirect(new URL('/variant-b', request.url));
  }

  // Continue to control version
  return Response.next();
}

/**
 * Example 3: Server Component with experiment detection
 */
export async function ExperimentAwareComponent({
  headers
}: {
  headers: Headers
}) {
  const experiments = parseExperiments({ headers });

  // Find a specific experiment
  const heroExperiment = findExperiment(experiments, '123456');

  if (heroExperiment?.variationId === '2') {
    return <div>Variant B Hero</div>;
  }

  return <div>Control Hero</div>;
}

/**
 * Example 4: Conditional feature flag based on experiment
 */
export function getFeatureFlags(request: NextRequest) {
  const experiments = parseExperiments({ headers: request.headers });

  return {
    newCheckoutFlow: isVariationActive(experiments, '789012', '1'),
    enhancedSearch: isVariationActive(experiments, '345678', '2'),
    experiments: experiments.map(exp => ({
      id: exp.campaignId,
      variant: exp.variationId,
    })),
  };
}

/**
 * Example 5: API route that sets experiment context
 */
export async function POST(request: NextRequest) {
  const experiments = parseExperiments({ headers: request.headers });

  // Log experiments for analytics
  console.log('User experiments:', experiments);

  // Process request with experiment context
  const body = await request.json();

  return Response.json({
    success: true,
    experimentContext: experiments,
    data: body,
  });
}

