import { Inject, Injectable } from '../../core/decorators/injectable';
import {
    HornLabelList,
    VehicleConfiguration,
    VehicleModification,
    VehicleModType,
    VehicleNeonLight,
    VehicleUpgradeChoice,
    VehicleUpgradeOptions,
} from '../../shared/vehicle/modification';
import { ResourceLoader } from '../resources/resource.loader';

export const getModName = (vehicleEntityId: number, mod: VehicleModType, value: number, modCount: number): string => {
    const model = GetEntityModel(vehicleEntityId);

    if (modCount === 0 || value < -1 || value > modCount) {
        return '';
    }

    if (mod === VehicleModType.Horn) {
        if (HornLabelList[value]) {
            if (DoesTextLabelExist(HornLabelList[value].name)) {
                return GetLabelText(HornLabelList[value].name);
            }

            return HornLabelList[value].label;
        }

        return '';
    }

    if (mod === VehicleModType.WheelFront || mod === VehicleModType.WheelRear) {
        if (value === -1) {
            if (!IsThisModelABike(model) && IsThisModelABicycle(model)) {
                return GetLabelText('CMOD_WHE_0');
            }

            return GetLabelText('CMOD_WHE_B_0');
        }

        if (value >= modCount / 2) {
            return GetLabelText(`CHROME`) + ' ' + GetLabelText(GetModTextLabel(vehicleEntityId, mod, value));
        }

        return GetLabelText(GetModTextLabel(vehicleEntityId, mod, value));
    }

    switch (mod) {
        case VehicleModType.Armor:
            return GetLabelText('CMOD_ARM_' + value.toString());
        case VehicleModType.Brakes:
            return GetLabelText('CMOD_BRA_' + value.toString());
        case VehicleModType.Engine:
            if (value === -1) {
                return GetLabelText('CMOD_ENG_0');
            }

            return GetLabelText('CMOD_ENG_' + value.toString());
        case VehicleModType.Suspension:
            return GetLabelText('CMOD_SUS_' + value.toString());
        case VehicleModType.Transmission:
            return GetLabelText('CMOD_GBX_' + value.toString());
    }

    if (value > -1) {
        const modValueName = GetModTextLabel(vehicleEntityId, mod, value);

        if (!DoesTextLabelExist(modValueName)) {
            return value.toString();
        }

        const modValueNameString = GetLabelText(modValueName);

        if (modValueNameString === 'NULL' || modValueNameString === '') {
            return value.toString();
        }

        return modValueNameString;
    }

    return GetLabelText('CMOD_DEF_0');
};

type VehicleModificationHelper<T extends keyof VehicleModification, V extends VehicleModification[T]> = {
    apply: (vehicleEntityId: number, value: V) => void;
    getUpgradeChoice: (vehicleEntityId: number) => VehicleUpgradeChoice | null;
};

export const createModificationHelperList = (
    type: VehicleModType
): VehicleModificationHelper<Partial<keyof VehicleModification>, number> => {
    return {
        apply: (vehicleEntityId: number, value?: number): void => {
            if (value === null || value === undefined) {
                RemoveVehicleMod(vehicleEntityId, type);

                return;
            }

            console.log('apply', type, value);

            SetVehicleMod(vehicleEntityId, type, value as number, false);
        },
        getUpgradeChoice: (vehicleEntityId: number): VehicleUpgradeChoice | null => {
            const modCount = GetNumVehicleMods(vehicleEntityId, type);

            if (modCount === 0) {
                return null;
            }

            const choices = [
                {
                    label: GetLabelText('CMOD_DEF_0'),
                    value: null,
                },
            ]; //

            for (let i = 0; i < modCount; i++) {
                choices.push({
                    label: getModName(vehicleEntityId, type, i, modCount),
                    value: i,
                });
            }

            return {
                items: choices,
                type: 'list',
            };
        },
    };
};

export const createModificationHelperToggle = (
    type: VehicleModType
): VehicleModificationHelper<Partial<keyof VehicleModification>, boolean> => {
    return {
        apply: (vehicleEntityId: number, value?: boolean): void => {
            if (value === null || value === undefined) {
                RemoveVehicleMod(vehicleEntityId, type);

                return;
            }

            if (value) {
                ToggleVehicleMod(vehicleEntityId, type, true);
            } else {
                ToggleVehicleMod(vehicleEntityId, type, false);
            }
        },
        getUpgradeChoice: (): VehicleUpgradeChoice => {
            return {
                type: 'toggle',
            };
        },
    };
};

