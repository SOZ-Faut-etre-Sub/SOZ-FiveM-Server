import { Blip } from '../blip';
import { Component, Prop, WardrobeConfig } from '../cloth';
import { joaat } from '../joaat';
import { JobType } from '../job';
import { PlayerPedHash } from '../player';
import { NamedZone, Zone } from '../polyzone/box.zone';
import { Vector3, Vector4 } from '../polyzone/vector';

function GetLocalConvarInt(convar: string, defaultVal: number) {
    if (global.GetConvarInt) {
        return GetConvarInt(convar, defaultVal);
    }

    return defaultVal;
}

export const UpwCloakroom: WardrobeConfig = {
    [PlayerPedHash.Male]: {
        ["Tenue d'apprenti pour été"]: {
            Components: {
                [Component.Torso]: { Palette: 0, Drawable: 41, Texture: 0 },
                [Component.Legs]: { Palette: 0, Drawable: 98, Texture: 19 },
                [Component.Shoes]: { Palette: 0, Drawable: 12, Texture: 5 },
                [Component.Undershirt]: { Palette: 0, Drawable: 15, Texture: 0 },
                [Component.Tops]: { Palette: 0, Drawable: 146, Texture: 6 },
            },
            Props: { [Prop.Hat]: { Drawable: 145, Texture: 0, Palette: 0 } },
        },
        ["Tenue d'apprenti pour hiver"]: {
            Components: {
                [Component.Torso]: { Palette: 0, Drawable: 42, Texture: 0 },
                [Component.Legs]: { Palette: 0, Drawable: 98, Texture: 19 },
                [Component.Shoes]: { Palette: 0, Drawable: 12, Texture: 5 },
                [Component.Undershirt]: { Palette: 0, Drawable: 2, Texture: 2 },
                [Component.Tops]: { Palette: 0, Drawable: 244, Texture: 4 },
            },
            Props: { [Prop.Hat]: { Drawable: 145, Texture: 0, Palette: 0 } },
        },
        ["Tenue d'électricien pour été"]: {
            Components: {
                [Component.Torso]: { Palette: 0, Drawable: 41, Texture: 0 },
                [Component.Legs]: { Palette: 0, Drawable: 98, Texture: 19 },
                [Component.Shoes]: { Palette: 0, Drawable: 12, Texture: 5 },
                [Component.Undershirt]: { Palette: 0, Drawable: 15, Texture: 0 },
                [Component.Tops]: { Palette: 0, Drawable: 22, Texture: 1 },
            },
            Props: { [Prop.Hat]: { Drawable: 145, Texture: 1, Palette: 0 } },
        },
        ["Tenue d'électricien pour hiver"]: {
            Components: {
                [Component.Torso]: { Palette: 0, Drawable: 42, Texture: 0 },
                [Component.Legs]: { Palette: 0, Drawable: 98, Texture: 19 },
                [Component.Shoes]: { Palette: 0, Drawable: 12, Texture: 5 },
                [Component.Undershirt]: { Palette: 0, Drawable: 2, Texture: 2 },
                [Component.Tops]: { Palette: 0, Drawable: 244, Texture: 6 },
            },
            Props: { [Prop.Hat]: { Drawable: 145, Texture: 1, Palette: 0 } },
        },
        ['Tenue de chef électricien pour été']: {
            Components: {
                [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 98, Texture: 19, Palette: 0 },
                [Component.Shoes]: { Drawable: 12, Texture: 5, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 0, Texture: 4, Palette: 0 },
            },
            Props: { [Prop.Hat]: { Drawable: 145, Texture: 2, Palette: 0 } },
        },
        ['Tenue de chef électricien pour hiver']: {
            Components: {
                [Component.Torso]: { Palette: 0, Drawable: 42, Texture: 0 },
                [Component.Legs]: { Palette: 0, Drawable: 98, Texture: 19 },
                [Component.Shoes]: { Palette: 0, Drawable: 12, Texture: 5 },
                [Component.Undershirt]: { Palette: 0, Drawable: 2, Texture: 2 },
                [Component.Tops]: { Palette: 0, Drawable: 244, Texture: 7 },
            },
            Props: { [Prop.Hat]: { Drawable: 145, Texture: 2, Palette: 0 } },
        },
        ['Tenue de la Direction']: {
            Components: {
                [Component.Torso]: { Palette: 0, Drawable: 1, Texture: 0 },
                [Component.Legs]: { Palette: 0, Drawable: 25, Texture: 0 },
                [Component.Shoes]: { Palette: 0, Drawable: 56, Texture: 1 },
                [Component.BodyArmor]: { Palette: 0, Drawable: 0, Texture: 0 },
                [Component.Tops]: { Palette: 0, Drawable: 294, Texture: 7 },
            },
            Props: { [Prop.Hat]: { Drawable: 145, Texture: 3, Palette: 0 } },
        },
    },
    [PlayerPedHash.Female]: {
        ["Tenue d'apprentie pour été"]: {
            Components: {
                [Component.Torso]: { Texture: 0, Palette: 0, Drawable: 57 },
                [Component.Legs]: { Texture: 19, Palette: 0, Drawable: 101 },
                [Component.Shoes]: { Texture: 2, Palette: 0, Drawable: 60 },
                [Component.Undershirt]: { Texture: 9, Palette: 0, Drawable: 101 },
                [Component.Tops]: { Texture: 1, Palette: 0, Drawable: 141 },
            },
            Props: { [Prop.Hat]: { Drawable: 144, Texture: 0, Palette: 0 } },
        },
        ["Tenue d'apprentie pour hiver"]: {
            Components: {
                [Component.Torso]: { Texture: 0, Palette: 0, Drawable: 46 },
                [Component.Legs]: { Texture: 19, Palette: 0, Drawable: 101 },
                [Component.Shoes]: { Texture: 2, Palette: 0, Drawable: 60 },
                [Component.Undershirt]: { Texture: 5, Palette: 0, Drawable: 213 },
                [Component.Tops]: { Texture: 4, Palette: 0, Drawable: 252 },
            },
            Props: { [Prop.Hat]: { Drawable: 144, Texture: 0, Palette: 0 } },
        },
        ["Tenue d'électricienne pour été"]: {
            Components: {
                [Component.Torso]: { Texture: 0, Palette: 0, Drawable: 57 },
                [Component.Legs]: { Texture: 19, Palette: 0, Drawable: 101 },
                [Component.Shoes]: { Texture: 2, Palette: 0, Drawable: 60 },
                [Component.Undershirt]: { Texture: 9, Palette: 0, Drawable: 101 },
                [Component.Tops]: { Texture: 1, Palette: 0, Drawable: 286 },
            },
            Props: { [Prop.Hat]: { Drawable: 144, Texture: 1, Palette: 0 } },
        },
        ["Tenue d'électricienne pour hiver"]: {
            Components: {
                [Component.Torso]: { Texture: 0, Palette: 0, Drawable: 46 },
                [Component.Legs]: { Texture: 19, Palette: 0, Drawable: 101 },
                [Component.Shoes]: { Texture: 2, Palette: 0, Drawable: 60 },
                [Component.Undershirt]: { Texture: 5, Palette: 0, Drawable: 213 },
                [Component.Tops]: { Texture: 6, Palette: 0, Drawable: 252 },
            },
            Props: { [Prop.Hat]: { Drawable: 144, Texture: 1, Palette: 0 } },
        },
        ['Tenue de cheffe électricienne pour été']: {
            Components: {
                [Component.Torso]: { Texture: 0, Palette: 0, Drawable: 0 },
                [Component.Legs]: { Texture: 19, Palette: 0, Drawable: 101 },
                [Component.Shoes]: { Texture: 2, Palette: 0, Drawable: 60 },
                [Component.Undershirt]: { Texture: 0, Palette: 0, Drawable: 14 },
                [Component.Tops]: { Texture: 16, Palette: 0, Drawable: 68 },
            },
            Props: { [Prop.Hat]: { Drawable: 144, Texture: 2, Palette: 0 } },
        },
        ['Tenue de cheffe électricienne pour hiver']: {
            Components: {
                [Component.Torso]: { Texture: 0, Palette: 0, Drawable: 46 },
                [Component.Legs]: { Texture: 19, Palette: 0, Drawable: 101 },
                [Component.Shoes]: { Texture: 2, Palette: 0, Drawable: 60 },
                [Component.Undershirt]: { Texture: 5, Palette: 0, Drawable: 213 },
                [Component.Tops]: { Texture: 7, Palette: 0, Drawable: 252 },
            },
            Props: { [Prop.Hat]: { Drawable: 144, Texture: 2, Palette: 0 } },
        },
        ['Tenue de la Direction']: {
            Components: {
                [Component.Torso]: { Texture: 0, Palette: 0, Drawable: 5 },
                [Component.Legs]: { Texture: 0, Palette: 0, Drawable: 133 },
                [Component.Shoes]: { Texture: 0, Palette: 0, Drawable: 27 },
                [Component.Undershirt]: { Texture: 6, Palette: 0, Drawable: 217 },
                [Component.Tops]: { Texture: 2, Palette: 0, Drawable: 6 },
            },
            Props: { [Prop.Hat]: { Drawable: 144, Texture: 3, Palette: 0 } },
        },
    },
};

