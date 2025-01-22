import { invalidDirectoryConfigData, invalidFilenameConfigData, validOutputConfig } from './ConfigData';
import { InMemoryConfigParser } from './InMemoryConfigParser';

describe('OutputConfig module', () => {
  const configParser = new InMemoryConfigParser();

  test('Invalid output config', () => {
    try {
      configParser.parseOutputConfig(undefined);

      fail('Invalid output config should throw an error');
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        fail(`Other type of error: ${error}`);
      }

      expect(error.message).toBe('Output config is required');
    }

    try {
      configParser.parseOutputConfig(null);

      fail('Invalid output config should throw an error');
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        fail(`Other type of error: ${error}`);
      }

      expect(error.message).toBe('Output config is required');
    }

    try {
      configParser.parseOutputConfig(1);

      fail('Invalid output config should throw an error');
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        fail(`Other type of error: ${error}`);
      }

      expect(error.message).toBe('Output config is required');
    }

    try {
      configParser.parseOutputConfig('string');

      fail('Invalid output config should throw an error');
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        fail(`Other type of error: ${error}`);
      }

      expect(error.message).toBe('Output config is required');
    }
  });

  test('Invalid directory', () => {
    try {
      const jsonParsed = JSON.parse(invalidDirectoryConfigData);
      configParser.parseOutputConfig(jsonParsed);

      fail('Invalid directory should throw an error');
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        fail(`Other type of error: ${error}`);
      }

      expect(error.message).toBe('Output directory must be a string');
    }
  });

  test('Invalid filename', () => {
    try {
      const jsonParsed: unknown = JSON.parse(invalidFilenameConfigData);
      configParser.parseOutputConfig(jsonParsed);

      fail('Invalid filename should throw an error');
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        fail(`Other type of error: ${error}`);
      }

      expect(error.message).toBe('Output file name must be a string');
    }
  });

  test('Valid output config', () => {
    const jsonParsed = JSON.parse(validOutputConfig);
    const outputConfig = configParser.parseOutputConfig(jsonParsed);

    expect(outputConfig.directory).toBe('out_dir');
    expect(outputConfig.filename).toBe('out_file.ext');
  });
});
