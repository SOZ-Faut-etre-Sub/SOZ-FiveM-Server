import { RGBColor } from './color';
import { Vector4 } from './polyzone/vector';

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

    deadInWater: boolean;
    condition: VehicleCondition;
    hasRadio: boolean;
};

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
    condition: getDefaultVehicleCondition(),
});

export type VehicleMenuData = {
    speedLimit: number;
    engineOn: boolean;
    doorStatus: Record<number, boolean>;
    isDriver: boolean;
    hasRadio: boolean;
};
