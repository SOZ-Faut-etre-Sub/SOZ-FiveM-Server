import React, { useState } from 'react';

import { ContextMenu, IContextMenuOption } from '../old_components/ContextMenu';

type UseContextMenu = [any, any, () => JSX.Element, boolean];

export const MapStringOptions = (current, onClick) => string => {
    return {
        selected: current === string,
        label: string,
        key: string,
        onClick: () => onClick(string),
    };
};

export interface SettingOption<T = any> {
    label: string;
    value: T | string | number;
}

export const MapSettingItem =
    (current: SettingOption, onClick: (item: SettingOption) => void) => (item: SettingOption) => ({
        selected: current.value === item.value,
        onClick: () => onClick(item),
        key: item.value,
        label: item.label,
    });

export const MapAudioSettingItem =
    (current: SettingOption, onClick: (item: SettingOption) => void, preview: string) => (item: SettingOption) => ({
        selected: current.value === item.value,
        onClick: () => onClick(item),
        soundPreview: preview,
        key: item.value,
        label: item.label,
    });

export const useContextMenu = (_options?: IContextMenuOption[]): UseContextMenu => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState(_options || []);

    const onClose = () => setOpen(false);

    const onOpen = opts => {
        setOptions(opts);
        setOpen(true);
    };

    return [onOpen, onClose, () => <ContextMenu open={open} onClose={onClose} options={options} />, open];
};
