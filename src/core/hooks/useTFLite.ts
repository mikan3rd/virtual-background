import { SegmentationBackend } from '../helpers/segmentationHelper';
import { useEffect, useRef, useState } from 'react';

declare function createTFLiteModule(): Promise<TFLite>;
declare function createTFLiteSIMDModule(): Promise<TFLite>;

export type TFLite = {
  _getModelBufferMemoryOffset(): number;
  _getInputMemoryOffset(): number;
  _getInputHeight(): number;
  _getInputWidth(): number;
  _getInputChannelCount(): number;
  _getOutputMemoryOffset(): number;
  _getOutputHeight(): number;
  _getOutputWidth(): number;
  _getOutputChannelCount(): number;
  _loadModel(bufferSize: number): number;
  _runInference(): number;
} & EmscriptenModule;

function useTFLite(segmentationBackend: SegmentationBackend) {
  const [tflite, setTFLite] = useState<TFLite>();
  const [tfliteSIMD, setTFLiteSIMD] = useState<TFLite>();
  const [selectedTFLite, setSelectedTFLite] = useState<TFLite>();
  const [isSIMDSupported, setSIMDSupported] = useState(false);

  const isLoadingModelRef = useRef(false);

  useEffect(() => {
    const tfliteId = `tflite`;
    if (document.getElementById(tfliteId) !== null) {
      return;
    }

    const scriptElement = document.createElement('script');
    scriptElement.id = tfliteId;
    scriptElement.setAttribute('src', `${window.location.origin}/tflite/tflite.js`);
    scriptElement.onload = async () => {
      const _tflite = await createTFLiteModule();
      setTFLite(_tflite);
    };
    document.head.appendChild(scriptElement);
  }, []);

  useEffect(() => {
    const tfliteSimdId = `tflite-simd`;
    if (document.getElementById(tfliteSimdId) !== null) {
      return;
    }

    const scriptElement = document.createElement('script');
    scriptElement.id = tfliteSimdId;
    scriptElement.setAttribute('src', `${window.location.origin}/tflite/tflite-simd.js`);
    scriptElement.onload = async () => {
      try {
        const createdTFLiteSIMD = await createTFLiteSIMDModule();
        setTFLiteSIMD(createdTFLiteSIMD);
        setSIMDSupported(true);
      } catch (error) {
        console.warn('Failed to create TFLite SIMD WebAssembly module.', error);
      }
    };
    document.head.appendChild(scriptElement);
  }, []);

  useEffect(() => {
    async function loadTFLiteModel() {
      if (
        tflite === undefined ||
        (isSIMDSupported && tfliteSIMD === undefined) ||
        (!isSIMDSupported && segmentationBackend === 'wasmSimd')
      ) {
        return;
      }

      setSelectedTFLite(undefined);

      const newSelectedTFLite = segmentationBackend === 'wasmSimd' ? tfliteSIMD : tflite;

      if (newSelectedTFLite === undefined) {
        throw new Error(`TFLite backend unavailable: ${segmentationBackend}`);
      }

      if (isLoadingModelRef.current) {
        return;
      }

      isLoadingModelRef.current = true;

      const modelFileName = 'segm_lite_v681';
      console.log('Loading tflite model:', modelFileName);

      const tflitePath = `${window.location.origin}/models/${modelFileName}.tflite`;
      console.log(tflitePath);
      const modelResponse = await fetch(tflitePath);
      const model = await modelResponse.arrayBuffer();
      console.log('Model buffer size:', model.byteLength);

      const modelBufferOffset = newSelectedTFLite._getModelBufferMemoryOffset();
      // console.log('Model buffer memory offset:', modelBufferOffset);
      // console.log('Loading model buffer...');
      newSelectedTFLite.HEAPU8.set(new Uint8Array(model), modelBufferOffset);
      console.log('_loadModel result:', newSelectedTFLite._loadModel(model.byteLength));

      // console.log('Input memory offset:', newSelectedTFLite._getInputMemoryOffset());
      // console.log('Input height:', newSelectedTFLite._getInputHeight());
      // console.log('Input width:', newSelectedTFLite._getInputWidth());
      // console.log('Input channels:', newSelectedTFLite._getInputChannelCount());

      // console.log('Output memory offset:', newSelectedTFLite._getOutputMemoryOffset());
      // console.log('Output height:', newSelectedTFLite._getOutputHeight());
      // console.log('Output width:', newSelectedTFLite._getOutputWidth());
      // console.log('Output channels:', newSelectedTFLite._getOutputChannelCount());

      setSelectedTFLite(newSelectedTFLite);
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadTFLiteModel();
  }, [tflite, tfliteSIMD, isSIMDSupported, segmentationBackend]);

  return { tflite: selectedTFLite, isSIMDSupported };
}

export default useTFLite;
