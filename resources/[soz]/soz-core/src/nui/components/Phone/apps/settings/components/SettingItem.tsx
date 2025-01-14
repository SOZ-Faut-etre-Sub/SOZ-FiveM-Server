import { ChevronRightIcon } from '@heroicons/react/outline';
import React, { FunctionComponent, ReactNode } from 'react';

import { Button } from '../../../components/Button';
import { ItemIcon } from '../../../components/ItemIcon';
import { ListItem } from '../../../components/List';

interface ISettingItem {
    options?: any;
    color?: string;
    label: string;
    value?: string | object | number | null;
    onClick?: any;
    icon: ReactNode;
}

export const SettingItem: FunctionComponent<ISettingItem> = ({ options, color, label, value, onClick, icon }) => {
    return (
        <ListItem onClick={() => onClick?.('Configuration', options)}>
            <ItemIcon color={color} icon={icon} />
            <p className="flex-grow ml-4 font-light normal-case">{label}</p>
            <Button className="flex items-center">
                {value && value}
                {onClick && <ChevronRightIcon className="text-gray-200 w-5 h-5" />}
            </Button>
        </ListItem>
    );
};
