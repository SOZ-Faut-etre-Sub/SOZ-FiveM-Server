import { SettingOption } from '@public/shared/phone/config';

export const MapSettingItem =
    (current: SettingOption, onClick: (item: SettingOption) => void) => (item: SettingOption) => ({
        key: item.value,
        selected: current.value === item.value,
        label: item.label,
        onClick: () => onClick(item),
    });

export const MapAudioSettingItem =
    (current: SettingOption, onClick: (item: SettingOption) => void, preview: string) => (item: SettingOption) => ({
        key: item.value,
        selected: current.value === item.value,
        label: item.label,
        soundPreview: preview,
        onClick: () => onClick(item),
    });
