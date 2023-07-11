import { ElectronBuilderService } from '../domain/ElectronBuilderService';
import { ElectronConfig } from '../../config/domain/ElectronConfig';
import fs from 'fs';

export class BuildApplication {
  private readonly builder: ElectronBuilderService;

  constructor(builder: ElectronBuilderService) {
    this.builder = builder;
  }

  public build(configPath: string) {
    const configs = this.prepareConfigs(configPath);
    configs.forEach((config) => this.builder.build(config));
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
