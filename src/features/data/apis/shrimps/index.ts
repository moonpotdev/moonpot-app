import { ShrimpsAPI } from './api';

export * from './types';

let shrimpsApi: ShrimpsAPI | null = null;

export function getShrimpsApi() {
  if (shrimpsApi === null) {
    shrimpsApi = new ShrimpsAPI();
  }

  return shrimpsApi;
}
