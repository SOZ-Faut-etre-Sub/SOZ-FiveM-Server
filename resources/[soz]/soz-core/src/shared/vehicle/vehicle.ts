import { PlaneCostMultiplier } from '@private/shared/business.smuggling';
import { VehicleBusinessImportConf } from '@private/shared/business.vehicle';
import { joaat } from '@public/shared/joaat';
import { PlayerLicenceType } from '@public/shared/player';
import { RadioChannel } from '@public/shared/voip';

import { DealershipConfigItem, DealershipType } from '../../config/dealership';
import { JobType } from '../job';
import { NamedZone } from '../polyzone/box.zone';
import { Vector3, Vector4 } from '../polyzone/vector';
import { AuctionVehicle } from './auction';
import { VehicleConfiguration, VehicleHandlingType } from './modification';

export type Vehicle = {
    model: string;
    hash: number;
    name: string;
    price: number;
    category: string;
    dealershipId?: DealershipType | string;
    requiredLicence?: string;
    size: number;
    jobName?: { [key in JobType]: string };
    stock: number;
    maxStock: number;
    handling?: Record<VehicleHandlingType, number>;
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
    vehCategory: string;
    useRpm: boolean;
    nosLevel: number | null;
};

export type VehicleHudSpeed = {
    speed: number;
    rpm: number;
    gear: number;
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

export const DoorType = {
    Door: 'door',
    Bone: 'bone',
};

export type VehicleSeatConfig = {
    type: string;
    doorIndex?: number;
    seatIndex: number;
    seatBone?: string;
    doorBone?: string;
};

export const SEATS_CONFIG: Record<string, VehicleSeatConfig> = {
    ['driver_seat']: {
        type: DoorType.Door,
        doorIndex: VehicleDoorIndex.FrontLeftDoor,
        seatIndex: VehicleSeat.Driver,
        seatBone: 'seat_dside_f',
        doorBone: 'door_dside_f',
    },
    ['passenger_seat']: {
        type: DoorType.Door,
        doorIndex: VehicleDoorIndex.FrontRightDoor,
        seatIndex: VehicleSeat.Copilot,
        seatBone: 'seat_pside_f',
        doorBone: 'door_pside_f',
    },
    ['rear_left_seat']: {
        type: DoorType.Door,
        doorIndex: VehicleDoorIndex.BackLeftDoor,
        seatIndex: VehicleSeat.BackLeft,
        seatBone: 'seat_dside_r',
        doorBone: 'door_dside_r',
    },
    ['rear_right_seat']: {
        type: DoorType.Door,
        doorIndex: VehicleDoorIndex.BackRightDoor,
        seatIndex: VehicleSeat.BackRight,
        seatBone: 'seat_pside_r',
        doorBone: 'door_pside_r',
    },
    ['extra_1']: {
        type: DoorType.Bone,
        seatIndex: VehicleSeat.ExtraSeat1,
        seatBone: 'wheel_lr',
    },
    ['extra_2']: {
        type: DoorType.Bone,
        seatIndex: VehicleSeat.ExtraSeat2,
        seatBone: 'wheel_rr',
    },
    ['extra_3']: {
        type: DoorType.Bone,
        seatIndex: VehicleSeat.ExtraSeat3,
        seatBone: 'wheel_lr',
    },
    ['extra_4']: {
        type: DoorType.Bone,
        seatIndex: VehicleSeat.ExtraSeat5,
        seatBone: 'wheel_rr',
    },
    ['extra_5']: {
        type: DoorType.Bone,
        seatIndex: VehicleSeat.ExtraSeat6,
        seatBone: 'wheel_lr',
    },
    ['extra_6']: {
        type: DoorType.Bone,
        seatIndex: VehicleSeat.ExtraSeat7,
        seatBone: 'wheel_rr',
    },
    ['extra_7']: {
        type: DoorType.Bone,
        seatIndex: VehicleSeat.ExtraSeat8,
        seatBone: 'wheel_lr',
    },
    ['extra_8']: {
        type: DoorType.Bone,
        seatIndex: VehicleSeat.ExtraSeat9,
        seatBone: 'wheel_rr',
    },
    ['extra_9']: {
        type: DoorType.Bone,
        seatIndex: VehicleSeat.ExtraSeat10,
        seatBone: 'wheel_lr',
    },
    ['extra_10']: {
        type: DoorType.Bone,
        seatIndex: VehicleSeat.ExtraSeat11,
        seatBone: 'wheel_rr',
    },
    ['extra_11']: {
        type: DoorType.Bone,
        seatIndex: VehicleSeat.ExtraSeat12,
        seatBone: 'wheel_lr',
    },
    ['extra_12']: {
        type: DoorType.Bone,
        seatIndex: VehicleSeat.ExtraSeat13,
        seatBone: 'wheel_rr',
    },
};

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
    nitro: number;
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
    ambulanceAttachedStretcher: number | null;
    rentOwner: string | null;
    policeLocatorEnabled: boolean;
    job: JobType | null;
    model: string;
    locatorEndJam: number;
    label: string;
    neonLightsStatus: boolean | null;
    fingerprint: string | null;
    lastDrugTrace: string[] | null;
    isAnalyzed: boolean;
    stolenLocator: boolean;
    exportBiz: boolean;
    nitroReloadStart: number;
};

