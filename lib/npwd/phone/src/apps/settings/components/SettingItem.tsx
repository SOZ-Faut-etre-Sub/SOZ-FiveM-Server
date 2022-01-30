import React from 'react';
import {
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    Slider,
    IconButton,
    Switch, styled, SwitchProps, Button,
} from '@mui/material';
import {ChevronRight} from "@mui/icons-material";
import makeStyles from "@mui/styles/makeStyles";
import {ItemIcon} from "@ui/components/ItemIcon";

const useStyles = makeStyles({
    button: {
        color: 'white',
        textTransform: 'inherit',
        "&:hover": {
            background: 'transparent'
        }
    }
});

interface ISettingItem {
  options?: any;
  color?: string;
  label: string;
  value?: string | object | number | null;
  onClick?: any;
  icon: JSX.Element;
}

export const SettingItem = ({ options, color, label, value, onClick, icon }: ISettingItem) => {
    const classes = useStyles();
    return (
        <ListItem onClick={() => onClick?.(options)} button>
            <ItemIcon color={color} icon={icon} />
            <ListItemText primary={label}/>
            <Button className={classes.button}>
                {value ? value : undefined}
                {onClick ? <ChevronRight color="action"/> : undefined}
            </Button>
        </ListItem>
    )
};

interface ISettingSlider {
  label: string;
  iconStart: JSX.Element;
  iconEnd: JSX.Element;
  value: number;
  onCommit: (event: React.SyntheticEvent | Event, value: number | number[]) => void;
}

export const SettingItemSlider = ({ iconStart, iconEnd, value, onCommit }: ISettingSlider) => (
    <ListItem>
        {iconStart}
        <Slider
            key={`slider-${value}`}
            defaultValue={value}
            min={0}
            max={100}
            valueLabelDisplay="auto"
            onChangeCommitted={onCommit}
        />
        {iconEnd}
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
  color?: string;
  value: boolean;
  onClick: any;
  icon: JSX.Element;
  secondary: string;
}

export const SettingSwitch = ({ label, color, value, onClick, icon, secondary }: ISettingSwitch) => (
  <ListItem divider>
    <ItemIcon color={color} icon={icon} />
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
      <ListItem>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={label} secondary={labelSecondary} />

          <IconButton edge="end" onClick={handleAction} size="large">
            {actionIcon}
          </IconButton>
      </ListItem>
  </>
);
