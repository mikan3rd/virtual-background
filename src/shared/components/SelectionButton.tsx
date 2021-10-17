import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import React from 'react';
import clsx from 'clsx';

type SelectionButtonProps = {
  active: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick: () => void;
};

function SelectionButton(props: SelectionButtonProps) {
  const { active, disabled, children, onClick } = props;

  const classes = useStyles();

  return (
    <Button className={clsx(classes.root, active && classes.active)} disabled={disabled} onClick={onClick}>
      {children}
    </Button>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: 0,
      minWidth: theme.spacing(7) + 2,
      height: theme.spacing(7) + 2,
      width: theme.spacing(7) + 2,
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
      border: '2px solid transparent',
      alignItems: 'stretch',
      transitionProperty: 'transform, border-color',
      transitionDuration: `${theme.transitions.duration.shorter}ms`,
      transitionTimingFunction: theme.transitions.easing.easeInOut,

      '&:hover': {
        transform: 'scale(1.125)',
      },
    },
    active: {
      borderColor: theme.palette.primary.main,
      transform: 'scale(1.125)',
    },
  }),
);

export default SelectionButton;
