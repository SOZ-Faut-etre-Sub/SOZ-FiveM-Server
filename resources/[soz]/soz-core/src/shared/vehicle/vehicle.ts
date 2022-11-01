import { DealershipConfigItem, DealershipType } from '../../config/dealership';
import { RGBColor } from '../color';
import { JobType } from '../job';
import { Vector4 } from '../polyzone/vector';
import { AuctionVehicle } from './auction';
import { DealershipId } from './dealership';

export type Vehicle = {
    model: string;
    hash: number;
    name: string;
    price: number;
    category: string;
    dealership?: DealershipId;
    requiredLicence?: string;
    size: number;
    jobName?: { [key in JobType]: string };
    stock: number;
};

export type VehicleSpawn = {
    model: number;
    position: Vector4;
    warp: boolean;
    state: VehicleEntityState;
    modification?: VehicleModification;
};

export type VehicleEntityState = {
    id: number | null;
    forced: boolean;
    open: boolean;
    plate: string | null;
    owner: string | null;
    speedLimit: number | null;
    isPlayerVehicle: boolean;

    deadInWater: boolean;
    condition: VehicleCondition;
    hasRadio: boolean;
};

export enum VehicleClass {
    Compacts = 0,
    Sedans = 1,
    SUVs = 2,
    Coupes = 3,
    Muscle = 4,
    SportsClassics = 5,
    Sports = 6,
    Super = 7,
    Motorcycles = 8,
    OffRoad = 9,
    Industrial = 10,
    Utility = 11,
    Vans = 12,
    Cycles = 13,
    Boats = 14,
    Helicopters = 15,
    Planes = 16,
    Service = 17,
    Emergency = 18,
    Military = 19,
    Commercial = 20,
    Trains = 21,
}

export enum VehicleModType {
    Spoiler = 0,
    FrontBumper = 1,
    RearBumper = 2,
    SideSkirt = 3,
    Exhaust = 4,
    Chassis = 5,
    Grill = 6,
    Hood = 7,
    LeftWing = 8,
    RightWing = 9,
    Roof = 10,
    Engine = 11,
    Brakes = 12,
    Gearbox = 13,
    Horn = 14,
    Suspension = 15,
    Armor = 16,
    Nitrous = 17,
    Turbo = 18,
    Subwoofer = 19,
    TireSmoke = 20,
    Hydraulics = 21,
    XenonLights = 22,
    FrontWheels = 23,
    RearWheels = 24,
    PlateHolder = 25,
    VanityPlates = 26,
    Interior = 27,
    Ornaments = 28,
    Dashboard = 29,
    DialDesign = 30,
    DoorSpeaker = 31,
    Seats = 32,
    SteeringWheels = 33,
    Knobs = 34,
    Plaques = 35,
    Speakers = 36,
    Trunk = 37,
    Hydraulics2 = 38,
    EngineBlock = 39,
    AirFilter = 40,
    Struts = 41,
    Chassis2 = 42,
    Chassis3 = 43,
    Chassis4 = 44,
    Tank = 45,
    LeftDoor = 46,
    RightDoor = 47,
    Livery = 48,
    Lightbar = 49,
}

export type VehicleModificationMod = {
    modAerials: number;
    modAirFilter: number;
    modAPlate: number;
    modArchCover: number;
    modArmor: number;
    modBackWheels: number;
    modBrakes: number;
    modCustomTiresF: boolean;
    modCustomTiresR: boolean;
    modDashboard: number;
    modDial: number;
    modDoorSpeaker: number;
    modEngine: number;
    modEngineBlock: number;
    modExhaust: number;
    modFender: number;
    modFrame: number;
    modFrontBumper: number;
    modFrontWheels: number;
    modGrille: number;
    modHood: number;
    modHorns: number;
    modHydrolic: number;
    modKit17: number;
    modKit19: number;
    modKit21: number;
    modKit47: number;
    modKit49: number;
    modLivery: number;
    modOrnaments: number;
    modPlateHolder: number;
    modRearBumper: number;
    modRightFender: number;
    modRoof: number;
    modShifterLeavers: number;
    modSmokeEnabled: boolean;
    modSeats: number;
    modSideSkirt: number;
    modSpeakers: number;
    modSpoilers: number;
    modSteeringWheel: number;
    modStruts: number;
    modSuspension: number;
    modTank: number;
    modTransmission: number;
    modTrimA: number;
    modTrimB: number;
    modTrunk: number;
    modTurbo: boolean;
    modVanityPlate: number;
    modWindows: number;
    modXenon: boolean;
};