type VehicleModificationHelperType<T extends keyof VehicleModification> = Record<
    T,
    VehicleModificationHelper<T, VehicleModification[T]>
>;

const VehicleModificationHelpers: VehicleModificationHelperType<keyof VehicleModification> = {
    spoiler: createModificationHelperList(VehicleModType.Spoiler),
    bumperFront: createModificationHelperList(VehicleModType.BumperFront),
    bumperRear: createModificationHelperList(VehicleModType.BumperRear),
    sideSkirt: createModificationHelperList(VehicleModType.SideSkirt),
    exhaust: createModificationHelperList(VehicleModType.Exhaust),
    frame: createModificationHelperList(VehicleModType.Frame),
    grille: createModificationHelperList(VehicleModType.Grille),
    hood: createModificationHelperList(VehicleModType.Hood),
    fender: createModificationHelperList(VehicleModType.Fender),
    fenderRight: createModificationHelperList(VehicleModType.Fender),
    roof: createModificationHelperList(VehicleModType.Roof),
    engine: createModificationHelperList(VehicleModType.Engine),
    brakes: createModificationHelperList(VehicleModType.Brakes),
    transmission: createModificationHelperList(VehicleModType.Transmission),
    horn: createModificationHelperList(VehicleModType.Horn),
    suspension: createModificationHelperList(VehicleModType.Suspension),
    armor: createModificationHelperList(VehicleModType.Armor),
    turbo: createModificationHelperToggle(VehicleModType.Turbo),
    tyreSmoke: createModificationHelperToggle(VehicleModType.TyreSmoke),
    xenonHeadlights: createModificationHelperToggle(VehicleModType.XenonHeadlights),
    wheelFront: createModificationHelperList(VehicleModType.WheelFront),
    wheelRear: createModificationHelperList(VehicleModType.WheelRear),
    plateHolder: createModificationHelperList(VehicleModType.PlateHolder),
    vanityPlate: createModificationHelperList(VehicleModType.VanityPlate),
    trimDesign: createModificationHelperList(VehicleModType.TrimDesign),
    ornament: createModificationHelperList(VehicleModType.Ornament),
    dashboard: createModificationHelperList(VehicleModType.Dashboard),
    dialDesign: createModificationHelperList(VehicleModType.DialDesign),
    doorSpeaker: createModificationHelperList(VehicleModType.DoorSpeaker),
    seat: createModificationHelperList(VehicleModType.Seat),
    steeringWheel: createModificationHelperList(VehicleModType.SteeringWheel),
    columnShifterLevers: createModificationHelperList(VehicleModType.ColumnShifterLevers),
    plaques: createModificationHelperList(VehicleModType.Plaques),
    speakers: createModificationHelperList(VehicleModType.Speakers),
    trunk: createModificationHelperList(VehicleModType.Trunk),
    hydraulics: createModificationHelperList(VehicleModType.Hydraulics),
    engineBlock: createModificationHelperList(VehicleModType.EngineBlock),
    airFilter: createModificationHelperList(VehicleModType.AirFilter),
    struts: createModificationHelperList(VehicleModType.Struts),
    archCover: createModificationHelperList(VehicleModType.ArchCover),
    aerials: createModificationHelperList(VehicleModType.Aerials),
    trim: createModificationHelperList(VehicleModType.Trim),
    tank: createModificationHelperList(VehicleModType.Tank),
    windows: createModificationHelperList(VehicleModType.Windows),
};

@Injectable()
export class VehicleModificationService {
    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    public debug(vehicle: number) {
        console.log('debugVehicle', vehicle);
        const options = this.createOptions(vehicle);
        console.log('options', options);
    }

    public createOptions(vehicle: number): VehicleUpgradeOptions {
        if (!HasThisAdditionalTextLoaded('mod_mnu', 10)) {
            ClearAdditionalText(10, true);
            RequestAdditionalText('mod_mnu', 10);
        }

        const options: VehicleUpgradeOptions = {
            modification: {},
        };

        if (GetNumVehicleMods(vehicle, VehicleModType.Livery) > 0) {
            const choices = [];

            for (let i = 0; i < GetNumVehicleMods(vehicle, VehicleModType.Livery); i++) {
                const modValueName = GetModTextLabel(vehicle, VehicleModType.Livery, i);
                const modValueNameString = GetLabelText(modValueName);

                choices.push({
                    label: modValueNameString,
                    value: i,
                });
            }

            options.livery = {
                items: choices,
                type: 'list',
            };
        } else if (GetVehicleLiveryCount(vehicle) > 0) {
            const choices = [];

            for (let i = 0; i < GetVehicleLiveryCount(vehicle); i++) {
                const modValueName = GetLiveryName(vehicle, i);
                const modValueNameString = GetLabelText(modValueName);

                choices.push({
                    label: modValueNameString,
                    value: i,
                });
            }

            options.livery = {
                items: choices,
                type: 'list',
            };
        }

        for (const [key, helper] of Object.entries(VehicleModificationHelpers)) {
            const choice = helper.getUpgradeChoice(vehicle);

            if (choice) {
                options.modification[key] = {
                    label: key,
                    choice,
                };
            }
        }

        return options;
    }

