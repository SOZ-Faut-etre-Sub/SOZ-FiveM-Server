import {StateUpdater} from "preact/compat";

export enum Ear {
    Left,
    Both,
    Right
}

export interface Frequency {
    frequency: number
    volume: number
    ear: Ear
}

export type FrequencyType = 'primary' | 'secondary'

export interface RadioScreen {
    enabled: boolean
    currentFrequency: FrequencyType
    primaryFrequency: Frequency
    setPrimaryFrequency: StateUpdater<Frequency>
    secondaryFrequency: Frequency
    setSecondaryFrequency: StateUpdater<Frequency>
}
