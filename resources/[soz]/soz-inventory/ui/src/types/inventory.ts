export interface IInventoryItem {
    id: string|number
    slot: number
    name: string
    label: string
    amount: number
    description: string

    type?: string
    useable?: boolean
    unique?: boolean
    weight?: number
    shouldClose?: boolean
    metadata?: any
}

export interface IInventoryEvent {
    id: string
    type: string
    owner?: string
    label?: string
    weight: number
    slots?: number
    maxWeight: number
    time?: number
    changed?: boolean
    datastore?: boolean
}
