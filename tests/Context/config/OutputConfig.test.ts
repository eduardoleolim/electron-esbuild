import { OutputConfig } from '../../../src/Context/config/domain/OutputConfig';
import {
  invalidAbsolutePathConfigData,
  invalidDirectoryConfigData,
  invalidFilenameConfigData,
  validConfigData,
} from './ConfigData';

describe('OutputConfig module', () => {
  test('Parse from json', () => {
    try {
      const jsonParsed = JSON.parse(validConfigData);
      const outputConfig = OutputConfig.fromJson(jsonParsed);

      expect(outputConfig.directory).toBe(jsonParsed.directory);
      expect(outputConfig.filename).toBe(jsonParsed.filename);
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

  test('Invalid directory', () => {
    try {
      const jsonParsed = JSON.parse(invalidDirectoryConfigData);
      OutputConfig.fromJson(jsonParsed);

      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.message).toBe('OutputConfig.fromJson: directory must be a string');
    }
  });

  test('Invalid directory, absolute path', () => {
    try {
      const jsonParsed = JSON.parse(invalidAbsolutePathConfigData);
      OutputConfig.fromJson(jsonParsed);

      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.message).toBe('OutputConfig.fromJson: directory must be a relative path');
    }
  });

  test('Invalid filename', () => {
    try {
      const jsonParsed = JSON.parse(invalidFilenameConfigData);
      OutputConfig.fromJson(jsonParsed);

      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.message).toBe('OutputConfig.fromJson: filename must be a string');
    }
  });
});