export type VehicleModification = VehicleModificationMod & {
    color1: number | RGBColor;
    color2: number | RGBColor;
    dashboardColor: number;
    extras: Record<number, boolean>;
    headlightColor: number;
    interiorColor: number;
    liveryRoof: number;
    neonColor: RGBColor;
    neonEnabled: Record<number, boolean>;
    pearlescentColor: number;
    plateIndex: number;
    tyreSmokeColor: RGBColor;
    wheelColor: number;
    wheels: number;
    windowTint: number;
    xenonColor: number;
};

export type VehicleCondition = {
    fuelLevel: number;
    oilLevel: number;
    dirtLevel: number;
    bodyHealth: number;
    engineHealth: number;
    tankHealth: number;
    tireHealth: { [key: number]: number };
    tireBurstCompletely: { [key: number]: boolean };
    tireBurstState: { [key: number]: boolean };
    doorStatus: { [key: number]: boolean };
    windowStatus: { [key: number]: boolean };
};

export type VehicleLsCustomLevel = {
    price: number;
    name: string;
};

export type VehicleLsCustomCategory = {
    label: string;
    levels: VehicleLsCustomLevel[];
};

export type VehicleLsCustom = Partial<Record<keyof VehicleModification, VehicleLsCustomCategory>>;

type VehicleLsCustomBaseConfigItem = {
    priceByLevels: number[];
    label: string;
    mod: VehicleModType;
    prefix?: string;
};

export const VehicleLsCustomBaseConfig: Partial<Record<keyof VehicleModification, VehicleLsCustomBaseConfigItem>> = {
    modEngine: {
        priceByLevels: [0, 0.1, 0.15, 0.2, 0.25, 0.3],
        label: 'Amélioration Moteur',
        mod: VehicleModType.Engine,
        prefix: 'Niveau ',
    },
    modBrakes: {
        priceByLevels: [0, 0.08, 0.1, 0.12, 0.14, 0.16],
        label: 'Amélioration Freins',
        mod: VehicleModType.Brakes,
        prefix: 'Niveau ',
    },
    modTransmission: {
        priceByLevels: [0, 0.08, 0.11, 0.14, 0.17, 0.2],
        label: 'Amélioration Transmission',
        mod: VehicleModType.Gearbox,
        prefix: 'Niveau ',
    },
    modSuspension: {
        priceByLevels: [0, 0.06, 0.09, 0.12, 0.15, 0.18],
        label: 'Amélioration Suspension',
        mod: VehicleModType.Suspension,
        prefix: 'Niveau ',
    },
    modArmor: {
        priceByLevels: [0, 0.25, 0.35, 0.45, 0.55, 0.65],
        label: 'Amélioration Blindage',
        mod: VehicleModType.Armor,
        prefix: 'Niveau ',
    },
    modTurbo: {
        priceByLevels: [0, 0.2],
        label: 'Amélioration Turbo',
        mod: VehicleModType.Turbo,
        prefix: 'Niveau ',
    },
};

export const getDefaultVehicleCondition = (): VehicleCondition => ({
    bodyHealth: 1000,
    doorStatus: {},
    dirtLevel: 0,
    engineHealth: 1000,
    fuelLevel: 100,
    oilLevel: 100,
    tireBurstCompletely: {},
    tireBurstState: {},
    tireHealth: {},
    tankHealth: 1000,
    windowStatus: {},
});

