export type RadioChannel = {
    frequency: number;
    volume: number;
    ear: Ear;
};

export type Radio = {
    enabled: boolean;
    primary: RadioChannel;
    secondary: RadioChannel;
};

export enum RadioType {
    RadioLongRange = 'radio-lr',
    RadioShortRange = 'radio-sr',
}

export enum RadioChannelType {
    Primary = 'primary',
    Secondary = 'secondary',
}

export enum Ear {
    Left,
    Both,
    Right,
}
