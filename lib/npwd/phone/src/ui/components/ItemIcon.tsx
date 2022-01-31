import React from 'react';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { ListItemIcon} from '@mui/material';

const useStyles = makeStyles<Theme, { color: string }>((theme) => ({
  root: {
    backgroundColor: ({ color }) => color,
    padding: '0.35rem',
    borderRadius: '.5rem',
    minWidth: 0,
    marginRight: '1rem'
  }
}));

export interface ItemIconProps {
  icon: JSX.Element;
  color: string;
}

export const ItemIcon: React.FC<ItemIconProps> = ({
  icon,
  color
}) => {
  const classes = useStyles({
    color
  });

  return (
      <ListItemIcon className={classes.root}>{icon}</ListItemIcon>
  );
};
