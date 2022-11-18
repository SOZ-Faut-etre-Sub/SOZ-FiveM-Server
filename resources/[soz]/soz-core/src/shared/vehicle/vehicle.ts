import { DealershipConfigItem, DealershipType } from '../../config/dealership';
import { JobType } from '../job';
import { Vector3, Vector4 } from '../polyzone/vector';
import { AuctionVehicle } from './auction';
import { DealershipId } from './dealership';
import { VehicleConfiguration } from './modification';

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
    maxStock: number;
};

export type VehicleSpawn = {
    hash: number;
    model: string;
    position: Vector4;
    warp: boolean;
    state: VehicleEntityState;
    modification?: VehicleConfiguration;
};

export enum VehicleLockStatus {
    None,
    Unlocked,
    Locked,
    LockedForPlayer,
    StickPlayerInside,
    CanBeBrokenInto = 7,
    CanBeBrokenIntoPersist,
    CannotBeTriedToEnter = 10,
}

export enum VehicleWindowIndex {
    FrontRightWindow = 1,
    FrontLeftWindow = 0,
    BackRightWindow = 3,
    BackLeftWindow = 2,
    ExtraWindow1 = 4,
    ExtraWindow2 = 5,
    ExtraWindow3 = 6,
    ExtraWindow4 = 7,
}

export enum VehicleDoorIndex {
    FrontRightDoor = 1,
    FrontLeftDoor = 0,
    BackRightDoor = 3,
    BackLeftDoor = 2,
    Hood = 4,
    Trunk = 5,
}

export enum VehicleWheelIndex {
    FrontLeftWheel,
    FrontRightWheel,
    MidLeftWheel,
    MidRightWheel,
    RearLeftWheel,
    RearRightWheel,
    TrailerMidLeftWheel = 45,
    TrailerMidRightWheel = 47,
}

export type VehicleCondition = {
    fuelLevel: number;
    oilLevel: number;
    dirtLevel: number;
    bodyHealth: number;
    engineHealth: number;
    tankHealth: number;
    tireTemporaryRepairDistance: { [key: number]: number };
    tireHealth: { [key: number]: number };
    tireBurstCompletely: { [key: number]: boolean };
    tireBurstState: { [key: number]: boolean };
    doorStatus: { [key: number]: boolean };
    windowStatus: { [key: number]: boolean };
    mileage: number;
};

export type VehicleEntityState = {
    id: number | null;
    spawned: boolean;
    forced: boolean;
    open: boolean;
    plate: string | null;
    owner: string | null;
    speedLimit: number | null;
    isPlayerVehicle: boolean;
    yoloMode: boolean;
    lastPosition: Vector3 | null;
    indicators: {
        left: boolean;
        right: boolean;
    };
    openWindows: boolean;

    dead: boolean;
    condition: VehicleCondition;
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

export const getDefaultVehicleCondition = (): VehicleCondition => ({
    bodyHealth: 1000,
    doorStatus: {},
    dirtLevel: 0,
    engineHealth: 1000,
    fuelLevel: 100,
    oilLevel: 100,
    tireTemporaryRepairDistance: {},
    tireBurstCompletely: {},
    tireBurstState: {},
    tireHealth: {},
    tankHealth: 1000,
    windowStatus: {},
    mileage: 0,
});

export const getDefaultVehicleState = (): VehicleEntityState => ({
    id: null,
    forced: false,
    open: false,
    owner: null,
    plate: null,
    speedLimit: null,
    dead: false,
    isPlayerVehicle: false,
    yoloMode: false,
    lastPosition: null,
    spawned: false,
    indicators: {
        left: false,
        right: false,
    },
    openWindows: false,
    condition: getDefaultVehicleCondition(),
});

export type VehicleMenuData = {
    speedLimit: number;
    engineOn: boolean;
    doorStatus: Record<number, boolean>;
    isDriver: boolean;
    hasRadio: boolean;
    insideLSCustom: boolean;
    permission: string | null;
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

export const VehicleMaxStock: Record<keyof typeof VehicleCategory, number> = {
    Boats: 0,
    Commercial: 0,
    Compacts: 8,
    Coupes: 6,
    Cycles: 100,
    Emergency: 0,
    Helicopters: 3,
    Industrial: 0,
    Military: 0,
    Motorcycles: 6,
    'Off-road': 4,
    Planes: 0,
    Sedans: 6,
    Service: 0,
    Suvs: 4,
    Super: 0,
    Sports: 0,
    Sportsclassics: 0,
    Trains: 0,
    Utility: 0,
    Vans: 6,
    Openwheel: 0,
    Muscle: 3,
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
