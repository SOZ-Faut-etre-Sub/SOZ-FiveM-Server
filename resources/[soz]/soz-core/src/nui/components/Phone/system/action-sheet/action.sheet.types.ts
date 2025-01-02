import { ReactNode } from 'react';

export interface IActionSheetOption {
    onClick(e, option): void;

    label: string;
    description?: string;
    selected?: boolean;
    icon?: ReactNode;
    key?: string;
    soundPreview?: boolean;
}
