import React from 'react';
import {
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    Box,
    Slider,
    IconButton,
    Typography,
    Switch, styled, SwitchProps,
} from '@mui/material';
import { Tooltip } from '@ui/components/Tooltip';

interface ISettingItem {
  options?: any;
  label: string;
  value?: string | object | number | null;
  onClick?: any;
  icon: JSX.Element;
}

export const SettingItem = ({ options, label, value, onClick, icon }: ISettingItem) => (
  <ListItem divider onClick={() => onClick?.(options)} button>
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText primary={label} secondary={value ? value : undefined} />
  </ListItem>
);

interface ISettingSlider {
  label: string;
  icon: JSX.Element;
  value: number;
  onCommit: (event: React.SyntheticEvent | Event, value: number | number[]) => void;
}

export const SettingItemSlider = ({ icon, label, value, onCommit }: ISettingSlider) => (
  <ListItem divider>
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText primary={label} secondary={`${value}%`} />
    <ListItemSecondaryAction>
      <Box p={2} width={150}>
        <Slider
          key={`slider-${value}`}
          defaultValue={value}
          min={0}
          max={100}
          valueLabelDisplay="auto"
          onChangeCommitted={onCommit}
        />
      </Box>
    </ListItemSecondaryAction>
  </ListItem>
);

interface ISettingItemIconAction {
  icon: JSX.Element;
  actionIcon: JSX.Element;
  label: string;
  labelSecondary: string;
  handleAction: () => void;
  actionLabel: string;
}

interface ISettingSwitch {
  label: string;
  value: boolean;
  onClick: any;
  icon: JSX.Element;
  secondary: string;
}

export const SettingSwitch = ({ label, value, onClick, icon, secondary }: ISettingSwitch) => (
  <ListItem divider>
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText primary={label} secondary={secondary} />
    <ListItemSecondaryAction>
      <IOSSwitch color="primary" checked={value} onChange={() => onClick(value)} />
    </ListItemSecondaryAction>
  </ListItem>
);

const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
                opacity: 1,
                border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color:
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[600],
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
    },
}));

export const SettingItemIconAction = ({
  icon,
  label,
  handleAction,
  actionIcon,
  labelSecondary,
  actionLabel,
}: ISettingItemIconAction) => (
  <>
    <ListItem divider>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} secondary={labelSecondary} />
      <ListItemSecondaryAction>
        <Tooltip
          arrow
          title={<Typography variant="body2">{actionLabel}</Typography>}
          placement="top-end"
        >
          <IconButton edge="end" onClick={handleAction} size="large">
            {actionIcon}
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  </>
);
