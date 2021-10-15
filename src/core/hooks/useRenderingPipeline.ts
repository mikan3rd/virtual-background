import { BackgroundConfig } from '../helpers/backgroundHelper';
import { RenderingPipeline } from '../helpers/renderingPipelineHelper';
import { SegmentationConfig } from '../helpers/segmentationHelper';
import { SourcePlayback } from '../helpers/sourceHelper';
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
  sourcePlayback?: SourcePlayback;
  backgroundConfig: BackgroundConfig;
  segmentationConfig: SegmentationConfig;
  tflite?: TFLite;
};

export function useRenderingPipeline(props: Props) {
  const { sourcePlayback, backgroundConfig, segmentationConfig, tflite } = props;

  const [pipeline, setPipeline] = useState<RenderingPipeline | null>(null);
  const backgroundImageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
  const [fps, setFps] = useState(0);
  const [durations, setDurations] = useState<number[]>([]);

  const [canvasMediaStreamState, setCanvasMediaStreamState] = useState<MediaStream | null>(null);
  const canvasMediaStreamRef = useRef(canvasMediaStreamState);

  const setCanvasMediaStream = useCallback((mediaStream: typeof canvasMediaStreamState) => {
    canvasMediaStreamRef.current = mediaStream;
    setCanvasMediaStreamState(mediaStream);
  }, []);

  useEffect(() => {
    if (sourcePlayback === undefined || tflite === undefined) {
      return () => {
        setPipeline(null);
      };
    }

    // The useEffect cleanup function is not enough to stop
    // the rendering loop when the framerate is low
    let shouldRender = true;

    let previousTime = 0;
    let beginTime = 0;
    let eventCount = 0;
    let frameCount = 0;
    const frameDurations: number[] = [];

    let renderRequestId: number;

    canvasRef.current.width = sourcePlayback.width;
    canvasRef.current.height = sourcePlayback.height;

    const newPipeline = buildWebGL2Pipeline(
      sourcePlayback,
      backgroundImageRef.current,
      backgroundConfig,
      segmentationConfig,
      canvasRef.current,
      tflite,
      addFrameEvent,
    );

    async function render() {
      if (!shouldRender) {
        return;
      }
      beginFrame();
      await newPipeline.render();
      endFrame();
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      renderRequestId = requestAnimationFrame(render);
    }

    function beginFrame() {
      beginTime = Date.now();
    }

    function addFrameEvent() {
      const time = Date.now();
      frameDurations[eventCount] = time - beginTime;
      beginTime = time;
      eventCount++;
    }

    function endFrame() {
      const time = Date.now();
      frameDurations[eventCount] = time - beginTime;
      frameCount++;
      if (time >= previousTime + 1000) {
        setFps((frameCount * 1000) / (time - previousTime));
        setDurations(frameDurations);
        previousTime = time;
        frameCount = 0;
      }
      eventCount = 0;
    }

    render();
    console.log('Animation started:', sourcePlayback, backgroundConfig, segmentationConfig);

    setPipeline(newPipeline);

    if (canvasMediaStreamRef.current !== null) {
      canvasMediaStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
    }
    setCanvasMediaStream(canvasRef.current.captureStream());

    return () => {
      shouldRender = false;
      cancelAnimationFrame(renderRequestId);
      newPipeline.cleanUp();
      console.log('Animation stopped:', sourcePlayback, backgroundConfig, segmentationConfig);

      setPipeline(null);
    };
  }, [sourcePlayback, backgroundConfig, segmentationConfig, tflite, setCanvasMediaStream]);

  return {
    pipeline,
    backgroundImageRef,
    fps,
    durations,
    canvasMediaStreamState,
  };
}