export type VehicleState = {
    volatile: VehicleVolatileState;
    condition: VehicleCondition;
    configuration: VehicleConfiguration;
    position: Vector4 | null;
    owner: number;
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
    OpenWheel = 22,
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
    nitro: 0,
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
    ambulanceAttachedStretcher: null,
    rentOwner: null,
    policeLocatorEnabled: false,
    job: null,
    model: null,
    locatorEndJam: 0,
    label: null,
    neonLightsStatus: true,
    fingerprint: null,
    lastDrugTrace: null,
    isAnalyzed: false,
    stolenLocator: false,
    exportBiz: false,
    nitroReloadStart: 0,
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
    crimiPerformance: boolean;
    crimiCustom: boolean;
};

export enum LSCustomMode {
    Admin = 'admin',
    CrimiPerfo = 'crimi_perfo',
    CrimiCusto = 'crimi_custom',
    LsCustom = 'ls_custom',
    NewGahray = 'new_gahray',
}

export type VehicleAuctionMenuData = {
    name: string;
    auction: AuctionVehicle;
    isAuctionDisable: boolean;
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
    [joaat('dilettante')]: 'Dilettante',
    [joaat('khamelion')]: 'Khamelion',
    [joaat('surge')]: 'Surge',
    [joaat('voltic')]: 'Voltic',
    [joaat('cyclone')]: 'Cyclone',
    [joaat('neon')]: 'Neon',
    [joaat('raiden')]: 'Raiden',
    [joaat('tezeract')]: 'Tezeract',
    [joaat('imorgon')]: 'Imorgon',
    [joaat('iwagen')]: 'I-Wagen',
    [joaat('omnisegt')]: 'Omnis e-GT',
    [joaat('caddy')]: 'Caddy',
    [1560980623]: 'Airtug',
    [989294410]: 'Rocket Voltic',
    [-430238662]: 'lspd40',
    [-635002646]: 'bcso40',
    [joaat('dilettante2')]: 'Dilettante 2',
    [joaat('virtue')]: 'Virtue',
    [joaat('powersurge')]: 'Power Surge',
    [joaat('coureur')]: 'La Coureuse',
    [joaat('buffalo5')]: 'Buffalo EVX',
    [joaat('vivanite')]: 'Vivanite',
    [joaat('pipistrello')]: 'Pipistrello',
    [joaat('envisage')]: 'Envisage',
};

export const VehicleElectricModelClass: Record<number, VehicleClass> = {
    [joaat('dilettante')]: VehicleClass.Compacts,
    [joaat('khamelion')]: VehicleClass.Sports,
    [joaat('surge')]: VehicleClass.Sedans,
    [joaat('voltic')]: VehicleClass.Super,
    [joaat('cyclone')]: VehicleClass.Super,
    [joaat('neon')]: VehicleClass.Sports,
    [joaat('raiden')]: VehicleClass.Sports,
    [joaat('tezeract')]: VehicleClass.Super,
    [joaat('imorgon')]: VehicleClass.Sports,
    [joaat('iwagen')]: VehicleClass.SUVs,
    [joaat('omnisegt')]: VehicleClass.Sports,
    [joaat('caddy')]: VehicleClass.Utility,
    [1560980623]: VehicleClass.Utility,
    [989294410]: VehicleClass.Super,
    [-430238662]: VehicleClass.Super,
    [-635002646]: VehicleClass.Emergency,
    [joaat('dilettante2')]: VehicleClass.Compacts,
    [joaat('virtue')]: VehicleClass.Super,
    [joaat('powersurge')]: VehicleClass.Motorcycles,
    [joaat('coureur')]: VehicleClass.Sports,
    [joaat('buffalo5')]: VehicleClass.Muscle,
    [joaat('vivanite')]: VehicleClass.SUVs,
    [joaat('pipistrello')]: VehicleClass.Super,
    [joaat('envisage')]: VehicleClass.Sports,
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
    [VehicleClass.OpenWheel]: VehicleType.Automobile,
};