export enum UpwFacilityType {
    inverter = 'inverter',
    plant = 'plant',
    resell = 'resell',
    terminal = 'terminal',
    jobTerminal = 'jobTerminal',
    charger = 'charger',
}

export type UpwFacility = {
    identifier: string;
    type: UpwFacilityType;
    capacity: number;
    waste: number;
    maxCapacity: number;
    energyZone?: Zone<never>;
    wasteZone?: Zone<never>;
    position?: Vector4;
    job?: JobType;
    pollutionPerUnit?: number;
    wastePerMinute?: { min: number; max: number };
    maxWaste?: number;
    productionPerMinute?: { min: number; max: number };
    wasteItem?: string;
    item?: string;
};

const orderZone: NamedZone = {
    name: 'upw_order',
    center: [609.3484, 2759.589, 40.85264],
    length: 1.15,
    width: 2.5,
    minZ: 41.7,
    maxZ: 42.25,
    heading: 365,
};

export enum UpwConfigEnergyItem {
    fossil = 'energy_cell_fossil',
    hydro = 'energy_cell_hydro',
    wind = 'energy_cell_wind',
    solar = 'energy_cell_solar',
}

export enum UpwPollution {
    Low = 'low',
    Neutral = 'neutral',
    High = 'high',
}

export const UpwPollutionLevel: Record<UpwPollution, number> = {
    [UpwPollution.Low]: 0,
    [UpwPollution.Neutral]: 1,
    [UpwPollution.High]: 2,
};

