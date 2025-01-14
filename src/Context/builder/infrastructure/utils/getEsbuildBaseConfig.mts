import { BuildOptions } from 'esbuild';
import fs from 'fs';
import path from 'path';

export async function getEsbuildBaseConfig(baseConfigEntry: string): Promise<BuildOptions> {
  let defaultEsbuildConfig: BuildOptions | undefined = undefined;

  try {
    if (!fs.existsSync(baseConfigEntry)) {
      return Promise.reject(new Error(`Esbuild base config entry <${baseConfigEntry}> does not exist`));
    }

    baseConfigEntry = path.resolve(process.cwd(), baseConfigEntry);

    // is runnining in windows?
    if (process.platform === 'win32') {
      baseConfigEntry = `file:///${baseConfigEntry}`;
    }

    const importEsbuildBaseConfig = await import(baseConfigEntry);
    defaultEsbuildConfig = importEsbuildBaseConfig.default;

    if (defaultEsbuildConfig === undefined) {
      return Promise.reject(new Error(`Esbuild base config entry <${baseConfigEntry}> must export a default array`));
    }

    return Promise.resolve(defaultEsbuildConfig);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(new Error(`Esbuild base config entry: ${error.message}`));
    } else {
      return Promise.reject(new Error(`Esbuild base config entry: ${error}`));
    }
  }
}
