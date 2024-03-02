import { BuildOptions } from 'esbuild';
import fs from 'fs';
import path from 'path';

export async function getEsbuildBaseConfig(baseConfigEntry: string): Promise<BuildOptions> {
  let defaultEsbuildConfig: BuildOptions | undefined = undefined;

  try {
    if (!fs.existsSync(baseConfigEntry)) {
      return Promise.reject(new Error(`Esbuild base config entry <${baseConfigEntry}> does not exist`));
    }

    const extension = path.extname(baseConfigEntry);

    if (!(extension === '.js' || extension === '.mjs' || extension === '.ts' || extension === '.mts')) {
      return Promise.reject(
        new Error(`Esbuild base config entry <${baseConfigEntry}> must be a .js, .mjs, .ts, .mts file`),
      );
    }

    baseConfigEntry = path.resolve(process.cwd(), baseConfigEntry);
    const importEsbuildBaseConfig = await import(baseConfigEntry);
    defaultEsbuildConfig = importEsbuildBaseConfig.default;

    if (defaultEsbuildConfig === undefined) {
      return Promise.reject(new Error(`Esbuild base config entry <${baseConfigEntry}> must export a default array`));
    }

    return Promise.resolve(defaultEsbuildConfig);
  } catch (error: any) {
    return Promise.reject(new Error(`Esbuild base config entry: ${error.message}`));
  }
}