export enum UpwBlackout {
    Zero = '0',
    One = '1',
    Two = '2',
    Three = '3',
    Four = '4',
}

export const UpwBlackoutLevel: Record<UpwBlackout, number> = {
    [UpwBlackout.Zero]: 0,
    [UpwBlackout.One]: 1,
    [UpwBlackout.Two]: 2,
    [UpwBlackout.Three]: 3,
    [UpwBlackout.Four]: 4,
};

export const UpwConfig: {
    Order: any;
    Resale: {
        Duration: number;
        EnergyCellPrice: Record<UpwConfigEnergyItem, number>;
        EnergyCellPriceGlobal: Record<UpwConfigEnergyItem, number>;
        Zone: Zone<any>;
    };
    Pollution: {
        MaxUnitsPerHour: number;
        Persistence: number;
        Tick: number;
        Threshold: Record<UpwPollution, { min: number; max: number }>;
        Multiplier: Record<UpwPollution, number>;
    };
    Blackout: {
        Threshold: Record<UpwBlackout, { min: number; max: number }>;
    };
    MainBlip: Blip;
    FacilitiesBlip: Record<
        UpwFacilityType,
        {
            name: string;
            sprite: number;
            scale: number;
            color: number;
        }
    >;
    Consumption: {
        Tick: number;
        EnergyPerTick: number;
        EnergyJobPerTick: number;
    };
    Production: {
        Tick: number;
        WastePerHarvest: number;
        EnergyPerCell: Record<UpwConfigEnergyItem, number>;
    };
} = {
    Order: {
        zone: orderZone,
        waitingTime: 60, // In minutes
        garage: 'upw',
        account: 'upw',
        farm: 'farm_upw',
        safe: 'safe_upw',
    },
    Resale: {
        Duration: 5000,
        EnergyCellPrice: {
            [UpwConfigEnergyItem.fossil]: 48,
            [UpwConfigEnergyItem.hydro]: 108,
            [UpwConfigEnergyItem.wind]: 240,
            [UpwConfigEnergyItem.solar]: 240,
        },
        EnergyCellPriceGlobal: {
            [UpwConfigEnergyItem.fossil]: 90,
            [UpwConfigEnergyItem.hydro]: 54,
            [UpwConfigEnergyItem.wind]: 36,
            [UpwConfigEnergyItem.solar]: 36,
        },
        Zone: {
            center: [291.97, -2885.82, 6.01] as Vector3,
            length: 5.2,
            width: 3.8,
            minZ: 5.01,
            maxZ: 8.21,
            heading: 0,
        },
    },
    Pollution: {
        MaxUnitsPerHour: 900,
        Persistence: 24 * 7 * 3_600_000, // previous pollution units kept, one week
        Tick: 60000, // in ms
        Threshold: {
            [UpwPollution.Low]: { min: 0, max: 11 },
            [UpwPollution.Neutral]: { min: 11, max: 70 },
            [UpwPollution.High]: { min: 70, max: 100 },
        },
        Multiplier: {
            [UpwPollution.Low]: 1.0,
            [UpwPollution.Neutral]: 1.0,
            [UpwPollution.High]: 1.0,
        },
    },
    Blackout: {
        Threshold: {
            [UpwBlackout.Four]: { min: 0, max: 5 },
            [UpwBlackout.Three]: { min: 5, max: 20 },
            [UpwBlackout.Two]: { min: 20, max: 35 },
            [UpwBlackout.One]: { min: 35, max: 50 },
            [UpwBlackout.Zero]: { min: 50, max: 100 },
        },
    },
    MainBlip: { name: 'Unexpected Power & Water', position: [594.47, 2768.05, 0.0], sprite: 768, scale: 1.0 },
    FacilitiesBlip: {
        plant: { name: 'Installation électrique', sprite: 354, scale: 1.2, color: 1 },
        inverter: { name: 'Onduleur', sprite: 587, scale: 1.0, color: 47 },
        terminal: { name: 'Borne civile', sprite: 683, scale: 1.0, color: 4 },
        jobTerminal: { name: 'Borne entreprise', sprite: 683, scale: 1.0, color: 5 },
        resell: { name: "Revente d'énergie", sprite: 768, scale: 1.0, color: 0 },
        charger: { name: 'Emplacement de chargeur UPW', sprite: 620, scale: 1.0, color: 3 },
    },
    Consumption: {
        Tick: 60_000,
        EnergyPerTick: GetLocalConvarInt('soz_upw_consumption_energy_per_tick', 1) / 100, // per connected player
        EnergyJobPerTick: GetLocalConvarInt('soz_upw_consumption_energy_job_per_tick', 1) / 100, // per player on duty
    },
    Production: {
        Tick: 48_000,
        WastePerHarvest: GetLocalConvarInt('soz_upw_waste_per_harvest', 1),
        EnergyPerCell: {
            energy_cell_fossil: GetLocalConvarInt('soz_upw_energy_per_cell_fossil', 1),
            energy_cell_hydro: GetLocalConvarInt('soz_upw_energy_per_cell_hydro', 1),
            energy_cell_wind: GetLocalConvarInt('soz_upw_energy_per_cell_wind', 1),
            energy_cell_solar: GetLocalConvarInt('soz_upw_energy_per_cell_solar', 1),
        },
    },
};

