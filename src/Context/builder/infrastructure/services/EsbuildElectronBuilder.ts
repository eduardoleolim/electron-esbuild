import { ElectronBuilderService } from '../../domain/ElectronBuilderService';
import { ElectronConfig, ExtraFile } from '../../../config/domain/ElectronConfig';
import { MainEsbuildElectronBuilder } from './MainEsbuildElectronBuilder';
import { MainProcessStarter } from './MainProcessStarter';
import { RendererEsbuildElectronBuilder } from './RendererEsbuildElectronBuilder';
import path from 'path';
import fs, { fstat, fstatSync } from 'fs';

export class EsbuildElectronBuilder implements ElectronBuilderService {
  private readonly loaders: string[];

  constructor(loaders: string[]) {
    this.loaders = loaders;
  }

  clean(config: ElectronConfig) {
    const outputDirectory = path.resolve(config.output);
    fs.rmSync(outputDirectory, { recursive: true, force: true });
  }

  async build(config: ElectronConfig, clean: boolean): Promise<void> {
    if (clean) {
      this.clean(config);
    }

    const mainBuilder = new MainEsbuildElectronBuilder(config.main, config.output, this.loaders);
    const rendererBuilders = config.renderers.map((rendererConfig) => {
      return new RendererEsbuildElectronBuilder(config.main, rendererConfig, config.output, this.loaders);
    });

    await Promise.all(rendererBuilders.map((builder) => builder.build()));
    await mainBuilder.build();
    this.copyExtraFiles(config.output, config.extraFiles);
  }

  async dev(config: ElectronConfig, clean: boolean): Promise<void> {
    if (clean) {
      this.clean(config);
    }

    const mainBuilder = new MainEsbuildElectronBuilder(config.main, config.output, this.loaders);
    const mainProcessStarter = new MainProcessStarter(config.main, config.output);
    const rendererBuilders = config.renderers.map((rendererConfig) => {
      return new RendererEsbuildElectronBuilder(config.main, rendererConfig, config.output, this.loaders);
    });

    for (let i = 0; i < rendererBuilders.length; i++) {
      const builder = rendererBuilders[i];
      await builder.dev();
    }

    await mainBuilder.build();

    this.copyExtraFiles(config.output, config.extraFiles);

    await mainProcessStarter.start();
    await mainBuilder.dev(mainProcessStarter.start.bind(mainProcessStarter));
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
        console.error(error.message);
      }
    });
  }
}
