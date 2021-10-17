export type SegmentationModel = 'meet';
export type SegmentationBackend = 'wasm' | 'wasmSimd';

export const inputResolution = [160, 96];

export type SegmentationConfig = {
  model: SegmentationModel;
  backend: SegmentationBackend;
};
