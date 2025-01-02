import { ClassValue } from 'clsx';
import { ReactNode } from 'react';

export type AppCommonAction = {
    display: boolean;
    icon: ReactNode;
    className?: ClassValue;
    onClick: () => void;
};

export type AppCommonState = {
    displayTitle: boolean;
    title: string | null;

    getBack: {
        display: boolean;
        label: string;
        onClick: () => void;
    };

    actions: AppCommonAction[];
};
