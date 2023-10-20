import { NamedZone } from '../polyzone/box.zone';
import { Vector3 } from '../polyzone/vector';

export type Dialog = {
    audio: string;
    text: string[];
    timing?: number[];
};

export type StoryObject = {
    model: string;
    coords: Vector3;
    rotation: Vector3;
};

export type Story = {
    name: string;
    dialog: { [key: string]: Dialog };
    zones?: (NamedZone & { part: number; label: string; icon: string })[];
    props?: StoryObject[];
};

export enum ScenarioState {
    NotStarted,
    Running,
    Finished,
}

export const ScenarioOrder = [
    { story: 'halloween2022', scenario: 'scenario1' },
    { story: 'halloween2022', scenario: 'scenario2' },
    { story: 'halloween2022', scenario: 'scenario3' },
    { story: 'halloween2022', scenario: 'scenario4' },
    { story: 'halloween2023', scenario: 'scenario1' },
    { story: 'halloween2023', scenario: 'scenario2' },
    { story: 'halloween2023', scenario: 'scenario3' },
    { story: 'halloween2023', scenario: 'scenario4' },
];
