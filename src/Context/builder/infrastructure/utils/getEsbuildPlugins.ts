import { Plugin } from 'esbuild';
import fs from 'fs';
import path from 'path';

export async function getEsbuildPlugins(pluginEntry: string): Promise<Plugin[]> {
  const plugins: Plugin[] = [];
  let defaultPlugins: any = undefined;

  try {
    if (!fs.existsSync(pluginEntry)) {
      return Promise.reject(new Error(`Plugins entry <${pluginEntry}> does not exist`));
    }

    const extension = path.extname(pluginEntry);

    if (!(extension === '.js' || extension === '.mjs')) {
      return Promise.reject(new Error(`Plugins entry <${pluginEntry}> must be a .js, .mjs file`));
    }

    pluginEntry = path.resolve(process.cwd(), pluginEntry);
    const importPlugins = await import(pluginEntry);
    defaultPlugins = importPlugins.default;

    if (defaultPlugins === undefined) {
      return Promise.reject(new Error(`Plugins entry <${pluginEntry}> must export a default array`));
    }

    if (!Array.isArray(defaultPlugins)) {
      return Promise.reject(new Error(`Plugins entry <${pluginEntry}> must export a default array`));
    }

    for (const plugin of defaultPlugins) {
      const name = plugin.name;
      const setup = plugin.setup;

      if (typeof name !== 'string') {
        continue;
      }

      if (typeof setup !== 'function') {
        continue;
      }

      plugins.push({
        name: name,
        setup: setup,
      });
    }

    return Promise.resolve(plugins);
  } catch (error: any) {
    return Promise.reject(new Error(`Plugins entry: ${error.message}`));
  }
}