export const PushableVehicleClass: Record<VehicleClass, boolean> = {
    [VehicleClass.Compacts]: true,
    [VehicleClass.Sedans]: true,
    [VehicleClass.SUVs]: true,
    [VehicleClass.Coupes]: true,
    [VehicleClass.Muscle]: true,
    [VehicleClass.SportsClassics]: true,
    [VehicleClass.Sports]: true,
    [VehicleClass.Super]: true,
    [VehicleClass.Motorcycles]: false,
    [VehicleClass.OffRoad]: true,
    [VehicleClass.Industrial]: false,
    [VehicleClass.Utility]: false,
    [VehicleClass.Vans]: true,
    [VehicleClass.Cycles]: false,
    [VehicleClass.Boats]: false,
    [VehicleClass.Helicopters]: false,
    [VehicleClass.Planes]: false,
    [VehicleClass.Service]: false,
    [VehicleClass.Emergency]: true,
    [VehicleClass.Military]: false,
    [VehicleClass.Commercial]: false,
    [VehicleClass.Trains]: false,
    [VehicleClass.OpenWheel]: false,
};

export const NotPushableVehicleModel: string[] = ['firetruk', 'brickade', 'brickade1'];
export const PushableVehicleModel: string[] = ['caddy', 'sadler1', 'utillitruck2', 'utillitruck3', 'utillitruck4'];

export const LockPickAlertChance = 0.1;

export const LockPickAlertMessage = {
    all: [
        'Dans ${0}, ça essaye de tirer une ${1}, juste devant moi là ! Juste là !',
        "Encore un clodo qui essaye de dormir au chaud ce soir à ${0} , mais cette ${1} n'est pas à lui",
        'BORDEL MA CAISSE ! ON ME VOLE MA ${1} ! JE SUIS PROCHE DE ${0} !',
        "Hey ! J'ai un vol d'une ${1} sous les yeux, venez vite à ${0} !",
        "Mais où êtes vous ?! Quelqu'un vole des ${1} aux alentours de ${0} !",
    ],
    carjack: [
        "J'viens de me faire carjacker ! Mais oui, on m'a carjacké l'auto j'vous dis ! Cela s'est déroulé à ${0}, une ${1} !",
    ],
    lockpick: ["Une personne louche tripote la poignée d'une ${1} proche de ${0} !"],
};

export type VehicleLocation = {
    netId: number;
    job: JobType;
    plate: string;
    name: string;
    model: string;
    position: Vector3;
    stolen: boolean;
};

export const ALLOWED_AIR_CONTROL: Partial<Record<VehicleClass, true>> = {
    [VehicleClass.Helicopters]: true,
    [VehicleClass.Motorcycles]: true,
    [VehicleClass.Cycles]: true,
    [VehicleClass.Boats]: true,
    [VehicleClass.Planes]: true,
    [VehicleClass.Military]: true,
};

//update MissiveVehicleModelList when toggle
export const DisableNPCBike = false;

export const VehicleClassFuelStorageMultiplier: Record<string, number> = {
    [PlayerLicenceType.Moto]: 0.75,
};

export const VEHICLE_TRUNK_TYPES = {
    [joaat('tanker')]: 'tanker',
    [joaat('tanker2')]: 'tanker',
    [joaat('trailerlogs')]: 'trailerlogs',
    [joaat('brickade')]: 'brickade',
    [joaat('brickade1')]: 'brickade',
    [joaat('trash')]: 'trash',
    [joaat('tiptruck2')]: 'tiptruck',
};

export type VehicleOrder = {
    uuid: string;
    model: string;
    job: JobType;
    deliverDate: number;
    gang: number;
    citizenId: string;
    license: string;
    garage: string;
};

export enum VehicleOrderMode {
    Job = 'job',
    Crimi = 'crimi',
    Cartel = 'cartel',
}

export type VehicleOrderMenuData = {
    dealerships: string[];
    mode: VehicleOrderMode;
};

export type VehicleOrderConfig = {
    zone: NamedZone;
    waitingTime: number;
    garage: string;
    account: string;
    farm: string;
};

export const VehicleOrderCostMuliplier: Record<VehicleOrderMode, number> = {
    [VehicleOrderMode.Crimi]: VehicleBusinessImportConf.CostMuliplier,
    [VehicleOrderMode.Job]: 0.01,
    [VehicleOrderMode.Cartel]: PlaneCostMultiplier,
};
