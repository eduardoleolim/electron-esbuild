import { OutputConfig } from '../../../src/Context/config/domain/OutputConfig.mjs';
import { CustomResourceConfig, SimpleResourceConfig } from '../../../src/Context/config/domain/ResourceConfig.mjs';
import {
  invalidFromResourcesConfigData,
  invalidToResourcesConfigData,
  validCustomResourceConfigData
} from './ConfigData';
import { InMemoryConfigParser } from './InMemoryConfigParser';

describe('ResourceConfig module', () => {
  const configParser = new InMemoryConfigParser();

  test('Invalid resource config', () => {
    try {
      configParser.parseResourceConfig(undefined, 'output');

      fail('Invalid resource config should throw an error');
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        fail(`Other type of error: ${error}`);
      }

      expect(error.message).toBe('Resource config is required');
    }

    try {
      configParser.parseResourceConfig(null, 'output');

      fail('Invalid resource config should throw an error');
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        fail(`Other type of error: ${error}`);
      }

      expect(error.message).toBe('Resource config is required');
    }

    try {
      configParser.parseResourceConfig(1, 'output');

      fail('Invalid resource config should throw an error');
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        fail(`Other type of error: ${error}`);
      }

      expect(error.message).toBe('Resource config is required');
    }
  });

  test('Invalid from', () => {
    try {
      const jsonParsed = JSON.parse(invalidFromResourcesConfigData);
      configParser.parseResourceConfig(jsonParsed, 'output');
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        fail(`Other type of error: ${error}`);
      }

      expect(error.message).toBe('Resource from is required and must be a string');
    }
  });

  test('Invalid to', () => {
    try {
      const jsonParsed = JSON.parse(invalidToResourcesConfigData);
      configParser.parseResourceConfig(jsonParsed, 'output');
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        fail(`Other type of error: ${error}`);
      }

      // Error thrown by the parseOutputConfig method used in the parseResourceConfig method
      expect(error.message).toBe('Output config is required');
    }
  });

  test('Valid simple resource config', () => {
    const resourceConfig = configParser.parseResourceConfig('from', 'output');

    expect(resourceConfig).toBeInstanceOf(SimpleResourceConfig);
    const config = resourceConfig as SimpleResourceConfig;
    expect(config.from).toBe('from');
    expect(config.to).toBe('output');
  });

  test('Valid custom resource config', () => {
    const jsonParsed = JSON.parse(validCustomResourceConfigData);
    const resourceConfig = configParser.parseResourceConfig(jsonParsed, 'output');

    expect(resourceConfig).toBeInstanceOf(CustomResourceConfig);
    const config = resourceConfig as CustomResourceConfig;
    expect(config.from).toBe('from/file.ext');
    expect(config.output).toBeInstanceOf(OutputConfig);

    const outputConfig = config.output as OutputConfig;

    expect(outputConfig.directory).toBe('out_dir');
    expect(outputConfig.filename).toBe('out_file.ext');
  });
});
