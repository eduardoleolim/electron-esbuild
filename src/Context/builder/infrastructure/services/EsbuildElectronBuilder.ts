import fs from 'fs';
import path from 'path';

import { ElectronConfig, ExtraFile } from '../../../config/domain/ElectronConfig.js';
import { Logger } from '../../../shared/domain/Logger.js';
import { ElectronBuilderService } from '../../domain/ElectronBuilderService.js';
import { MainEsbuildElectronBuilder } from './MainEsbuildElectronBuilder.js';
import { MainProcessStarter } from './MainProcessStarter.js';
import { RendererEsbuildElectronBuilder } from './RendererEsbuildElectronBuilder.js';

export class EsbuildElectronBuilder implements ElectronBuilderService {
  private readonly loaders: string[];
  private readonly logger: Logger;

  constructor(loaders: string[], logger: Logger) {
    this.loaders = loaders;
    this.logger = logger;
  }

  async build(config: ElectronConfig, clean: boolean): Promise<void> {
    if (clean) {
      this.clean(config);
    }

    const mainBuilder = new MainEsbuildElectronBuilder(config.main, config.output, this.loaders, this.logger);
    const rendererBuilders = config.renderers.map((rendererConfig) => {
      return new RendererEsbuildElectronBuilder(config.main, rendererConfig, config.output, this.loaders, this.logger);
    });

    rendererBuilders.forEach((builder) => builder.build());
    await mainBuilder.build();
    this.copyExtraFiles(config.output, config.extraFiles);
  }

  async dev(config: ElectronConfig, clean: boolean): Promise<void> {
    if (clean) {
      this.clean(config);
    }

    const mainProcessStarter = new MainProcessStarter(config.main, config.output, this.logger);
    const mainBuilder = new MainEsbuildElectronBuilder(config.main, config.output, this.loaders, this.logger);
    const rendererBuilders = config.renderers.map((rendererConfig) => {
      return new RendererEsbuildElectronBuilder(config.main, rendererConfig, config.output, this.loaders, this.logger);
    });

    rendererBuilders.forEach((builder) => builder.dev());

    await mainBuilder.build();
    this.copyExtraFiles(config.output, config.extraFiles);
    await mainProcessStarter.start();
    await mainBuilder.dev(mainProcessStarter);
  }

  clean(config: ElectronConfig) {
    const outputDirectory = path.resolve(config.output);
    fs.rmSync(outputDirectory, { recursive: true, force: true });
    this.logger.info('CLEAN', 'Output directory cleaned');
  }

  copyExtraFiles(output: string, extraFiles: ExtraFile[]): void {
    extraFiles.forEach((item) => {
      try {
        if (typeof item === 'string') {
          const sourcePath = path.resolve(process.cwd(), item);
          let outputPath = path.resolve(process.cwd(), output);
          const stats = fs.statSync(sourcePath);

          if (stats.isFile()) {
            outputPath = path.resolve(outputPath, path.basename(sourcePath));
          }

          if (stats.isDirectory()) {
            outputPath = path.resolve(outputPath, item);
          }

          fs.cpSync(sourcePath, outputPath, { recursive: true });
        } else {
          const sourcePath = path.resolve(process.cwd(), item.from);
          const outputPath = path.resolve(process.cwd(), output, item.to);

          fs.cpSync(sourcePath, outputPath, { recursive: true });
        }
      } catch (error: any) {
        this.logger.error('COPY', error.message);
      }
    });
    this.logger.info('COPY', 'Extra files copied');
  }
}
