export type Dialog = {
    audio: string;
    text: string[];
};

export type Story = {
    name: string;
    dialog: { [key: string]: Dialog };
};
