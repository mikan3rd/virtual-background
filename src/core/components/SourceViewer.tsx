import { SourceConfig } from '../helpers/sourceHelper';
import { useEffect, useRef } from 'react';

type SourceViewerProps = {
  sourceConfig: SourceConfig;
  onLoad: (sourceVideoElement: HTMLVideoElement) => void;
};

function SourceViewer(props: SourceViewerProps) {
  const { sourceConfig, onLoad } = props;

  const videoRef = useRef<HTMLVideoElement>(document.createElement('video'));
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    function playVideo() {
      videoRef.current.autoplay = true;
      // videoRef.current.playsInline = true;
      videoRef.current.muted = true;
      videoRef.current.loop = true;
      videoRef.current.onloadeddata = () => {
        onLoad(videoRef.current);
      };
      videoRef.current.play();
    }

    async function getCameraStream() {
      try {
        const constraint = { video: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraint);
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        playVideo();
        return;
      } catch (error) {
        console.error('Error opening video camera.', error);
      }
    }

    streamRef.current?.getTracks().forEach(track => {
      track.stop();
    });

    if (sourceConfig.type === 'camera-off') {
      videoRef.current.srcObject = null;
      videoRef.current.src = '';
    } else if (sourceConfig.type === 'camera') {
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
