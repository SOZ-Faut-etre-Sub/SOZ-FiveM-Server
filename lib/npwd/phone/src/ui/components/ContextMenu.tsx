import React from 'react';
import {ListItemIcon, ListItemText, Slide, Paper, Divider} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {List} from './List';
import {ListItem} from './ListItem';
import {useTranslation} from 'react-i18next';

const useStyles = makeStyles((theme) => ({
    root: {
        left: '1em',
        right: '1em',
        bottom: '1em',
        position: 'absolute',
        zIndex: 2,
        background: 'transparent',
    },
    item: {
        background: 'rgba(255, 255, 255, .85)',
        color: '#518ef8',
        fontWeight: '300',
        textAlign: 'center',
        '&:focus, &:hover, &.Mui-selected': {
            background: 'rgba(220, 220, 220, .85)',
            '&:focus, &:hover': {
                background: 'rgba(220, 220, 220, .85)',
            }
        },
        '&:first-child': {
            background: 'rgba(255, 255, 255, .85)',
            borderTopLeftRadius: '1rem',
            borderTopRightRadius: '1rem',
        },
        '&:first-child &:focus': {
            background: 'rgba(220, 220, 220, .85)',
        },
        '&:last-child': {
            background: 'rgba(255, 255, 255, .85)',
            borderBottomLeftRadius: '1rem',
            borderBottomRightRadius: '1rem',
        }
    },
    divider: {
        borderColor: 'rgba(53, 53, 54, .35)',
    }
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

export const ContextMenu: React.FC<ContextMenuProps> = ({open, onClose, options}) => {
    const classes = useStyles();
    const [t] = useTranslation();

    return (
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
            <Paper className={classes.root}>
                <List style={{marginBottom: '.5rem'}} disablePadding>
                    {options.map((option, id) => (
                        <>
                            <ListItem
                                className={classes.item}
                                selected={option.selected}
                                key={option.key || option.label}
                                button
                                onClick={(e) => {
                                    option.onClick(e, option);
                                    onClose();
                                }}
                            >
                                {option.icon && <ListItemIcon>{option.icon}</ListItemIcon>}
                                <ListItemText primary={option.label} secondary={option.description}/>
                            </ListItem>
                            {options.length-1 !== id && <Divider className={classes.divider} component="li"/>}
                        </>
                    ))}
                </List>
                {onClose && <List disablePadding>
                    <ListItem
                        style={{borderRadius: '1rem'}}
                        className={classes.item}
                        button
                        onClick={onClose}
                    >
                        <ListItemText primary={t('GENERIC.CLOSE')}/>
                    </ListItem>
                </List>}
            </Paper>
        </Slide>
    );
};
