import { InMemoryConfigParser } from './InMemoryConfigParser';

describe('LoaderConfig module', () => {
  const configParser = new InMemoryConfigParser();

  test('Invalid loader config', () => {
    try {
      configParser.parseLoaderConfig(undefined);

      fail('Invalid loader config should throw an error');
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        fail(`Other type of error: ${error}`);
      }

      expect(error.message).toBe('Loader config is required');
    }

    try {
      configParser.parseLoaderConfig(null);

      fail('Invalid loader config should throw an error');
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        fail(`Other type of error: ${error}`);
      }

      expect(error.message).toBe('Loader config is required');
    }

    try {
      configParser.parseLoaderConfig(1);

      fail('Invalid loader config should throw an error');
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        fail(`Other type of error: ${error}`);
      }

      expect(error.message).toBe('Loader config is required');
    }

    try {
      configParser.parseLoaderConfig('string');

      fail('Invalid loader config should throw an error');
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        fail(`Other type of error: ${error}`);
      }

      expect(error.message).toBe('Loader config is required');
    }
  });

  test('Invalid extension', () => {
    try {
      configParser.parseLoaderConfig({ extension: 1, loader: 'loader' });

      fail('Invalid loader extension should throw an error');
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        fail(`Other type of error: ${error}`);
      }

      expect(error.message).toBe('Loader extension must be a string');
    }
  });

  test('Invalid loader', () => {
    try {
      configParser.parseLoaderConfig({ extension: 'extension', loader: 1 });

      fail('Invalid loader loader should throw an error');
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        fail(`Other type of error: ${error}`);
      }

      expect(error.message).toBe('Loader loader must be a string');
    }
  });
});
