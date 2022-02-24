export interface Need {
    type: string
    value: number
    backgroundPrimary: string
    backgroundSecondary: string
}

export interface Needs {
    hunger: number
    thirst: number
    weed?: number
    drunk?: number
}
