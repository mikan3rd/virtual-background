import { SegmentationBackend, SegmentationConfig } from '../helpers/segmentationHelper';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import React, { ChangeEvent } from 'react';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

type SegmentationConfigCardProps = {
  config: SegmentationConfig;
  isSIMDSupported: boolean;
  onChange: (config: SegmentationConfig) => void;
};

function SegmentationConfigCard(props: SegmentationConfigCardProps) {
  const { config, isSIMDSupported, onChange } = props;

  const classes = useStyles();

  function handleBackendChange(event: ChangeEvent<{ value: unknown }>) {
    onChange({
      ...config,
      backend: event.target.value as SegmentationBackend,
    });
  }

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography gutterBottom variant="h6" component="h2">
          Segmentation
        </Typography>
        <div className={classes.formControls}>
          <FormControl className={classes.formControl} variant="outlined">
            <InputLabel>Backend</InputLabel>
            <Select label="Backend" value={config.backend} onChange={handleBackendChange}>
              <MenuItem value="wasm">WebAssembly</MenuItem>
              <MenuItem value="wasmSimd" disabled={!isSIMDSupported}>
                WebAssembly SIMD
              </MenuItem>
            </Select>
          </FormControl>
        </div>
      </CardContent>
    </Card>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.only('md')]: {
        gridColumnStart: 2,
        gridRowStart: 2,
      },
    },
    formControls: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    formControl: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      marginRight: theme.spacing(2),
      minWidth: 200,
      flex: 1,
    },
  }),
);

export default SegmentationConfigCard;
