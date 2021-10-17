export type SegmentationBackend = 'wasm' | 'wasmSimd';

export const inputResolution = [160, 96];

export type SegmentationConfig = {
  backend: SegmentationBackend;
};
