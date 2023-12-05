export interface NuiInputMethodMap {
    AskInput: AskInput;
    InInput: boolean;
}

export type AskInput = {
    title: string;
    defaultValue: string;
    maxCharacters?: number;
};
