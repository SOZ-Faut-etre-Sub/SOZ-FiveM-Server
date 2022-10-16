import { Inject, Injectable } from '../../core/decorators/injectable';
import { RGBColor } from '../../shared/color';
import {
    VehicleCondition,
    VehicleEntityState,
    VehicleModification,
    VehicleModificationMod,
    VehicleModType,
} from '../../shared/vehicle';
import { Qbcore } from '../qbcore';

type VehicleModificationModSync<T extends keyof VehicleModificationMod> = {
    get: (vehicle: number) => VehicleModificationMod[T];
    set: (vehicle: number, value: VehicleModificationMod[T], modification: VehicleModification) => void;
};

const SetVehicleModMap: Record<
    keyof VehicleModificationMod,
    VehicleModType | VehicleModificationModSync<keyof VehicleModificationMod>
> = {
    modSpoilers: VehicleModType.Spoiler,
    modFrontBumper: VehicleModType.FrontBumper,
    modRearBumper: VehicleModType.RearBumper,
    modSideSkirt: VehicleModType.SideSkirt,
    modExhaust: VehicleModType.Exhaust,
    modFrame: VehicleModType.Chassis,
    modGrille: VehicleModType.Grill,
    modHood: VehicleModType.Hood,
    modFender: VehicleModType.LeftWing,
    modRightFender: VehicleModType.RightWing,
    modRoof: VehicleModType.Roof,
    modEngine: VehicleModType.Engine,
    modBrakes: VehicleModType.Brakes,
    modTransmission: VehicleModType.Gearbox,
    modHorns: VehicleModType.Horn,
    modSuspension: VehicleModType.Suspension,
    modArmor: VehicleModType.Armor,
    modKit17: VehicleModType.Nitrous,
    modKit19: VehicleModType.Subwoofer,
    modKit21: VehicleModType.Hydraulics,
    modXenon: VehicleModType.XenonLights,
    modFrontWheels: VehicleModType.FrontWheels,
    modBackWheels: VehicleModType.RearWheels,
    modPlateHolder: VehicleModType.PlateHolder,
    modVanityPlate: VehicleModType.VanityPlates,
    modTrimA: VehicleModType.Interior,
    modOrnaments: VehicleModType.Ornaments,
    modDashboard: VehicleModType.Dashboard,
    modDial: VehicleModType.DialDesign,
    modDoorSpeaker: VehicleModType.DoorSpeaker,
    modSeats: VehicleModType.Seats,
    modSteeringWheel: VehicleModType.SteeringWheels,
    modShifterLeavers: VehicleModType.Knobs,
    modAPlate: VehicleModType.Plaques,
    modSpeakers: VehicleModType.Speakers,
    modTrunk: VehicleModType.Trunk,
    modHydrolic: VehicleModType.Hydraulics2,
    modEngineBlock: VehicleModType.EngineBlock,
    modAirFilter: VehicleModType.AirFilter,
    modStruts: VehicleModType.Struts,
    modArchCover: VehicleModType.Chassis2,
    modAerials: VehicleModType.Chassis3,
    modTrimB: VehicleModType.Chassis4,
    modTank: VehicleModType.Tank,
    modWindows: VehicleModType.LeftDoor,
    modKit47: VehicleModType.RightDoor,
    modKit49: VehicleModType.Livery,
    modLivery: {
        get(vehicle): number {
            let modLivery = GetVehicleMod(vehicle, VehicleModType.Livery);

            if (GetVehicleMod(vehicle, VehicleModType.Livery) === -1 && GetVehicleLivery(vehicle) !== 0) {
                modLivery = GetVehicleLivery(vehicle);
            }

            return modLivery;
        },
        set(vehicle, value) {
            if (value) {
                SetVehicleMod(vehicle, VehicleModType.Livery, value, false);

                if (value !== -1) {
                    SetVehicleLivery(vehicle, value);
                } else {
                    SetVehicleLivery(vehicle, 0);
                }
            }
        },
    } as VehicleModificationModSync<'modLivery'>,
    modCustomTiresF: {
        get(vehicle): boolean {
            return GetVehicleModVariation(vehicle, VehicleModType.FrontWheels);
        },
        set(vehicle, value, modification) {
            if (value) {
                SetVehicleMod(vehicle, VehicleModType.FrontWheels, modification.modFrontWheels, value);
            }
        },
    } as VehicleModificationModSync<'modCustomTiresF'>,
    modCustomTiresR: {
        get(vehicle): boolean {
            return GetVehicleModVariation(vehicle, VehicleModType.RearWheels);
        },
        set(vehicle, value, modification) {
            if (value) {
                SetVehicleMod(vehicle, VehicleModType.RearWheels, modification.modBackWheels, value);
            }
        },
    } as VehicleModificationModSync<'modCustomTiresR'>,
    modTurbo: {
        get(vehicle): boolean {
            return IsToggleModOn(vehicle, VehicleModType.Turbo);
        },
        set(vehicle, value) {
            ToggleVehicleMod(vehicle, VehicleModType.Turbo, value);
        },
    } as VehicleModificationModSync<'modTurbo'>,
    modSmokeEnabled: {
        get(vehicle): boolean {
            return IsToggleModOn(vehicle, VehicleModType.TireSmoke);
        },
        set(vehicle, value) {
            value;
            ToggleVehicleMod(vehicle, VehicleModType.TireSmoke, value);
        },
    } as VehicleModificationModSync<'modSmokeEnabled'>,
};

