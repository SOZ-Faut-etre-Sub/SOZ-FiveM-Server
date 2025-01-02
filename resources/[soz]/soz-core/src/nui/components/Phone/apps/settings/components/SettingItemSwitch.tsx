import { Switch } from '@headlessui/react';
import clsx from 'clsx';
import React, { ReactNode } from 'react';

import { ItemIcon } from '../../../components/ItemIcon';
import { ListItem } from '../../../components/List';
import { useThemeConfig } from '../../../system/config/config.atom';

interface ISettingSwitch {
    label: string;
    color?: string;
    value: boolean;
    onClick: (checked: boolean) => void;
    icon: ReactNode;
}

export const SettingSwitch = ({ label, color, value, onClick, icon }: ISettingSwitch) => {
    const theme = useThemeConfig();

    return (
        <ListItem>
            <ItemIcon color={color} icon={icon} />
            <p className="flex-grow ml-4 font-light normal-case">{label}</p>
            <Switch
                checked={value}
                onChange={() => onClick(value)}
                className={clsx('inline-flex items-center h-6 rounded-full w-11', {
                    'bg-green-600': value,
                    'bg-gray-500': !value && theme === 'dark',
                    'bg-gray-300': !value && theme === 'light',
                })}
            >
                <span
                    className={clsx(
                        'transform transition ease-in-out duration-300 inline-block size-5 bg-white rounded-full',
                        {
                            'translate-x-6': value,
                            'translate-x-1': !value,
                        }
                    )}
                />
            </Switch>
        </ListItem>
    );
};