export const UPW_CHARGER_REFILL_VALUES: Record<UpwConfigEnergyItem, number> = {
    energy_cell_fossil: 40,
    energy_cell_hydro: 30,
    energy_cell_wind: 20,
    energy_cell_solar: 20,
};

export const UPWModels: Partial<Record<UpwFacilityType, number>> = {
    inverter: joaat('upwpile'),
    terminal: joaat('soz_prop_elec01'),
    jobTerminal: joaat('soz_prop_elec02'),
};

export const UPWDefaultConf: Partial<Record<UpwFacilityType, { capacity: number; maxCapacity: number }>> = {
    inverter: { capacity: 0, maxCapacity: 5000 },
    terminal: { capacity: 1000, maxCapacity: 1000 },
    jobTerminal: { capacity: 1000, maxCapacity: 1000 },
};

export type MenuUpwData = {
    blips: Record<UpwFacilityType, boolean>;
};

export type UpwMetrics = {
    pollution_level: number;
    pollution_percent: number;
    blackout_level: number;
    blackout_percent: number;
    facilities: {
        type: string;
        identifier: string;
        value: number;
        job?: string;
        scope: string;
    }[];
};

export const UPWWasteMultiplier = [
    { value: 1, min: 0, max: 0.2 },
    { value: 0.95, min: 0.2, max: 0.25 },
    { value: 0.85, min: 0.25, max: 0.3 },
    { value: 0.7, min: 0.3, max: 0.35 },
    { value: 0.45, min: 0.35, max: 0.4 },
    { value: 0.1, min: 0.4, max: 0.45 },
    { value: 0.01, min: 0.45, max: 0.5 },
    { value: 0, min: 0.5, max: 1 },
];
