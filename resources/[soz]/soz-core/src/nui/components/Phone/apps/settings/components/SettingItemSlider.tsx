import clsx from 'clsx';
import React, { ReactNode } from 'react';

import { InputBase } from '../../../components/Input';
import { ListItem } from '../../../components/List';
import { useThemeConfig } from '../../../system/config/config.atom';

interface ISettingSlider {
    label: string;
    iconStart: ReactNode;
    iconEnd: ReactNode;
    value: number;
    onCommit: (event: React.ChangeEvent<HTMLInputElement>) => void;
    min?: number;
    max?: number;
}

export const SettingItemSlider = ({ iconStart, iconEnd, value, onCommit, min = 0, max = 100 }: ISettingSlider) => {
    const theme = useThemeConfig();

    return (
        <ListItem className="px-2">
            <div className="flex justify-center items-center text-gray-300 size-6">{iconStart}</div>
            <InputBase
                type="range"
                min={min}
                max={max}
                defaultValue={value}
                onChange={onCommit}
                className={clsx('w-full mx-2 h-1.5 appearance-none bg-opacity-20 rounded-full cursor-pointer', {
                    'bg-white': theme === 'dark',
                    'bg-ios-700': theme === 'light',
                })}
            />
            <div className="flex justify-center items-center text-gray-300 size-6">{iconEnd}</div>
        </ListItem>
    );
};
