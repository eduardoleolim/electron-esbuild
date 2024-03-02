import { ElectronConfig } from './ElectronConfig.mjs';

export interface ElectronConfigParser {
  /**
   * Parse a file and return the parsed object
   * @param {string} sourcePath - The path to the file to parse
   * @throws {Error} - If the source is not valid
   * @returns {ElectronConfig} - The parsed object
   */
  parse(sourcePath: string): ElectronConfig;
}
