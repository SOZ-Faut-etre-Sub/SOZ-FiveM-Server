export interface Blip {
    sprite?: number;
    range?: boolean;
    color?: number;
    alpha?: number;
    display?: number;
    playername?: string;
    showcone?: boolean;
    heading?: number;
    showheading?: boolean;
    secondarycolor?: number;
    friend?: boolean;
    mission?: boolean;
    friendly?: boolean;
    routeColor?: number;
    scale?: number;
    name: string;
    coords: { x: number; y: number; z?: number };
}
