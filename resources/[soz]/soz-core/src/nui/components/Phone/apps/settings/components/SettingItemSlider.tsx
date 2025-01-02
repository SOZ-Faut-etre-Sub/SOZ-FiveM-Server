import clsx from 'clsx';
import React, { ReactNode } from 'react';

import { ListItem } from '../../../components/List';
import { useThemeConfig } from '../../../system/config/config.atom';

interface ISettingSlider {
    label: string;
    iconStart: ReactNode;
    iconEnd: ReactNode;
    value: number;
    onCommit: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SettingItemSlider = ({ iconStart, iconEnd, value, onCommit }: ISettingSlider) => {
    const theme = useThemeConfig();

    return (
        <ListItem>
            <div className="text-gray-300 w-6 h-6">{iconStart}</div>
            <input
                type="range"
                min={0}
                max={100}
                defaultValue={value}
                onChange={onCommit}
                className={clsx('w-full mx-2 h-1.5 appearance-none bg-opacity-20 rounded-full cursor-pointer', {
                    'bg-white': theme === 'dark',
                    'bg-ios-700': theme === 'light',
                })}
            />
            <div className="text-gray-300 w-6 h-6">{iconEnd}</div>
        </ListItem>
    );
};
