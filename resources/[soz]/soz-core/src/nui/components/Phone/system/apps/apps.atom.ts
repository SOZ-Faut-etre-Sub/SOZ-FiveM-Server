import { ClassValue } from 'clsx';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { ReactNode } from 'react';

interface AppTitleState {
    display: boolean;
    title: string;
    subtitle?: string;
}

interface AppGetBackState {
    display: boolean;
    label: string;
    className?: ClassValue;
    onClick: () => void;
}

export interface AppActionState {
    display: boolean;
    icon: ReactNode;
    className?: ClassValue;
    onClick: () => void;
}

const appTitleAtom = atom<AppTitleState>({
    display: false,
    title: '',
    subtitle: undefined,
});
const appGetBackAtom = atom<AppGetBackState>({
    display: false,
    label: 'Retour',
    onClick: () => {},
});
const appActionsAtom = atom<Array<AppActionState>>([]);

export const useAppTitle = () => useAtomValue(appTitleAtom);
export const useSetAppTitle = () => useSetAtom(appTitleAtom);

export const useAppGetBack = () => useAtomValue(appGetBackAtom);
export const useSetAppGetBack = () => useSetAtom(appGetBackAtom);

export const useAppActions = () => useAtomValue(appActionsAtom);
export const useSetAppActions = () => useSetAtom(appActionsAtom);
