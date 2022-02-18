import {StateUpdater} from "preact/compat";

export interface Frequency {
    frequency: number
    volume: number
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
