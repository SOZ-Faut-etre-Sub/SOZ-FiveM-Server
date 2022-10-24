import { ZoneOptions } from '../../client/target/target.factory';

export type Dialog = {
    audio: string;
    text: string[];
};

export type Story = {
    name: string;
    dialog: { [key: string]: Dialog };
    zones: (ZoneOptions & { part: string; label: string; icon: string })[];
};

export enum ScenarioState {
    NotStarted,
    Running,
    Finished,
}
