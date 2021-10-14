import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import React from 'react';
import ThumbnailButton from './TumbnailButton';
import useVideoThumbnail from '../hooks/useVideoThumbnail';

type VideoButtonProps = {
  videoUrl: string;
  active: boolean;
  onClick: () => void;
};

function VideoButton(props: VideoButtonProps) {
  const { videoUrl, active, onClick } = props;
  const classes = useStyles();
  const [thumbnailUrl, revokeThumbnailUrl] = useVideoThumbnail(videoUrl);

  return (
    <ThumbnailButton thumbnailUrl={thumbnailUrl} active={active} onClick={onClick} onLoad={revokeThumbnailUrl}>
      <PlayCircleOutlineIcon className={classes.icon} />
    </ThumbnailButton>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      color: theme.palette.common.white,
    },
  }),
);

export default VideoButton;
