import { BackgroundConfig } from '../helpers/backgroundHelper';
import { RenderingPipeline } from '../helpers/renderingPipelineHelper';
import { TFLite } from './useTFLite';
import { buildWebGL2Pipeline } from '../../pipelines/webgl2/webgl2Pipeline';
import { useCallback, useEffect, useRef, useState } from 'react';

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface HTMLCanvasElement {
    captureStream(frameRate?: number): MediaStream;
  }
}

type Props = {
  sourceVideoElement?: HTMLVideoElement;
  backgroundConfig: BackgroundConfig;
  tflite?: TFLite;
};

export function useRenderingPipeline(props: Props) {
  const { sourceVideoElement, backgroundConfig, tflite } = props;

  const [pipeline, setPipeline] = useState<RenderingPipeline | null>(null);
  const backgroundImageRef = useRef<HTMLImageElement>(document.createElement('img'));
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));

  const [canvasMediaStreamState, setCanvasMediaStreamState] = useState<MediaStream | null>(null);
  const canvasMediaStreamRef = useRef(canvasMediaStreamState);

  const setCanvasMediaStream = useCallback((mediaStream: typeof canvasMediaStreamState) => {
    canvasMediaStreamRef.current = mediaStream;
    setCanvasMediaStreamState(mediaStream);
  }, []);

  useEffect(() => {
    if (sourceVideoElement === undefined || tflite === undefined) {
      return () => {
        setPipeline(null);
      };
    }

    // The useEffect cleanup function is not enough to stop
    // the rendering loop when the framerate is low
    let shouldRender = true;

    let renderRequestId: number;

    canvasRef.current.width = sourceVideoElement.videoWidth;
    canvasRef.current.height = sourceVideoElement.videoHeight;

    backgroundImageRef.current.src = backgroundConfig.url ?? '';

    const newPipeline = buildWebGL2Pipeline(
      sourceVideoElement,
      backgroundImageRef.current,
      backgroundConfig,
      canvasRef.current,
      tflite,
    );

    async function render() {
      if (!shouldRender) {
        return;
      }
      await newPipeline.render();
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      renderRequestId = requestAnimationFrame(render);
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    render();
    // console.log('Animation started:', sourceVideoElement, backgroundConfig, segmentationBackend);

    setPipeline(newPipeline);

    canvasMediaStreamRef.current?.getTracks().forEach(track => {
      track.stop();
    });
    setCanvasMediaStream(canvasRef.current.captureStream());

    return () => {
      shouldRender = false;
      cancelAnimationFrame(renderRequestId);
      newPipeline.cleanUp();
      // console.log('Animation stopped:', sourceVideoElement, backgroundConfig, segmentationBackend);

      setPipeline(null);
    };
  }, [sourceVideoElement, backgroundConfig, tflite, setCanvasMediaStream]);

  return {
    pipeline,
    canvasMediaStreamState,
  };
}
