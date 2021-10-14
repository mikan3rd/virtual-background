import { BackgroundConfig } from '../helpers/backgroundHelper';
import { PostProcessingConfig } from '../helpers/postProcessingHelper';
import { SegmentationConfig } from '../helpers/segmentationHelper';
import { SourceConfig, SourcePlayback } from '../helpers/sourceHelper';
import { TFLite } from '../hooks/useTFLite';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import OutputViewer from './OutputViewer';
import Paper from '@material-ui/core/Paper';
import React, { useEffect, useState } from 'react';
import SourceViewer from './SourceViewer';

type ViewerCardProps = {
  sourceConfig: SourceConfig;
  backgroundConfig: BackgroundConfig;
  segmentationConfig: SegmentationConfig;
  postProcessingConfig: PostProcessingConfig;
  tflite?: TFLite;
};

function ViewerCard(props: ViewerCardProps) {
  const classes = useStyles();
  const [sourcePlayback, setSourcePlayback] = useState<SourcePlayback>();

  useEffect(() => {
    setSourcePlayback(undefined);
  }, [props.sourceConfig]);

  return (
    <Paper className={classes.root}>
      <SourceViewer sourceConfig={props.sourceConfig} onLoad={setSourcePlayback} />
      {sourcePlayback !== undefined && props.tflite !== undefined ? (
        <OutputViewer
          sourcePlayback={sourcePlayback}
          backgroundConfig={props.backgroundConfig}
          segmentationConfig={props.segmentationConfig}
          postProcessingConfig={props.postProcessingConfig}
          tflite={props.tflite}
        />
      ) : (
        <div className={classes.noOutput}>
          <Avatar className={classes.avatar} />
        </div>
      )}
    </Paper>
  );
}

const useStyles = makeStyles((theme: Theme) => {
  const minHeight = [`${theme.spacing(52)}px`, `100vh - ${theme.spacing(2)}px`];

  return createStyles({
    root: {
      minHeight: `calc(min(${minHeight.join(', ')}))`,
      display: 'flex',
      overflow: 'hidden',

      [theme.breakpoints.up('md')]: {
        gridColumnStart: 1,
        gridColumnEnd: 3,
      },

      [theme.breakpoints.up('lg')]: {
        gridRowStart: 1,
        gridRowEnd: 3,
      },
    },
    noOutput: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatar: {
      width: theme.spacing(20),
      height: theme.spacing(20),
    },
  });
});

export default ViewerCard;
