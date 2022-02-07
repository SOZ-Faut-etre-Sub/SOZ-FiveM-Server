import React, {ChangeEvent, ChangeEventHandler, FormEventHandler} from 'react';
import {ItemIcon} from "@ui/components/ItemIcon";
import {Switch} from '@headlessui/react';
import {ListItem} from "@ui/components/ListItem";
import {Button} from '@ui/components/Button';
import {ChevronRightIcon} from "@heroicons/react/outline";

interface ISettingItem {
    options?: any;
    color?: string;
    label: string;
    value?: string | object | number | null;
    onClick?: any;
    icon: JSX.Element;
}

export const SettingItem = ({options, color, label, value, onClick, icon}: ISettingItem) => {
    return (
        <ListItem onClick={() => onClick?.(options)}>
            <ItemIcon color={color} icon={icon}/>
            <p className="flex-grow ml-4 font-light normal-case">{label}</p>
            <Button className="flex items-center">
                {value ? value : undefined}
                {onClick ? <ChevronRightIcon className="text-opacity-25 w-5 h-5"/> : undefined}
            </Button>
        </ListItem>
    )
};

interface ISettingSlider {
    label: string;
    iconStart: JSX.Element;
    iconEnd: JSX.Element;
    value: number;
    onCommit: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SettingItemSlider = ({iconStart, iconEnd, value, onCommit}: ISettingSlider) => (
    <ListItem>
        <div className="text-opacity-25 w-6 h-6">
            {iconStart}
        </div>
        <input
            type="range"
            min={0}
            max={100}
            defaultValue={value}
            onChange={onCommit}
            className="w-full mx-2 h-1.5 appearance-none bg-white bg-opacity-20 rounded-full cursor-pointer"
        />
        <div className="text-opacity-25 w-6 h-6">
            {iconEnd}
        </div>
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
}

export const SettingSwitch = ({label, color, value, onClick, icon}: ISettingSwitch) => (
    <ListItem>
        <ItemIcon color={color} icon={icon}/>
        <p className="flex-grow ml-4 font-light normal-case">{label}</p>
        <div>
            <Switch checked={value} onChange={() => onClick(value)}
                    className={`${
                        value ? 'bg-blue-600' : 'bg-gray-500'
                    } inline-flex items-center h-6 rounded-full w-11`}
            >
             <span className={`transform transition ease-in-out duration-300 ${
                 value ? 'translate-x-6' : 'translate-x-1'
             } inline-block w-5 h-5 bg-white rounded-full`}
             />
            </Switch>
        </div>
    </ListItem>
);

export const SettingItemIconAction = ({
    icon,
    label,
    handleAction,
    actionIcon,
    labelSecondary,
    actionLabel,
}: ISettingItemIconAction) => (
    <ListItem>
        <div>{icon}</div>

        <div onClick={handleAction}>
            {actionIcon}
        </div>
    </ListItem>
);
