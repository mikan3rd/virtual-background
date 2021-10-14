import { SourceConfig, SourcePlayback } from '../helpers/sourceHelper';
import { useEffect, useRef } from 'react';

type SourceViewerProps = {
  sourceConfig: SourceConfig;
  onLoad: (sourcePlayback: SourcePlayback) => void;
};

function SourceViewer(props: SourceViewerProps) {
  const { sourceConfig, onLoad } = props;

  const videoRef = useRef<HTMLVideoElement>(document.createElement('video'));

  useEffect(() => {
    function playVideo() {
      videoRef.current.autoplay = true;
      // videoRef.current.playsInline = true;
      videoRef.current.muted = true;
      videoRef.current.loop = true;
      videoRef.current.onloadeddata = () => {
        onLoad({
          htmlElement: videoRef.current,
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight,
        });
      };
      videoRef.current.play();
    }

    async function getCameraStream() {
      try {
        const constraint = { video: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraint);
        videoRef.current.srcObject = stream;
        playVideo();
        return;
      } catch (error) {
        console.error('Error opening video camera.', error);
      }
    }

    if (sourceConfig.type === 'camera') {
      getCameraStream();
    } else if (sourceConfig.url !== undefined) {
      videoRef.current.srcObject = null;
      videoRef.current.src = sourceConfig.url;
      playVideo();
    }
  }, [onLoad, sourceConfig]);

  return null;
}

export default SourceViewer;
