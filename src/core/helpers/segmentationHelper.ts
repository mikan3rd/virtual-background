export type SegmentationModel = 'meet';
export type SegmentationBackend = 'wasm' | 'wasmSimd';
export type InputResolution = '160x96';

export const inputResolutions: {
  [resolution in InputResolution]: [number, number];
} = {
  '160x96': [160, 96],
};

export type PipelineName = 'webgl2';

export type SegmentationConfig = {
  model: SegmentationModel;
  backend: SegmentationBackend;
  inputResolution: InputResolution;
  pipeline: PipelineName;
};
