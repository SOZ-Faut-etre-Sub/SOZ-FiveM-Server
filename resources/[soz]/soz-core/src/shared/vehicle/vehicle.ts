import { DealershipConfigItem, DealershipType } from '../../config/dealership';
import { JobType } from '../job';
import { Vector4 } from '../polyzone/vector';
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

export type VehicleMenuData = {
    speedLimit: number;
    engineOn: boolean;
    doorStatus: Record<number, boolean>;
    isDriver: boolean;
    hasRadio: boolean;
    insideLSCustom: boolean;
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
