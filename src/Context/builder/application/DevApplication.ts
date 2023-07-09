import { ElectronBuilderService } from '../domain/ElectronBuilderService';
import { ElectronConfig } from '../../config/domain/ElectronConfig';
import * as fs from 'fs';

export class DevApplication {
  private readonly builder: ElectronBuilderService;

  constructor(builder: ElectronBuilderService) {
    this.builder = builder;
  }

  public dev(configPath: string) {
    const configs = this.prepareConfigs(configPath);
    configs.forEach((config) => this.builder.dev(config));
  }

  private prepareConfigs(configPath: string): ElectronConfig[] {
    if (!fs.existsSync(configPath)) throw new Error('Config file not found');

    let configs = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (!Array.isArray(configs)) {
      configs = [configs];
    }

    return configs.map(ElectronConfig.fromJson);
  }
}
