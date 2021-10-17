import { BackgroundConfig } from '../helpers/backgroundHelper';
import { PostProcessingConfig } from '../helpers/postProcessingHelper';
import { SegmentationBackend } from '../helpers/segmentationHelper';
import { TFLite } from '../hooks/useTFLite';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { useRenderingPipeline } from '../hooks/useRenderingPipeline';
import React, { useEffect, useRef } from 'react';
// import Typography from '@material-ui/core/Typography';

type OutputViewerProps = {
  sourceVideoElement?: HTMLVideoElement;
  backgroundConfig: BackgroundConfig;
  segmentationBackend: SegmentationBackend;
  postProcessingConfig: PostProcessingConfig;
  tflite?: TFLite;
};

function OutputViewer(props: OutputViewerProps) {
  const { sourceVideoElement, backgroundConfig, segmentationBackend, postProcessingConfig, tflite } = props;

  const videoRef = useRef<HTMLVideoElement>(null);

  const classes = useStyles();
  const {
    pipeline,
    backgroundImageRef,
    // fps,
    // durations: [resizingDuration, inferenceDuration, postProcessingDuration],
    canvasMediaStreamState,
  } = useRenderingPipeline({ sourceVideoElement, backgroundConfig, segmentationBackend, tflite });

  useEffect(() => {
    if (videoRef.current !== null) {
      videoRef.current.srcObject = canvasMediaStreamState;
    }
  }, [canvasMediaStreamState]);

  useEffect(() => {
    if (pipeline !== null) {
      pipeline.updatePostProcessingConfig(postProcessingConfig);
    }
  }, [pipeline, postProcessingConfig]);

  // const statDetails = [
  //   `resizing ${resizingDuration}ms`,
  //   `inference ${inferenceDuration}ms`,
  //   `post-processing ${postProcessingDuration}ms`,
  // ];
  // const stats = `${Math.round(fps)} fps (${statDetails.join(', ')})`;

  return (
    <div className={classes.root}>
      {/* TODO: 背景画像をcanvasで合成する */}
      {backgroundConfig.type === 'image' && (
        <img ref={backgroundImageRef} className={classes.render} src={backgroundConfig.url} alt="" />
      )}
      <video className={classes.render} ref={videoRef} autoPlay playsInline controls={false} muted loop />
      {/* <Typography className={classes.stats} variant="caption">
        {stats}
      </Typography> */}
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: 1,
      position: 'relative',
    },
    render: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    stats: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      textAlign: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.48)',
      color: theme.palette.common.white,
    },
  }),
);

export default OutputViewer;
