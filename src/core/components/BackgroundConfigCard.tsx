import { BackgroundConfig, backgroundImageUrls } from '../helpers/backgroundHelper';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import BlockIcon from '@material-ui/icons/Block';
import BlurOnIcon from '@material-ui/icons/BlurOn';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ImageButton from '../../shared/components/ImageButton';
import React from 'react';
import SelectionIconButton from '../../shared/components/SelectionIconButton';
import Typography from '@material-ui/core/Typography';

type BackgroundConfigCardProps = {
  config: BackgroundConfig;
  onChange: (config: BackgroundConfig) => void;
};

function BackgroundConfigCard(props: BackgroundConfigCardProps) {
  const { config, onChange } = props;

  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography gutterBottom variant="h6" component="h2">
          Background
        </Typography>
        <SelectionIconButton active={config.type === 'none'} onClick={() => onChange({ type: 'none' })}>
          <BlockIcon />
        </SelectionIconButton>
        <SelectionIconButton active={config.type === 'blur'} onClick={() => onChange({ type: 'blur' })}>
          <BlurOnIcon />
        </SelectionIconButton>
        {backgroundImageUrls.map(imageUrl => (
          <ImageButton
            key={imageUrl}
            imageUrl={imageUrl}
            active={imageUrl === config.url}
            onClick={() => onChange({ type: 'image', url: imageUrl })}
          />
        ))}
      </CardContent>
    </Card>
  );
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flex: 1,
    },
  }),
);

export default BackgroundConfigCard;