@Injectable()
export class VehicleService {
    @Inject(Qbcore)
    private QBCore: Qbcore;

    public getVehicleProperties(vehicle: number): any[] {
        return this.QBCore.getVehicleProperties(vehicle);
    }

    public syncVehicle(vehicle: number, state: VehicleEntityState): void {
        SetVehicleModKit(vehicle, 0);

        if (state.plate) {
            SetVehicleNumberPlateText(vehicle, state.plate);
        }

        this.applyVehicleModification(vehicle, state.modification);
        this.applyVehicleCondition(vehicle, state.condition);
    }
    public applyVehicleCondition(vehicle: number, condition: VehicleCondition): void {
        SetVehicleFuelLevel(vehicle, condition.fuelLevel + 0.0);
        SetVehicleOilLevel(vehicle, condition.oilLevel + 0.0);
        SetVehicleDirtLevel(vehicle, condition.dirtLevel + 0.0);
        SetVehicleBodyHealth(vehicle, condition.bodyHealth);
        SetVehicleEngineHealth(vehicle, condition.engineHealth);
        SetVehiclePetrolTankHealth(vehicle, condition.tankHealth);

        for (const [key, value] of Object.entries(condition.tireHealth)) {
            SetVehicleWheelHealth(vehicle, parseInt(key, 10), value);
        }

        for (const [key, value] of Object.entries(condition.tireBurstState)) {
            if (value) {
                SetVehicleTyreBurst(vehicle, parseInt(key, 10), false, 1000);
            }
        }

        for (const [key, value] of Object.entries(condition.tireBurstCompletely)) {
            if (value) {
                SetVehicleTyreBurst(vehicle, parseInt(key, 10), true, 1000);
            }
        }

        for (const [key, value] of Object.entries(condition.doorStatus)) {
            if (value) {
                SetVehicleDoorBroken(vehicle, parseInt(key, 10), true);
            }
        }

        for (const [key, value] of Object.entries(condition.windowStatus)) {
            if (value) {
                SmashVehicleWindow(vehicle, parseInt(key, 10));
            }
        }
    }

    public getVehicleCondition(vehicle: number): VehicleCondition {
        const tireHealth = {};
        const tireBurstState = {};
        const tireBurstCompletely = {};
        const windowStatus = {};
        const doorStatus = {};

        for (let i = 0; i < 6; i++) {
            tireHealth[i] = GetVehicleWheelHealth(vehicle, i);
        }

        for (let i = 0; i < 6; i++) {
            tireBurstState[i] = IsVehicleTyreBurst(vehicle, i, false);
        }

        for (let i = 0; i < 6; i++) {
            tireBurstCompletely[i] = IsVehicleTyreBurst(vehicle, i, true);
        }

        for (let i = 0; i < 8; i++) {
            windowStatus[i] = IsVehicleWindowIntact(vehicle, i);
        }

        for (let i = 0; i < 6; i++) {
            doorStatus[i] = IsVehicleDoorDamaged(vehicle, i);
        }

        return {
            fuelLevel: GetVehicleFuelLevel(vehicle),
            oilLevel: GetVehicleOilLevel(vehicle),
            dirtLevel: GetVehicleDirtLevel(vehicle),
            bodyHealth: GetVehicleBodyHealth(vehicle),
            engineHealth: GetVehicleEngineHealth(vehicle),
            tankHealth: GetVehiclePetrolTankHealth(vehicle),
            tireHealth,
            tireBurstCompletely,
            tireBurstState,
            doorStatus,
            windowStatus,
        };
    }

