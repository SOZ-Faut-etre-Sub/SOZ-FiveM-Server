export type FocusInput = {
    keyboard: boolean;
    cursor: boolean;
};

export type SetFocusInput = {
    id: string;
    focus?: FocusInput;
};
