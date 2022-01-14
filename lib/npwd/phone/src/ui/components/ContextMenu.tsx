import React from 'react';
import { ListItemIcon, ListItemText, Slide, Paper } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { List } from './List';
import { ListItem } from './ListItem';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  root: {
    borderTop: '1px solid',
    borderColor: theme.palette.primary.main,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    zIndex: 2,
  },
}));

export interface IContextMenuOption {
  onClick(e, option): void;
  label: string;
  description?: string;
  selected?: boolean;
  icon?: React.ReactNode;
  key?: string;
}

interface ContextMenuProps {
  open: boolean;
  onClose: () => void;
  options: Array<IContextMenuOption>;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ open, onClose, options }) => {
  const classes = useStyles();
  const [t] = useTranslation();

  const _options = onClose
    ? [
        ...options,
        {
          label: t('GENERIC.CLOSE'),
          onClick: onClose,
        } as IContextMenuOption,
      ]
    : options;

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <Paper square className={classes.root}>
        <List disablePadding>
          {_options.map((option) => (
            <ListItem
              selected={option.selected}
              key={option.key || option.label}
              button
              onClick={(e) => {
                option.onClick(e, option);
                onClose();
              }}
            >
              {option.icon && <ListItemIcon>{option.icon}</ListItemIcon>}
              <ListItemText primary={option.label} secondary={option.description} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Slide>
  );
};