    public applyVehicleModification(vehicle: number, modification: VehicleModification): void {
        if (modification.extras) {
            for (const extra of Object.keys(modification.extras)) {
                SetVehicleExtra(vehicle, parseInt(extra, 10), modification.extras[extra]);
            }
        }

        let [colorPrimary, colorSecondary] = GetVehicleColours(vehicle);
        const [pearlescentColor, wheelColor] = GetVehicleExtraColours(vehicle);

        SetVehicleModKit(vehicle, 0);

        if (modification.plateIndex) {
            SetVehicleNumberPlateTextIndex(vehicle, modification.plateIndex);
        }

        if (modification.color1) {
            if (typeof modification.color1 === 'number') {
                colorPrimary = modification.color1;
                SetVehicleColours(vehicle, modification.color1, colorSecondary);
            } else {
                SetVehicleCustomPrimaryColour(
                    vehicle,
                    modification.color1[0],
                    modification.color1[1],
                    modification.color1[2]
                );
            }
        }

        if (modification.color2) {
            if (typeof modification.color2 === 'number') {
                colorSecondary = modification.color2;
                SetVehicleColours(vehicle, colorPrimary, colorSecondary);
            } else {
                SetVehicleCustomSecondaryColour(
                    vehicle,
                    modification.color2[0],
                    modification.color2[1],
                    modification.color2[2]
                );
            }
        }

        if (modification.pearlescentColor) {
            SetVehicleExtraColours(vehicle, modification.pearlescentColor, wheelColor);
        }

        if (modification.wheelColor) {
            SetVehicleExtraColours(vehicle, modification.pearlescentColor || pearlescentColor, modification.wheelColor);
        }

        if (modification.interiorColor) {
            SetVehicleInteriorColour(vehicle, modification.interiorColor);
        }

        if (modification.dashboardColor) {
            SetVehicleDashboardColour(vehicle, modification.dashboardColor);
        }

        if (modification.wheels) {
            SetVehicleWheelType(vehicle, modification.wheels);
        }

        if (modification.windowTint) {
            SetVehicleWindowTint(vehicle, modification.windowTint);
        }

        if (modification.neonColor) {
            SetVehicleNeonLightsColour(
                vehicle,
                modification.neonColor[0],
                modification.neonColor[1],
                modification.neonColor[2]
            );
        }

        if (modification.headlightColor) {
            SetVehicleHeadlightsColour(vehicle, modification.headlightColor);
        }

        if (modification.tyreSmokeColor) {
            SetVehicleTyreSmokeColor(
                vehicle,
                modification.tyreSmokeColor[0],
                modification.tyreSmokeColor[1],
                modification.tyreSmokeColor[2]
            );
        }

        if (modification.liveryRoof) {
            SetVehicleRoofLivery(vehicle, modification.liveryRoof);
        }

        for (const [neon, enabled] of Object.entries(modification.neonEnabled)) {
            SetVehicleNeonLightEnabled(vehicle, parseInt(neon, 10), enabled);
        }

        if (modification.xenonColor) {
            SetVehicleXenonLightsColour(vehicle, modification.xenonColor);
        }

        for (const [key, value] of Object.entries(SetVehicleModMap)) {
            if (typeof value === 'number') {
                if (modification[key]) {
                    SetVehicleMod(vehicle, value, modification[key], false);
                }
            } else {
                value.set(vehicle, modification[key], modification);
            }
        }
    }

    public getVehicleModification(vehicle: number): VehicleModification {
        let [colorPrimary, colorSecondary]: [number | RGBColor, number | RGBColor] = GetVehicleColours(vehicle);

        if (GetIsVehiclePrimaryColourCustom(vehicle)) {
            colorPrimary = GetVehicleCustomPrimaryColour(vehicle);
        }

        if (GetIsVehicleSecondaryColourCustom(vehicle)) {
            colorSecondary = GetVehicleCustomSecondaryColour(vehicle);
        }

        const extras: Record<number, boolean> = {};

        for (let i = 0; i < 13; i++) {
            if (DoesExtraExist(vehicle, i)) {
                extras[i] = IsVehicleExtraTurnedOn(vehicle, i);
            }
        }

        const [pearlescentColor, wheelColor] = GetVehicleExtraColours(vehicle);

        let modLivery = GetVehicleMod(vehicle, VehicleModType.Livery);

        if (modLivery === -1 && GetVehicleLivery(vehicle) !== 0) {
            modLivery = GetVehicleLivery(vehicle);
        }

        const neonEnabled = {};

        for (let i = 0; i < 4; i++) {
            neonEnabled[i] = IsVehicleNeonLightEnabled(vehicle, i);
        }

        const vehicleModification = {
            color1: colorPrimary,
            color2: colorSecondary,
            dashboardColor: GetVehicleDashboardColour(vehicle),
            extras,
            headlightColor: GetVehicleHeadlightsColour(vehicle),
            interiorColor: GetVehicleInteriorColour(vehicle),
            liveryRoof: GetVehicleRoofLivery(vehicle),
            neonColor: GetVehicleNeonLightsColour(vehicle),
            neonEnabled,
            pearlescentColor,
            plateIndex: GetVehicleNumberPlateTextIndex(vehicle),
            tyreSmokeColor: GetVehicleTyreSmokeColor(vehicle),
            wheelColor,
            wheels: GetVehicleWheelType(vehicle),
            windowTint: GetVehicleWindowTint(vehicle),
            xenonColor: GetVehicleXenonLightsColour(vehicle),
        };

        const vehicleModificationMod = {};

        for (const [key, value] of Object.entries(SetVehicleModMap)) {
            if (typeof value === 'number') {
                vehicleModificationMod[key] = GetVehicleMod(vehicle, value);
            } else {
                vehicleModificationMod[key] = value.get(vehicle);
            }
        }

        return {
            ...vehicleModification,
            ...(vehicleModificationMod as VehicleModificationMod),
        };
    }
}
