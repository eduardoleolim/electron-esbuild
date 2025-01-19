import { JsonElectronConfigParser } from '../../../src/Context/config/infrastructure/JsonElectronConfigParser.mjs';
import { invalidDirectoryConfigData, invalidFilenameConfigData, validConfigData } from './ConfigData';

describe('OutputConfig module', () => {
  const jsonParser = new JsonElectronConfigParser();

  test('Parse from json', () => {
    try {
      const jsonParsed = JSON.parse(validConfigData);
      const outputConfig = jsonParser.parseOutputConfig(jsonParsed);

      expect(outputConfig.directory).toBe(jsonParsed.directory);
      expect(outputConfig.filename).toBe(jsonParsed.filename);
    } catch (error: unknown) {
      fail(`Error: ${error}`);
    }
  });

  test('Invalid output config', () => {
    try {
      jsonParser.parseOutputConfig(undefined);

      fail('Invalid output config should throw an error');
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        fail(`Other type of error: ${error}`);
      }

      expect(error.message).toBe('Output config is required');
    }

    try {
      jsonParser.parseOutputConfig(null);

      fail('Invalid output config should throw an error');
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        fail(`Other type of error: ${error}`);
      }

      expect(error.message).toBe('Output config is required');
    }

    try {
      jsonParser.parseOutputConfig(1);

      fail('Invalid output config should throw an error');
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        fail(`Other type of error: ${error}`);
      }

      expect(error.message).toBe('Output config is required');
    }

    try {
      jsonParser.parseOutputConfig('string');

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
      jsonParser.parseOutputConfig(jsonParsed);

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
      jsonParser.parseOutputConfig(jsonParsed);

      fail('Invalid filename should throw an error');
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        fail(`Other type of error: ${error}`);
      }

      expect(error.message).toBe('Output file name must be a string');
    }
  });
});
