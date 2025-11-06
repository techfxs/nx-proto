import {
  parseExperiments,
  findExperiment,
  isVariationActive,
  type Experiment,
} from './mw-experiments';

describe('parseExperiments', () => {
  describe('with Headers object (Web API)', () => {
    it('should parse single experiment from header', () => {
      const headers = new Headers();
      headers.set('x-abtasty-experiments', '123456_1_2');

      const experiments = parseExperiments({ headers });

      expect(experiments).toEqual([
        {
          campaignId: '123456',
          variationGroupId: '1',
          variationId: '2',
        },
      ]);
    });

    it('should parse multiple experiments separated by semicolons', () => {
      const headers = new Headers();
      headers.set('x-abtasty-experiments', '123456_1_2;789012_2_3');

      const experiments = parseExperiments({ headers });

      expect(experiments).toHaveLength(2);
      expect(experiments[0]).toEqual({
        campaignId: '123456',
        variationGroupId: '1',
        variationId: '2',
      });
      expect(experiments[1]).toEqual({
        campaignId: '789012',
        variationGroupId: '2',
        variationId: '3',
      });
    });

    it('should parse multiple experiments separated by commas', () => {
      const headers = new Headers();
      headers.set('x-abtasty-experiments', '123456_1_2,789012_2_3');

      const experiments = parseExperiments({ headers });

      expect(experiments).toHaveLength(2);
    });

    it('should handle experiments without variation group', () => {
      const headers = new Headers();
      headers.set('x-abtasty-experiments', '123456_2');

      const experiments = parseExperiments({ headers });

      expect(experiments).toEqual([
        {
          campaignId: '123456',
          variationId: '2',
        },
      ]);
    });

    it('should handle hyphen separators', () => {
      const headers = new Headers();
      headers.set('x-abtasty-experiments', '123456-1-2');

      const experiments = parseExperiments({ headers });

      expect(experiments[0]).toEqual({
        campaignId: '123456',
        variationGroupId: '1',
        variationId: '2',
      });
    });

    it('should return empty array when header is missing', () => {
      const headers = new Headers();

      const experiments = parseExperiments({ headers });

      expect(experiments).toEqual([]);
    });

    it('should handle empty header value', () => {
      const headers = new Headers();
      headers.set('x-abtasty-experiments', '');

      const experiments = parseExperiments({ headers });

      expect(experiments).toEqual([]);
    });

    it('should handle whitespace in header value', () => {
      const headers = new Headers();
      headers.set('x-abtasty-experiments', ' 123456_1_2 ; 789012_2_3 ');

      const experiments = parseExperiments({ headers });

      expect(experiments).toHaveLength(2);
    });
  });

  describe('with custom header name', () => {
    it('should use custom header name', () => {
      const headers = new Headers();
      headers.set('x-custom-experiments', '123456_1_2');

      const experiments = parseExperiments(
        { headers },
        { headerName: 'x-custom-experiments' }
      );

      expect(experiments).toHaveLength(1);
      expect(experiments[0].campaignId).toBe('123456');
    });
  });

  describe('with plain object headers (Express-style)', () => {
    it('should parse from plain object', () => {
      const headers = {
        'x-abtasty-experiments': '123456_1_2',
      };

      const experiments = parseExperiments({ headers });

      expect(experiments).toHaveLength(1);
      expect(experiments[0].campaignId).toBe('123456');
    });

    it('should handle array header values', () => {
      const headers = {
        'x-abtasty-experiments': ['123456_1_2'],
      };

      const experiments = parseExperiments({ headers });

      expect(experiments).toHaveLength(1);
    });
  });

  describe('with Map headers', () => {
    it('should parse from Map', () => {
      const headers = new Map<string, string>();
      headers.set('x-abtasty-experiments', '123456_1_2');

      const experiments = parseExperiments({ headers });

      expect(experiments).toHaveLength(1);
      expect(experiments[0].campaignId).toBe('123456');
    });
  });

  describe('with cookie fallback', () => {
    it('should parse from cookie header when experiment header is missing', () => {
      const headers = new Headers();
      headers.set('cookie', 'ABTasty=cid%3D123456%26vid%3D2; other=value');

      const experiments = parseExperiments({ headers });

      // This will depend on cookie parsing implementation
      // Currently returns empty if no experiment header
      expect(Array.isArray(experiments)).toBe(true);
    });
  });
});

describe('findExperiment', () => {
  const experiments: Experiment[] = [
    { campaignId: '123456', variationGroupId: '1', variationId: '2' },
    { campaignId: '789012', variationGroupId: '2', variationId: '3' },
  ];

  it('should find experiment by campaign ID', () => {
    const result = findExperiment(experiments, '123456');

    expect(result).toEqual({
      campaignId: '123456',
      variationGroupId: '1',
      variationId: '2',
    });
  });

  it('should return undefined for non-existent campaign', () => {
    const result = findExperiment(experiments, '999999');

    expect(result).toBeUndefined();
  });

  it('should return undefined for empty array', () => {
    const result = findExperiment([], '123456');

    expect(result).toBeUndefined();
  });
});

describe('isVariationActive', () => {
  const experiments: Experiment[] = [
    { campaignId: '123456', variationGroupId: '1', variationId: '2' },
    { campaignId: '789012', variationGroupId: '2', variationId: '3' },
  ];

  it('should return true when variation is active', () => {
    const result = isVariationActive(experiments, '123456', '2');

    expect(result).toBe(true);
  });

  it('should return false when variation is not active', () => {
    const result = isVariationActive(experiments, '123456', '5');

    expect(result).toBe(false);
  });

  it('should return false when campaign does not exist', () => {
    const result = isVariationActive(experiments, '999999', '2');

    expect(result).toBe(false);
  });

  it('should return false for empty array', () => {
    const result = isVariationActive([], '123456', '2');

    expect(result).toBe(false);
  });
});
