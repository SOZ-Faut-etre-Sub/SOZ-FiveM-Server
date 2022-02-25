export interface Waypoint {
    left: string
    top: string
}

export interface Spawn {
    identifier: string
    name: string
    description: string
    image: string
    waypoint?: Waypoint
}
