export type FocusInput = {
    keyboard: boolean;
    cursor: boolean;
    keepInput: boolean;
};

export type SetFocusInput = {
    id: string;
    focus?: FocusInput;
};
