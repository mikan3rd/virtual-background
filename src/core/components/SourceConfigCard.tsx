import { SourceConfig, sourceVideoUrls } from '../helpers/sourceHelper';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import React from 'react';
import SelectionIconButton from '../../shared/components/SelectionIconButton';
import Typography from '@material-ui/core/Typography';
import VideoButton from '../../shared/components/VideoButton';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';

type SourceConfigCardProps = {
  config: SourceConfig;
  onChange: (config: SourceConfig) => void;
};

function SourceConfigCard(props: SourceConfigCardProps) {
  const { config, onChange } = props;

  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography gutterBottom variant="h6" component="h2">
          Source
        </Typography>
        <SelectionIconButton active={config.type === 'camera-off'} onClick={() => onChange({ type: 'camera-off' })}>
          <VideocamOffIcon />
        </SelectionIconButton>
        <SelectionIconButton active={config.type === 'camera'} onClick={() => onChange({ type: 'camera' })}>
          <VideocamIcon />
        </SelectionIconButton>
        {sourceVideoUrls.map(videoUrl => (
          <VideoButton
            key={videoUrl}
            videoUrl={videoUrl}
            active={videoUrl === config.url}
            onClick={() => onChange({ type: 'video', url: videoUrl })}
          />
        ))}
      </CardContent>
    </Card>
  );
}

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    root: {
      flex: 1,
    },
  }),
);

export default SourceConfigCard;
