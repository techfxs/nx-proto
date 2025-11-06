import { parseExperiments, isVariationActive } from '@nx-proto/mw-experiments';
import { headers } from 'next/headers';

/**
 * Example Server Component that uses AB Tasty experiments
 * to conditionally render different content
 */
export default async function ExperimentPage() {
  // Get headers in Next.js 15 App Router
  const headersList = await headers();

  // Parse experiments from request
  const experiments = parseExperiments({ headers: headersList });

  // Check for specific experiment variations
  const showNewHero = isVariationActive(experiments, '123456', '2');
  const showEnhancedCTA = isVariationActive(experiments, '789012', '1');

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Experiment Demo Page</h1>

      {/* Conditional rendering based on experiments */}
      {showNewHero ? (
        <div className="bg-blue-500 text-white p-8 rounded-lg mb-4">
          <h2 className="text-2xl mb-2">New Hero Design (Variant B)</h2>
          <p>You are seeing the experimental hero design!</p>
        </div>
      ) : (
        <div className="bg-gray-500 text-white p-8 rounded-lg mb-4">
          <h2 className="text-2xl mb-2">Original Hero Design (Control)</h2>
          <p>You are seeing the control version.</p>
        </div>
      )}

      {/* Another conditional section */}
      <div className="bg-white border p-6 rounded-lg mb-4">
        <h3 className="text-xl mb-2">Call to Action</h3>
        {showEnhancedCTA ? (
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg">
            Enhanced CTA Button (Variant)
          </button>
        ) : (
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Standard CTA Button (Control)
          </button>
        )}
      </div>

      {/* Debug information */}
      <div className="bg-gray-100 p-4 rounded mt-8">
        <h3 className="font-bold mb-2">Active Experiments:</h3>
        {experiments.length > 0 ? (
          <ul className="list-disc list-inside">
            {experiments.map((exp) => (
              <li key={exp.campaignId}>
                Campaign: {exp.campaignId}, Variation: {exp.variationId}
                {exp.variationGroupId && `, Group: ${exp.variationGroupId}`}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">
            No active experiments found. To test, add the header:
            <code className="block bg-white p-2 mt-2 rounded">
              x-abtasty-experiments: 123456_1_2;789012_2_1
            </code>
          </p>
        )}
      </div>
    </div>
  );
}

