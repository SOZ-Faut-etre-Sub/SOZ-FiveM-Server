import { joaat } from '@public/shared/joaat';
import { RadioChannel } from '@public/shared/voip';

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
    dealershipId?: DealershipId | string;
    requiredLicence?: string;
    size: number;
    jobName?: { [key in JobType]: string };
    stock: number;
    maxStock: number;
};

export type VehicleHud = {
    seat: number | null;
    engineHealth: number;
    oilLevel: number;
    lockStatus: VehicleLockStatus;
    seatbelt: boolean | null;
    lightState: number;
    fuelType: 'essence' | 'electric' | 'none';
    fuelLevel: number;
    useRpm: boolean;
};

export type VehicleHudSpeed = {
    speed: number;
    rpm: number;
};

export type VehicleSpawn = {
    hash: number;
    model: string;
    position: Vector4;
    warp: boolean;
    modification?: VehicleConfiguration;
};

export enum VehicleSeat {
    Driver = -1,
    Copilot = 0,
    BackLeft = 1,
    BackRight = 2,
    ExtraSeat1 = 3,
    ExtraSeat2 = 4,
    ExtraSeat3 = 5,
    ExtraSeat4 = 6,
    ExtraSeat5 = 7,
    ExtraSeat6 = 8,
    ExtraSeat7 = 9,
    ExtraSeat8 = 10,
    ExtraSeat9 = 11,
    ExtraSeat10 = 12,
    ExtraSeat11 = 13,
    ExtraSeat12 = 14,
    ExtraSeat13 = 15,
}

export enum VehicleSyncStrategy {
    None, // no need to sync
    Copilot, // copilot only
    AllInVehicle, // all players in vehicle
    AllServer, // all players in server
}

export enum VehicleLightState {
    Off,
    LowBeam,
    HighBeam,
}

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

