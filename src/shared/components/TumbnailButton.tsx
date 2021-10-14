import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import SelectionButton from './SelectionButton';
import Skeleton from '@material-ui/lab/Skeleton';
import clsx from 'clsx';

type ThumbnailButtonProps = {
  thumbnailUrl?: string;
  active: boolean;
  children?: React.ReactNode;
  onClick: () => void;
  onLoad?: () => void;
};

function ThumbnailButton(props: ThumbnailButtonProps) {
  const { thumbnailUrl, active, children, onClick, onLoad } = props;
  const classes = useStyles();

  return (
    <SelectionButton
      active={thumbnailUrl !== undefined && active}
      disabled={thumbnailUrl === undefined}
      onClick={onClick}
    >
      {thumbnailUrl !== undefined ? (
        <img className={clsx(classes.scalableContent, classes.image)} src={thumbnailUrl} alt="" onLoad={onLoad} />
      ) : (
        <Skeleton className={classes.scalableContent} variant="rect" />
      )}
      {children}
    </SelectionButton>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    scalableContent: {
      // Fixes rendering issues with border when scaled
      width: 'calc(100% + 2px)',
      height: 'calc(100% + 2px)',
      margin: -1,
      borderRadius: theme.shape.borderRadius,
    },
    image: {
      objectFit: 'cover',
    },
  }),
);

export default ThumbnailButton;
