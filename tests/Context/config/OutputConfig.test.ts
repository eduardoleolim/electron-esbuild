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
    } catch (error: any) {
      throw error.message;
    }
  });

  test('Invalid directory', () => {
    try {
      const jsonParsed = JSON.parse(invalidDirectoryConfigData);
      jsonParser.parseOutputConfig(jsonParsed);

      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.message).toBe('Output directory must be a string');
    }
  });

  test('Invalid filename', () => {
    try {
      const jsonParsed = JSON.parse(invalidFilenameConfigData);
      jsonParser.parseOutputConfig(jsonParsed);

      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.message).toBe('Output file name must be a string');
    }
  });
});