// state not sync to database, only in memory
export type VehicleVolatileState = {
    id: number | null;
    spawned: boolean;
    forced: boolean;
    open: boolean;
    plate: string | null;
    owner: string | null;
    speedLimit: number | null;
    isPlayerVehicle: boolean;
    isSirenMuted: boolean;
    indicators: {
        left: boolean;
        right: boolean;
    };
    openWindows: boolean;
    dead: boolean;
    hasRadio: boolean;
    radioEnabled: boolean;
    primaryRadio: RadioChannel | null;
    secondaryRadio: RadioChannel | null;
    flatbedAttachedVehicle: number | null;
    rentOwner: string | null;
    policeLocatorEnabled: boolean;
    job: JobType | null;
    model: string;
    locatorEndJam: number;
    label: string;
    neonLightsStatus: boolean | null;
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

export enum VehicleType {
    Automobile = 'automobile',
    Bike = 'bike',
    Boat = 'boat',
    Helicopter = 'heli',
    Plane = 'plane',
    Submarine = 'submarine',
    Trailer = 'trailer',
    Train = 'train',
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

export const getDefaultVehicleVolatileState = (): VehicleVolatileState => ({
    id: null,
    forced: false,
    open: false,
    owner: null,
    plate: null,
    speedLimit: null,
    dead: false,
    isPlayerVehicle: false,
    isSirenMuted: false,
    spawned: false,
    indicators: {
        left: false,
        right: false,
    },
    openWindows: false,
    hasRadio: false,
    radioEnabled: false,
    primaryRadio: null,
    secondaryRadio: null,
    flatbedAttachedVehicle: null,
    rentOwner: null,
    policeLocatorEnabled: false,
    job: null,
    model: null,
    locatorEndJam: 0,
    label: null,
    neonLightsStatus: true,
});

export type VehicleMenuData = {
    speedLimit: number;
    engineOn: boolean;
    doorStatus: Record<number, boolean>;
    isDriver: boolean;
    hasRadio: boolean;
    insideLSCustom: boolean;
    permission: string | null;
    isBoat: boolean;
    isAnchor: boolean;
    police: boolean;
    policeLocator: boolean;
    onDutyNg: boolean;
    pitstopPrice: number;
    neonLightsStatus: boolean;
    hasNeon: boolean;
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

export const VehicleMidDamageThreshold = 700;
export const VehicleHighDamageThreshold = 400;
export const VehicleCriticalDamageThreshold = 101;

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
    Electric = 'Electriques',
    Quads = 'Quads',
}

export const VehicleElectricModels: Record<number, string> = {
    [-1130810103]: 'Dilettante',
    [544021352]: 'Khamelion',
    [-1894894188]: 'Surge',
    [-1622444098]: 'Voltic',
    [1392481335]: 'Cyclone',
    [-1848994066]: 'Neon',
    [-1529242755]: 'Raiden',
    [1031562256]: 'Tezeract',
    [-1132721664]: 'Imorgon',
    [662793086]: 'I-Wagen',
    [-505223465]: 'Omnis e-GT',
    [1147287684]: 'Caddy',
    [1560980623]: 'Airtug',
    [989294410]: 'Rocket Voltic',
    [-2066002122]: 'lspdgallardo',
    [-107240429]: 'bcsoc7',
    [joaat('dilettante2')]: 'Dilettante 2',
    [joaat('virtue')]: 'Virtue',
    [joaat('powersurge')]: 'Power Surge',
    [joaat('coureur')]: 'La Coureuse',
    [joaat('buffalo5')]: 'Buffalo EVX',
};

export const VehicleTrailerModels: Record<number, string> = {
    [joaat('tanker')]: 'Tanker',
    [joaat('trailerlogs')]: 'Trailer Logs',
};

export const isVehicleModelTrailer = (model: number): boolean => {
    return VehicleTrailerModels[model] != null;
};

export const isVehicleModelElectric = (model: number): boolean => {
    return VehicleElectricModels[model] != null;
};

export const VehicleTypeFromClass: Record<VehicleClass, VehicleType> = {
    [VehicleClass.Compacts]: VehicleType.Automobile,
    [VehicleClass.Sedans]: VehicleType.Automobile,
    [VehicleClass.SUVs]: VehicleType.Automobile,
    [VehicleClass.Coupes]: VehicleType.Automobile,
    [VehicleClass.Muscle]: VehicleType.Automobile,
    [VehicleClass.SportsClassics]: VehicleType.Automobile,
    [VehicleClass.Sports]: VehicleType.Automobile,
    [VehicleClass.Super]: VehicleType.Automobile,
    [VehicleClass.Motorcycles]: VehicleType.Bike,
    [VehicleClass.OffRoad]: VehicleType.Automobile,
    [VehicleClass.Industrial]: VehicleType.Automobile,
    [VehicleClass.Utility]: VehicleType.Trailer,
    [VehicleClass.Vans]: VehicleType.Automobile,
    [VehicleClass.Cycles]: VehicleType.Bike,
    [VehicleClass.Boats]: VehicleType.Boat,
    [VehicleClass.Helicopters]: VehicleType.Helicopter,
    [VehicleClass.Planes]: VehicleType.Plane,
    [VehicleClass.Service]: VehicleType.Automobile,
    [VehicleClass.Emergency]: VehicleType.Automobile,
    [VehicleClass.Military]: VehicleType.Automobile,
    [VehicleClass.Commercial]: VehicleType.Automobile,
    [VehicleClass.Trains]: VehicleType.Train,
};

export const LockPickAlertChance = 0.5;

export const LockPickAlertMessage = {
    all: [
        'Dans ${0}, ça essaye de tirer une caisse, juste devant moi là ! Juste là !',
        "Encore un clodo qui essaye de dormir au chaud ce soir à ${0} , mais ce n'est pas dans sa voiture…",
        'BORDEL MA CAISSE ! ON ME VOLE MA CAISSE ! JE SUIS PROCHE DE ${0} !',
        "Hey ! J'ai un vol de voiture sous les yeux, venez vite à ${0} !",
        "Mais où êtes vous ?! Quelqu'un vole des véhicules aux alentours de ${0} !",
    ],
    carjack: [
        "J'viens de me faire carjacker ! Mais oui, on m'a carjacké l'auto j'vous dis ! Cela s'est déroulé à ${0} !",
    ],
    lockpick: ["Une personne louche tripote la poignée d'une voiture proche de ${0} !"],
};

export type VehicleLocation = {
    netId: number;
    job: JobType;
    plate: string;
    name: string;
    model: string;
    position: Vector3;
};

export const ALLOWED_AIR_CONTROL: Partial<Record<VehicleClass, true>> = {
    [VehicleClass.Helicopters]: true,
    [VehicleClass.Motorcycles]: true,
    [VehicleClass.Cycles]: true,
    [VehicleClass.Boats]: true,
    [VehicleClass.Planes]: true,
    [VehicleClass.Military]: true,
};
