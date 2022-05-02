import { ShrimpsConfig } from './types';

export class ShrimpsAPI {
  async fetchShrimps(): Promise<ShrimpsConfig> {
    const config = await import('../../../../config/shrimps');
    return config.default;
  }
}
