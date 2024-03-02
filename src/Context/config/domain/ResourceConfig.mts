import { OutputConfig } from './OutputConfig.mjs';

export abstract class ResourceConfig {
  readonly from: string;

  constructor(from: string) {
    this.from = from;
  }
}

export class SimpleResourceConfig extends ResourceConfig {
  readonly to: string;

  constructor(from: string, to: string) {
    super(from);
    this.to = to;
  }
}

export class CustomResourceConfig extends ResourceConfig {
  readonly output: OutputConfig;

  constructor(from: string, output: OutputConfig) {
    super(from);
    this.output = output;
  }
}
