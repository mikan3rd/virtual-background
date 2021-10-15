import { BackgroundConfig } from './core/helpers/backgroundHelper';
import { PostProcessingConfig } from './core/helpers/postProcessingHelper';
import { SegmentationConfig } from './core/helpers/segmentationHelper';
import { SourceConfig, sourceVideoUrls } from './core/helpers/sourceHelper';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import BackgroundConfigCard from './core/components/BackgroundConfigCard';
import PostProcessingConfigCard from './core/components/PostProcessingConfigCard';
import React, { useEffect, useState } from 'react';
import SegmentationConfigCard from './core/components/SegmentationConfigCard';
import SourceConfigCard from './core/components/SourceConfigCard';
import ViewerCard from './core/components/ViewerCard';
import useTFLite from './core/hooks/useTFLite';

function App() {
  const classes = useStyles();
  const [sourceConfig, setSourceConfig] = useState<SourceConfig>({
    type: 'video',
    url: sourceVideoUrls[1],
  });
  const [backgroundConfig, setBackgroundConfig] = useState<BackgroundConfig>({
    type: 'blur',
  });
  const [segmentationConfig, setSegmentationConfig] = useState<SegmentationConfig>({
    model: 'meet',
    backend: 'wasm',
    inputResolution: '160x96',
    pipeline: 'webgl2',
  });
  const [postProcessingConfig, setPostProcessingConfig] = useState<PostProcessingConfig>({
    smoothSegmentationMask: true,
    jointBilateralFilter: { sigmaSpace: 1, sigmaColor: 0.1 },
    coverage: [0.5, 0.75],
    lightWrapping: 0.3,
    blendMode: 'screen',
  });
  const { tflite, isSIMDSupported } = useTFLite(segmentationConfig);

  useEffect(() => {
    setSegmentationConfig(previousSegmentationConfig => {
      if (previousSegmentationConfig.backend === 'wasm' && isSIMDSupported) {
        return { ...previousSegmentationConfig, backend: 'wasmSimd' };
      }
      return previousSegmentationConfig;
    });
  }, [isSIMDSupported]);

  return (
    <div className={classes.root}>
      <ViewerCard
        sourceConfig={sourceConfig}
        backgroundConfig={backgroundConfig}
        segmentationConfig={segmentationConfig}
        postProcessingConfig={postProcessingConfig}
        tflite={tflite}
      />
      <SourceConfigCard config={sourceConfig} onChange={setSourceConfig} />
      <BackgroundConfigCard config={backgroundConfig} onChange={setBackgroundConfig} />
      <SegmentationConfigCard
        config={segmentationConfig}
        isSIMDSupported={isSIMDSupported}
        onChange={setSegmentationConfig}
      />
      <PostProcessingConfigCard config={postProcessingConfig} onChange={setPostProcessingConfig} />
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'grid',

      [theme.breakpoints.up('xs')]: {
        margin: theme.spacing(1),
        gap: theme.spacing(1),
        gridTemplateColumns: '1fr',
      },

      [theme.breakpoints.up('md')]: {
        margin: theme.spacing(2),
        gap: theme.spacing(2),
        gridTemplateColumns: 'repeat(2, 1fr)',
      },

      [theme.breakpoints.up('lg')]: {
        gridTemplateColumns: 'repeat(3, 1fr)',
      },
    },
    resourceSelectionCards: {
      display: 'flex',
      flexDirection: 'column',
    },
  }),
);

export default App;
