import { Control } from '@public/shared/input';

export type FocusInput = {
    keyboard: boolean;
    cursor: boolean;
    keepInput: boolean;
    disableKeepInputControls: Control[];
    disableAllControls: boolean;
};

export type SetFocusInput = {
    id: string;
    focus?: FocusInput;
};
