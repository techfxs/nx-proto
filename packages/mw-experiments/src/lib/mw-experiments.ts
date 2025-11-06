/**
 * Represents an active AB Tasty experiment
 */
export interface Experiment {
  /** The campaign/experiment ID */
  campaignId: string;
  /** The variation ID */
  variationId: string;
  /** The variation group ID (if available) */
  variationGroupId?: string;
}

/**
 * Configuration options for parsing AB Tasty experiments
 */
export interface ParseExperimentsOptions {
  /** The header name to look for. Defaults to 'x-abtasty-experiments' */
  headerName?: string;
  /** Whether to include empty experiments. Defaults to false */
  includeEmpty?: boolean;
}

/**
 * Parses AB Tasty experiment data from a request header.
 *
 * AB Tasty typically stores experiment data in a header with format:
 * - Cookie format: campaignId_variationGroupId_variationId
 * - Multiple experiments separated by semicolons or commas
 *
 * Example header values:
 * - "123456_1_2" (single experiment)
 * - "123456_1_2;789012_2_3" (multiple experiments)
 * - "123456_1_2,789012_2_3" (comma-separated)
 *
 * @param request - Request object with headers (e.g., Next.js Request, Express Request, or Headers object)
 * @param options - Optional configuration
 * @returns Array of active experiments
 */
export function parseExperiments(
  request: { headers: Headers | Map<string, string> | Record<string, string | string[] | undefined> },
  options: ParseExperimentsOptions = {}
): Experiment[] {
  const { headerName = 'x-abtasty-experiments', includeEmpty = false } = options;

  const experiments: Experiment[] = [];

  // Get header value from different header types
  let headerValue: string | null = null;

  if (request.headers instanceof Headers) {
    // Web API Headers (Next.js, Fetch API)
    headerValue = request.headers.get(headerName);
  } else if (request.headers instanceof Map) {
    // Map-based headers
    headerValue = request.headers.get(headerName) || null;
  } else {
    // Plain object (Express-style)
    const value = request.headers[headerName];
    headerValue = Array.isArray(value) ? value[0] : value || null;
  }

  // Also check for AB Tasty cookie
  if (!headerValue) {
    const cookieHeader = getCookieHeader(request.headers);
    if (cookieHeader) {
      headerValue = parseABTastyCookie(cookieHeader);
    }
  }

  if (!headerValue) {
    return experiments;
  }

  // Split by semicolon or comma
  const experimentStrings = headerValue.split(/[;,]/).map(s => s.trim()).filter(Boolean);

  for (const expString of experimentStrings) {
    const experiment = parseExperimentString(expString);
    if (experiment && (includeEmpty || experiment.campaignId)) {
      experiments.push(experiment);
    }
  }

  return experiments;
}

/**
 * Parses a single experiment string in the format: campaignId_variationGroupId_variationId
 * or campaignId-variationGroupId-variationId
 */
function parseExperimentString(expString: string): Experiment | null {
  if (!expString) return null;

  // Handle both underscore and hyphen separators
  const parts = expString.split(/[_-]/);

  if (parts.length === 3) {
    return {
      campaignId: parts[0],
      variationGroupId: parts[1],
      variationId: parts[2],
    };
  } else if (parts.length === 2) {
    return {
      campaignId: parts[0],
      variationId: parts[1],
    };
  } else if (parts.length === 1 && parts[0]) {
    // Single value, treat as campaign ID
    return {
      campaignId: parts[0],
      variationId: '0',
    };
  }

  return null;
}

/**
 * Gets the cookie header value from different header types
 */
function getCookieHeader(
  headers: Headers | Map<string, string> | Record<string, string | string[] | undefined>
): string | null {
  if (headers instanceof Headers) {
    return headers.get('cookie');
  } else if (headers instanceof Map) {
    return headers.get('cookie') || null;
  } else {
    const value = headers['cookie'];
    return Array.isArray(value) ? value[0] : value || null;
  }
}

/**
 * Parses AB Tasty experiment data from cookie header
 * AB Tasty typically uses cookies like: ABTasty=campaignId:variationGroupId:variationId
 */
function parseABTastyCookie(cookieHeader: string): string | null {
  // Look for ABTasty cookie or ABTastySession
  const abTastyMatch = cookieHeader.match(/ABTasty(?:Session)?=([^;]+)/);
  if (!abTastyMatch) return null;

  const cookieValue = decodeURIComponent(abTastyMatch[1]);

  // Extract experiment data from cookie value
  // Common format: uid=xxx&fst=xxx&pst=xxx&cst=xxx&ns=xxx&pvt=xxx&cid=campaignId

  // Look for campaign and variation pairs
  const campaignMatch = cookieValue.match(/cid=([^&]+)/);
  const variationMatch = cookieValue.match(/vid=([^&]+)/);

  if (campaignMatch && variationMatch) {
    return `${campaignMatch[1]}_${variationMatch[1]}`;
  }

  return null;
}

/**
 * Checks if a specific experiment is active
 *
 * @param experiments - Array of experiments from parseExperiments
 * @param campaignId - The campaign ID to check for
 * @returns The experiment if found, undefined otherwise
 */
export function findExperiment(
  experiments: Experiment[],
  campaignId: string
): Experiment | undefined {
  return experiments.find(exp => exp.campaignId === campaignId);
}

/**
 * Checks if a specific variation is active for a campaign
 *
 * @param experiments - Array of experiments from parseExperiments
 * @param campaignId - The campaign ID to check
 * @param variationId - The variation ID to check
 * @returns True if the variation is active
 */
export function isVariationActive(
  experiments: Experiment[],
  campaignId: string,
  variationId: string
): boolean {
  const experiment = findExperiment(experiments, campaignId);
  return experiment?.variationId === variationId;
}
