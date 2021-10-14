import { BackgroundConfig } from '../helpers/backgroundHelper';
import { PostProcessingConfig } from '../helpers/postProcessingHelper';
import { SegmentationConfig } from '../helpers/segmentationHelper';
import { SourcePlayback } from '../helpers/sourceHelper';
import { TFLite } from '../hooks/useTFLite';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import React, { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import useRenderingPipeline from '../hooks/useRenderingPipeline';

type OutputViewerProps = {
  sourcePlayback: SourcePlayback;
  backgroundConfig: BackgroundConfig;
  segmentationConfig: SegmentationConfig;
  postProcessingConfig: PostProcessingConfig;
  tflite: TFLite;
};

function OutputViewer(props: OutputViewerProps) {
  const { sourcePlayback, backgroundConfig, segmentationConfig, postProcessingConfig, tflite } = props;

  const classes = useStyles();
  const {
    pipeline,
    backgroundImageRef,
    canvasRef,
    fps,
    durations: [resizingDuration, inferenceDuration, postProcessingDuration],
  } = useRenderingPipeline(sourcePlayback, backgroundConfig, segmentationConfig, tflite);

  useEffect(() => {
    if (pipeline !== null) {
      pipeline.updatePostProcessingConfig(postProcessingConfig);
    }
  }, [pipeline, postProcessingConfig]);

  const statDetails = [
    `resizing ${resizingDuration}ms`,
    `inference ${inferenceDuration}ms`,
    `post-processing ${postProcessingDuration}ms`,
  ];
  const stats = `${Math.round(fps)} fps (${statDetails.join(', ')})`;

  return (
    <div className={classes.root}>
      {backgroundConfig.type === 'image' && (
        <img
          ref={backgroundImageRef}
          className={classes.render}
          src={backgroundConfig.url}
          alt=""
          hidden={segmentationConfig.pipeline === 'webgl2'}
        />
      )}
      <canvas
        // The key attribute is required to create a new canvas when switching
        // context mode
        key={segmentationConfig.pipeline}
        ref={canvasRef}
        className={classes.render}
        width={sourcePlayback.width}
        height={sourcePlayback.height}
      />
      <Typography className={classes.stats} variant="caption">
        {stats}
      </Typography>
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
