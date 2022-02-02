import React from 'react';
import {List} from './List';
import {ListItem} from './ListItem';
import {useTranslation} from 'react-i18next';


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
    const [t] = useTranslation();

    return (
        <div>
            <div >
                <List style={{marginBottom: '.5rem'}} disablePadding>
                    {options.map((option, id) => (
                        <>
                            <ListItem
                                selected={option.selected}
                                key={option.key || option.label}
                                button
                                onClick={(e) => {
                                    option.onClick(e, option);
                                    onClose();
                                }}
                            >
                                {/*{option.icon && <ListItemIcon>{option.icon}</ListItemIcon>}*/}
                            </ListItem>
                            {options.length-1 !== id && <div />}
                        </>
                    ))}
                </List>
                {onClose && <List disablePadding>
                    <ListItem
                        style={{borderRadius: '1rem'}}
                        button
                        onClick={onClose}
                    >
                    </ListItem>
                </List>}
            </div>
        </div>
    );
};
