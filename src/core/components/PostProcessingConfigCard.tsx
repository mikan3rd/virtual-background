import { BlendMode, PostProcessingConfig } from '../helpers/postProcessingHelper';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import React, { ChangeEvent } from 'react';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

type PostProcessingConfigCardProps = {
  config: PostProcessingConfig;
  onChange: (config: PostProcessingConfig) => void;
};

function PostProcessingConfigCard(props: PostProcessingConfigCardProps) {
  const { config, onChange } = props;

  const classes = useStyles();

  function handleSigmaSpaceChange(_event: ChangeEvent<{}>, value: number | number[]) {
    onChange({
      ...config,
      jointBilateralFilter: {
        ...config.jointBilateralFilter,
        sigmaSpace: value as number,
      },
    });
  }

  function handleSigmaColorChange(_event: ChangeEvent<{}>, value: number | number[]) {
    onChange({
      ...config,
      jointBilateralFilter: {
        ...config.jointBilateralFilter,
        sigmaColor: value as number,
      },
    });
  }

  function handleCoverageChange(_event: ChangeEvent<{}>, value: number | number[]) {
    onChange({
      ...config,
      coverage: value as [number, number],
    });
  }

  function handleLightWrappingChange(_event: ChangeEvent<{}>, value: number | number[]) {
    onChange({
      ...config,
      lightWrapping: value as number,
    });
  }

  function handleBlendModeChange(event: ChangeEvent<{ value: unknown }>) {
    onChange({
      ...config,
      blendMode: event.target.value as BlendMode,
    });
  }

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h6" component="h2">
          Post-processing
        </Typography>
        <Typography gutterBottom>Joint bilateral filter</Typography>
        <Typography variant="body2">Sigma space</Typography>
        <Slider
          value={config.jointBilateralFilter.sigmaSpace}
          min={0}
          max={10}
          step={0.1}
          valueLabelDisplay="auto"
          onChange={handleSigmaSpaceChange}
        />
        <Typography variant="body2">Sigma color</Typography>
        <Slider
          value={config.jointBilateralFilter.sigmaColor}
          min={0}
          max={1}
          step={0.01}
          valueLabelDisplay="auto"
          onChange={handleSigmaColorChange}
        />
        <Typography gutterBottom>Background</Typography>
        <Typography variant="body2">Coverage</Typography>
        <Slider
          value={config.coverage}
          min={0}
          max={1}
          step={0.01}
          valueLabelDisplay="auto"
          onChange={handleCoverageChange}
        />
        <Typography variant="body2" gutterBottom>
          Light wrapping
        </Typography>
        <div className={classes.lightWrapping}>
          <FormControl className={classes.formControl} variant="outlined">
            <InputLabel>Blend mode</InputLabel>
            <Select label="Blend mode" value={config.blendMode} onChange={handleBlendModeChange}>
              <MenuItem value="screen">Screen</MenuItem>
              <MenuItem value="linearDodge">Linear dodge</MenuItem>
            </Select>
          </FormControl>
          <Slider
            value={config.lightWrapping}
            min={0}
            max={1}
            step={0.01}
            valueLabelDisplay="auto"
            onChange={handleLightWrappingChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    lightWrapping: {
      display: 'flex',
      alignItems: 'center',
    },
    formControl: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      marginRight: theme.spacing(2),
      minWidth: 160,
    },
  }),
);

export default PostProcessingConfigCard;