    public applyVehicleModification(vehicle: number, configuration: VehicleConfiguration): void {
        SetVehicleModKit(vehicle, 0);

        if (configuration.color) {
            const isPrimaryColorRgb = typeof configuration.color.primary === 'object';
            const isSecondaryColorRgb = typeof configuration.color.primary === 'object';

            if (!isPrimaryColorRgb || !isSecondaryColorRgb) {
                SetVehicleColours(
                    vehicle,
                    isPrimaryColorRgb ? 0 : (configuration.color.primary as number),
                    isSecondaryColorRgb ? 0 : (configuration.color.secondary as number)
                );
            }

            if (isPrimaryColorRgb) {
                SetVehicleCustomPrimaryColour(
                    vehicle,
                    configuration.color.primary[0],
                    configuration.color.primary[1],
                    configuration.color.primary[2]
                );
            }

            if (isSecondaryColorRgb) {
                SetVehicleCustomSecondaryColour(
                    vehicle,
                    configuration.color.secondary[0],
                    configuration.color.secondary[1],
                    configuration.color.secondary[2]
                );
            }

            if (configuration.color.pearlescent || configuration.color.rim === 0) {
                SetVehicleExtraColours(vehicle, configuration.color.pearlescent || -1, configuration.color.rim || -1);
            }
        }

        if (configuration.dashboardColor) {
            SetVehicleDashboardColour(vehicle, configuration.dashboardColor);
        }

        if (configuration.headlightColor) {
            SetVehicleHeadlightsColour(vehicle, configuration.headlightColor);
        }

        if (configuration.interiorColor) {
            SetVehicleInteriorColour(vehicle, configuration.interiorColor);
        }

        if (configuration.liveryRoof) {
            SetVehicleRoofLivery(vehicle, configuration.liveryRoof);
        }

        if (configuration.neon) {
            DisableVehicleNeonLights(vehicle, false);
            SetVehicleNeonLightEnabled(vehicle, VehicleNeonLight.Back, configuration.neon.light[VehicleNeonLight.Back]);
            SetVehicleNeonLightEnabled(
                vehicle,
                VehicleNeonLight.Front,
                configuration.neon.light[VehicleNeonLight.Front]
            );
            SetVehicleNeonLightEnabled(vehicle, VehicleNeonLight.Left, configuration.neon.light[VehicleNeonLight.Left]);
            SetVehicleNeonLightEnabled(
                vehicle,
                VehicleNeonLight.Right,
                configuration.neon.light[VehicleNeonLight.Right]
            );
        } else {
            DisableVehicleNeonLights(vehicle, true);
        }

        if (configuration.plateType) {
            SetVehicleNumberPlateTextIndex(vehicle, configuration.plateType);
        }

        if (configuration.tyreSmokeColor) {
            SetVehicleTyreSmokeColor(
                vehicle,
                configuration.tyreSmokeColor[0],
                configuration.tyreSmokeColor[1],
                configuration.tyreSmokeColor[2]
            );
        }

        if (configuration.wheelType) {
            SetVehicleWheelType(vehicle, configuration.wheelType);
        }

        SetVehicleWindowTint(vehicle, configuration.windowTint || 0);

        if (configuration.xenonColor) {
            SetVehicleXenonLightsColour(vehicle, configuration.xenonColor);
        }

        if (configuration.livery) {
            if (GetNumVehicleMods(vehicle, VehicleModType.Livery) > 0) {
                SetVehicleMod(vehicle, VehicleModType.Livery, configuration.livery, false);
            } else {
                SetVehicleLivery(vehicle, configuration.livery);
            }
        }

        for (const [key, value] of Object.entries(VehicleModificationHelpers)) {
            value.apply(vehicle, configuration.modification[key]);
        }
    }
}
