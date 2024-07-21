export enum PedDensityType {
    parked = 'parked',
    vehicle = 'vehicle',
    multiplier = 'multiplier',
    peds = 'peds',
    scenario = 'scenario',
}

export const DefaultPedDensity: Record<PedDensityType, number> = {
    parked: 1.0,
    vehicle: 1.0,
    multiplier: 1.0,
    peds: 1.0,
    scenario: 1.0, //Walking NPC Density
};
