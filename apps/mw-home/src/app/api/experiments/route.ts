import { parseExperiments, findExperiment, isVariationActive } from '@nx-proto/mw-experiments';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/experiments
 * Returns all active AB Tasty experiments from the request headers
 */
export async function GET(request: NextRequest) {
  // Parse experiments from request headers
  const experiments = parseExperiments({ headers: request.headers });

  // Example: Check if a specific experiment is active
  const heroExperiment = findExperiment(experiments, '123456');

  // Example: Check if a specific variation is active
  const isNewCheckoutActive = isVariationActive(experiments, '789012', '1');

  return NextResponse.json({
    experiments,
    count: experiments.length,
    examples: {
      heroExperiment,
      isNewCheckoutActive,
    },
    message: experiments.length > 0
      ? `Found ${experiments.length} active experiment(s)`
      : 'No active experiments found. Add x-abtasty-experiments header to test.',
  });
}

