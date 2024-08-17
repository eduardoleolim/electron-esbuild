import chokidar from 'chokidar';
import debounce from 'debounce';
import path from 'path';
import type { InlineConfig } from 'vite';

import { RendererConfig } from '../../../config/domain/RendererConfig.mjs';
import { Logger } from '../../../shared/domain/Logger.mjs';
import { getDependencies } from '../../../shared/infrastructure/getDependencies.mjs';
import { RendererProcessBuilderService } from '../../domain/RendererProcessBuilderService.mjs';

export class ViteRendererProcessBuilder implements RendererProcessBuilderService {
  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  public async build(outputDirectory: string, config: RendererConfig): Promise<void> {
    try {
      this.logger.log('RENDERER-BUILDER', 'Building renderer electron process');

      const { build: vBuild } = await import('vite');
      const options = await this.loadRendererViteOptions(outputDirectory, config);

      await vBuild(options);

      this.logger.log('RENDERER-BUILDER', 'Build finished');
    } catch (error: any) {
      this.logger.error('RENDERER-BUILDER', error.message);
    }
  }

  public async develop(outputDirectory: string, config: RendererConfig, preloadEntryPoints: string[]): Promise<void> {
    try {
      const { createServer: vCreateServer } = await import('vite');
      const options = await this.loadRendererViteOptions(outputDirectory, config);
      const server = await vCreateServer(options);
      let preloadDependencies = this.resolvePreloadDependencies(preloadEntryPoints);
      const watcher = chokidar.watch(preloadDependencies);

      watcher
        .on('ready', async () => {
          this.logger.info('RENDERER-BUILDER', 'Building renderer electron process');
          server.listen(config.devPort);
          this.logger.info('RENDERER-BUILDER', `Renderer process running on http://localhost:${config.devPort}`);
        })
        .on(
          'change',
          debounce(async () => {
            this.logger.info('RENDERER-BUILDER', 'Preload source changed, restarting renderer process');
            await server.restart();

            watcher.unwatch(preloadDependencies);
            preloadDependencies = this.resolvePreloadDependencies(preloadEntryPoints);
            watcher.add(preloadDependencies);
          }, 1000),
        );

      process.on('SIGINT', async () => {
        await server.close();
      });
    } catch (error: any) {
      this.logger.error('RENDERER-BUILDER', error.message);
    }
  }

  public async loadRendererViteOptions(output: string, config: RendererConfig): Promise<InlineConfig> {
    const entryPoint = path.resolve(process.cwd(), config.htmlEntryPoint);
    const outputDirectory = path.resolve(output, config.output.directory);
    const external = ['electron', ...config.excludedLibraries];

    return {
      configFile:
        config.baseConfigEntryPoint !== undefined
          ? path.resolve(process.cwd(), config.baseConfigEntryPoint)
          : undefined,
      root: path.resolve(process.cwd(), entryPoint, '..'),
      base: '',
      build: {
        outDir: outputDirectory,
        emptyOutDir: true,
        minify: process.env.NODE_ENV === 'production',
        sourcemap: process.env.NODE_ENV !== 'production',
        rollupOptions: {
          input: entryPoint,
          external: external,
          output: {
            assetFileNames: (assetInfo) => {
              if (assetInfo.name?.endsWith('.css')) {
                return config.output.filename.replace('.js', '.css');
              }
              return '[name][extname]';
            },
            chunkFileNames: '[name].js',
            entryFileNames: config.output.filename,
          },
        },
      },
    };
  }

  private resolvePreloadDependencies(preloadEntryPoints: string[]): string[] {
    const dependencies = [];

    for (const preloadEntryPoint of preloadEntryPoints) {
      dependencies.push(...getDependencies(preloadEntryPoint));
    }

    return dependencies;
  }
}