export const getDefaultVehicleModification = (): VehicleModification => ({
    color1: 0,
    color2: 0,
    dashboardColor: 0,
    extras: {},
    headlightColor: 0,
    interiorColor: 0,
    liveryRoof: 0,
    modAerials: 0,
    modAirFilter: 0,
    modAPlate: 0,
    modArchCover: 0,
    modArmor: 0,
    modBackWheels: 0,
    modBrakes: 0,
    modCustomTiresF: false,
    modCustomTiresR: false,
    modDashboard: 0,
    modDial: 0,
    modDoorSpeaker: 0,
    modEngine: 0,
    modEngineBlock: 0,
    modExhaust: 0,
    modFender: 0,
    modFrame: 0,
    modFrontBumper: 0,
    modFrontWheels: 0,
    modGrille: 0,
    modHood: 0,
    modHorns: 0,
    modHydrolic: 0,
    modKit17: 0,
    modKit19: 0,
    modKit21: 0,
    modKit47: 0,
    modKit49: 0,
    modLivery: 0,
    modOrnaments: 0,
    modPlateHolder: 0,
    modRearBumper: 0,
    modRightFender: 0,
    modRoof: 0,
    modShifterLeavers: 0,
    modSmokeEnabled: false,
    modSeats: 0,
    modSideSkirt: 0,
    modSpeakers: 0,
    modSpoilers: 0,
    modSteeringWheel: 0,
    modStruts: 0,
    modSuspension: 0,
    modTank: 0,
    modTransmission: 0,
    modTrimA: 0,
    modTrimB: 0,
    modTrunk: 0,
    modTurbo: false,
    modVanityPlate: 0,
    modWindows: 0,
    modXenon: false,
    neonColor: [0, 0, 0],
    neonEnabled: {},
    pearlescentColor: 0,
    plateIndex: 0,
    tyreSmokeColor: [0, 0, 0],
    wheelColor: 0,
    wheels: 0,
    windowTint: 0,
    xenonColor: 0,
});

export const getDefaultVehicleState = (): VehicleEntityState => ({
    id: null,
    forced: false,
    open: false,
    owner: null,
    plate: null,
    hasRadio: false,
    speedLimit: null,
    deadInWater: false,
    isPlayerVehicle: false,
    condition: getDefaultVehicleCondition(),
});

export const getVehicleCustomPrice = (
    custom: VehicleLsCustom,
    currentModification: VehicleModification,
    newModification: VehicleModification
): number => {
    let price = 0;

    for (const key in custom) {
        const category = custom[key];
        const currentLevel = currentModification[key];

        const newLevel = newModification[key];
        if (currentLevel !== newLevel) {
            const level = category.levels[newLevel];

            if (level) {
                price += level.price;
            }
        }
    }

    return price;
};

export type VehicleMenuData = {
    speedLimit: number;
    engineOn: boolean;
    doorStatus: Record<number, boolean>;
    isDriver: boolean;
    hasRadio: boolean;
};

export type VehicleAuctionMenuData = {
    name: string;
    auction: AuctionVehicle;
};

export type VehicleDealershipMenuData = {
    name: string;
    dealershipId: DealershipType;
    dealership?: DealershipConfigItem;
    vehicles: Vehicle[];
};

export type VehicleCustomMenuData = {
    vehicle: number;
    custom: VehicleLsCustom;
    currentModification: VehicleModification;
};

export enum VehicleCategory {
    Boats = 'Bateaux',
    Commercial = 'Commercial',
    Compacts = 'Compactes',
    Coupes = 'Coupés',
    Cycles = 'Vélos',
    Emergency = "Véhicules d'urgence",
    Helicopters = 'Hélicoptères',
    Industrial = 'Industriels',
    Military = 'Militaires',
    Motorcycles = 'Motos',
    Muscle = 'Grosses Cylindrées',
    'Off-road' = 'Tout-terrain',
    Openwheel = 'Ultra-rapide',
    Planes = 'Avions',
    Sedans = 'Berlines',
    Service = 'Service',
    Sportsclassics = 'Sportives Classiques',
    Sports = 'Sportives',
    Super = 'Super-sportives',
    Suvs = 'SUV',
    Trains = 'Trains',
    Utility = 'Utilitaires',
    Vans = 'Vans',
}
