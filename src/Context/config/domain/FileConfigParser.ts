export interface FileConfigParser {
  /**
   * Parse a file and return the parsed object
   * @param {string} path - Path to the file to parse
   * @throws {Error} - If the file is not found
   * @returns {any} - The parsed object
   */
  parse(path: string): any;
}
