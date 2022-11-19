import { Inject, Injectable } from '../../core/decorators/injectable';
import {
    HornLabelList,
    VehicleConfiguration,
    VehicleModification,
    VehicleModType,
    VehicleNeonLight,
    VehicleUpgradeChoice,
    VehicleUpgradeOptions,
    VehicleWheelType,
} from '../../shared/vehicle/modification';
import { VehicleClass } from '../../shared/vehicle/vehicle';
import { ResourceLoader } from '../resources/resource.loader';

const ModTypeLabels: Partial<Record<VehicleModType, string>> = {
    [VehicleModType.Spoiler]: 'Aileron',
    [VehicleModType.BumperFront]: 'Pare-chocs avant',
    [VehicleModType.BumperRear]: 'Pare-chocs arrière',
    [VehicleModType.Exhaust]: "Pot d'échappement",
    [VehicleModType.SideSkirt]: 'Bas de caisse',
    [VehicleModType.Hood]: 'Capot',
    [VehicleModType.Roof]: 'Toit',
    [VehicleModType.TyreSmoke]: 'Fumée de pneu',
    [VehicleModType.XenonHeadlights]: 'Phares au xénon',
    [VehicleModType.AirFilter]: 'Filtre à air',
    [VehicleModType.DoorSpeaker]: 'Enceintes de porte',
    [VehicleModType.TrimDesign]: 'Finition A',
    [VehicleModType.PlateHolder]: 'Contour de plaque',
    [VehicleModType.Fender]: 'Aile',
};

const ModExclusion: Record<number, VehicleModType[]> = {
    [GetHashKey('sentinel')]: [VehicleModType.ColumnShifterLevers, VehicleModType.Speakers],
};

export const getModTypeName = (vehicleEntityId: number, mod: VehicleModType): string => {
    const model = GetEntityModel(vehicleEntityId);

    switch (mod) {
        case VehicleModType.Armor:
            return GetLabelText('CMOD_MOD_ARM');
        case VehicleModType.Brakes:
            return GetLabelText('CMOD_MOD_BRA');
        case VehicleModType.Engine:
            return GetLabelText('CMOD_MOD_ENG');
        case VehicleModType.Suspension:
            return GetLabelText('CMOD_MOD_SUS');
        case VehicleModType.Transmission:
            return GetLabelText('CMOD_MOD_TRN');
        case VehicleModType.Horn:
            return GetLabelText('CMOD_MOD_HRN');
        case VehicleModType.WheelFront:
            if (!IsThisModelABike(model) && IsThisModelABicycle(model)) {
                const label = GetLabelText('CMOD_MOD_WHEM');

                if (label === '') {
                    return 'Roues';
                }

                return label;
            }

            return GetLabelText('CMOD_WHE0_0');
        case VehicleModType.WheelRear:
            return GetLabelText('CMM_MOD_S0');
        case VehicleModType.VanityPlate:
            return GetLabelText('CMM_MOD_S1');
        case VehicleModType.TrimDesign:
            if (model === GetHashKey('SultanRS')) {
                return GetLabelText('CMOD_MOD_S2b');
            }
            return GetLabelText('CMOD_MOD_S2');
        case VehicleModType.Ornament:
            return GetLabelText('CMM_MOD_S3');
        case VehicleModType.Dashboard:
            return GetLabelText('CMM_MOD_S4');
        case VehicleModType.DialDesign:
            return GetLabelText('CMM_MOD_S5');
        case VehicleModType.DoorSpeaker:
            return GetLabelText('CMM_MOD_S6');
        case VehicleModType.Seat:
            return GetLabelText('CMM_MOD_S7');
        case VehicleModType.SteeringWheel:
            return GetLabelText('CMM_MOD_S8');
        case VehicleModType.ColumnShifterLevers:
            return GetLabelText('CMM_MOD_S9');
        case VehicleModType.Plaques:
            return GetLabelText('CMM_MOD_S10');
        case VehicleModType.Speakers:
            return GetLabelText('CMM_MOD_S11');
        case VehicleModType.Trunk:
            return GetLabelText('CMM_MOD_S12');
        case VehicleModType.Hydraulics:
            return GetLabelText('CMM_MOD_S13');
        case VehicleModType.EngineBlock:
            return GetLabelText('CMM_MOD_S14');
        case VehicleModType.AirFilter:
            if (model === GetHashKey('SultanRS')) {
                return GetLabelText('CMOD_MOD_S15b');
            }
            return GetLabelText('CMOD_MOD_S15');
        case VehicleModType.Struts:
            if (model === GetHashKey('SultanRS') || model === GetHashKey('Banshee2')) {
                return GetLabelText('CMOD_MOD_S16b');
            }
            return GetLabelText('CMOD_MOD_S16');
        case VehicleModType.ArchCover:
            if (model === GetHashKey('SultanRS')) {
                return GetLabelText('CMOD_MOD_S17b');
            }
            return GetLabelText('CMOD_MOD_S17');
        case VehicleModType.Aerials:
            if (model === GetHashKey('SultanRS')) {
                return GetLabelText('CMOD_MOD_S18b');
            }

            if (model === GetHashKey('BType3')) {
                return GetLabelText('CMOD_MOD_S18c');
            }

            return GetLabelText('CMOD_MOD_S18');
        case VehicleModType.Trim:
            if (model === GetHashKey('SultanRS')) {
                return GetLabelText('CMOD_MOD_S19b');
            }

            if (model === GetHashKey('BType3')) {
                return GetLabelText('CMOD_MOD_S19c');
            }

            if (model === GetHashKey('Virgo2')) {
                return GetLabelText('CMOD_MOD_S19d');
            }

            return GetLabelText('CMOD_MOD_S19');
        case VehicleModType.Tank:
            if (model === GetHashKey('SlamVan3')) {
                return GetLabelText('CMOD_MOD_S27');
            }
            return GetLabelText('CMOD_MOD_S20');
        case VehicleModType.Windows:
            if (model === GetHashKey('BType3')) {
                return GetLabelText('CMM_MOD_S21b');
            }
            return GetLabelText('CMM_MOD_S21');
        case VehicleModType.Livery:
            return GetLabelText('CMM_MOD_S23');

        case VehicleModType.BumperFront:
            if (model === GetHashKey('toros')) {
                return ModTypeLabels[VehicleModType.Spoiler];
            }
            break;

        case VehicleModType.Spoiler:
            if (model === GetHashKey('toros')) {
                return ModTypeLabels[VehicleModType.BumperFront];
            }
            break;
    }

    const name = GetModSlotName(vehicleEntityId, mod);

    if (DoesTextLabelExist(name)) {
        return GetLabelText(name);
    }

    if (ModTypeLabels[mod]) {
        return ModTypeLabels[mod];
    }

    return VehicleModType[mod];
};

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

        return `Klaxon ${value}`;
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
            return GetLabelText('CMOD_ARM_' + (value + 1).toString());
        case VehicleModType.Brakes:
            return GetLabelText('CMOD_BRA_' + (value + 1).toString());
        case VehicleModType.Engine:
            if (value === -1) {
                return GetLabelText('CMOD_ENG_0');
            }

            return GetLabelText('CMOD_ENG_' + (value + 1).toString());
        case VehicleModType.Suspension:
            return GetLabelText('CMOD_SUS_' + (value + 1).toString());
        case VehicleModType.Transmission:
            return GetLabelText('CMOD_GBX_' + (value + 1).toString());
    }

    if (value > -1) {
        const modValueName = GetModTextLabel(vehicleEntityId, mod, value);

        if (!DoesTextLabelExist(modValueName)) {
            return value.toString();
        }

        const modValueNameString = GetLabelText(modValueName);

        if (modValueNameString === 'NULL' || modValueNameString === '') {
            return getModTypeName(vehicleEntityId, mod) + ' ' + value.toString();
        }

        return modValueNameString;
    }

    return GetLabelText('CMOD_DEF_0');
};

type VehicleModificationHelper<T extends keyof VehicleModification, V extends VehicleModification[T]> = {
    apply: (vehicleEntityId: number, value: V, configuration: VehicleConfiguration) => void;
    getUpgradeChoice: (vehicleEntityId: number) => VehicleUpgradeChoice | null;
    getModTypeName: (vehicleEntityId: number) => string;
    get: (vehicleEntityId: number) => V;
};

export const createModificationHelperList = (
    type: VehicleModType
): VehicleModificationHelper<Partial<keyof VehicleModification>, number> => {
    return {
        apply: (vehicleEntityId: number, value: number, configuration: VehicleConfiguration): void => {
            if (type === VehicleModType.WheelRear) {
                return;
            }

            if (value === null || value === undefined) {
                RemoveVehicleMod(vehicleEntityId, type);

                if (
                    type === VehicleModType.WheelFront &&
                    GetVehicleClass(vehicleEntityId) === VehicleClass.Motorcycles
                ) {
                    RemoveVehicleMod(vehicleEntityId, VehicleModType.WheelRear);
                }

                return;
            }

            let custom = false;

            if (type === VehicleModType.WheelFront && configuration.customWheelFront) {
                custom = true;
            }

            SetVehicleMod(vehicleEntityId, type, value as number, custom);

            if (type === VehicleModType.WheelFront && GetVehicleClass(vehicleEntityId) === VehicleClass.Motorcycles) {
                SetVehicleMod(vehicleEntityId, VehicleModType.WheelRear, value as number, custom);
            }
        },
        getModTypeName: (vehicleEntityId: number): string => {
            const name = getModTypeName(vehicleEntityId, type);

            if (name !== 'NULL' && name !== '') {
                return name;
            }

            if (ModTypeLabels[type]) {
                return ModTypeLabels[type];
            }

            return VehicleModType[type];
        },
        getUpgradeChoice: (vehicleEntityId: number): VehicleUpgradeChoice | null => {
            const model = GetEntityModel(vehicleEntityId);

            if (ModExclusion[model] && ModExclusion[model].includes(type)) {
                return null;
            }

            const modCount = GetNumVehicleMods(vehicleEntityId, type);

            if (modCount === 0) {
                return null;
            }

            const choices = [
                {
                    label: GetLabelText('CMOD_DEF_0'),
                    value: null,
                },
            ];

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
        get: (vehicleEntityId: number): number => {
            return GetVehicleMod(vehicleEntityId, type);
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
        getModTypeName: (vehicleEntityId: number): string => {
            const name = getModTypeName(vehicleEntityId, type);

            if (name !== 'NULL' && name !== '') {
                return name;
            }

            if (ModTypeLabels[type]) {
                return ModTypeLabels[type];
            }

            return VehicleModType[type];
        },
        getUpgradeChoice: (): VehicleUpgradeChoice => {
            return {
                type: 'toggle',
            };
        },
        get: (vehicleEntityId: number): boolean => {
            return IsToggleModOn(vehicleEntityId, type);
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

    public createOptions(vehicle: number): VehicleUpgradeOptions {
        if (!HasThisAdditionalTextLoaded('mod_mnu', 10)) {
            ClearAdditionalText(10, true);
            RequestAdditionalText('mod_mnu', 10);
        }

        const options: VehicleUpgradeOptions = {
            modification: {},
            wheelType: {},
            extra: [],
        };

        if (GetNumVehicleMods(vehicle, VehicleModType.Livery) > 0) {
            const choices = [
                {
                    label: GetLabelText('CMOD_DEF_0'),
                    value: null,
                },
            ];

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
            const choices = [
                {
                    label: GetLabelText('CMOD_DEF_0'),
                    value: null,
                },
            ];

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

        if (GetVehicleRoofLiveryCount(vehicle) > 0) {
            const choices = [];

            for (let i = 0; i < GetVehicleRoofLiveryCount(vehicle); i++) {
                const modValueName = GetLiveryName(vehicle, i);
                const modValueNameString = GetLabelText(modValueName);

                choices.push({
                    label: modValueNameString,
                    value: i,
                });
            }

            options.liveryRoof = {
                items: choices,
                type: 'list',
            };
        }

        for (const [key, helper] of Object.entries(VehicleModificationHelpers)) {
            const choice = helper.getUpgradeChoice(vehicle);

            if (choice) {
                options.modification[key] = {
                    label: helper.getModTypeName(vehicle),
                    choice,
                };
            }
        }

        if (GetVehicleClass(vehicle) === VehicleClass.Motorcycles) {
            options.wheelType[VehicleWheelType.BikeWheels] = 'Motorcycles';
        } else {
            options.wheelType[VehicleWheelType.Sport] = 'Sport';
            options.wheelType[VehicleWheelType.Muscle] = 'Muscle';
            options.wheelType[VehicleWheelType.Lowrider] = 'Lowrider';
            options.wheelType[VehicleWheelType.SUV] = 'SUV';
            options.wheelType[VehicleWheelType.Offroad] = 'Offroad';
            options.wheelType[VehicleWheelType.Tuner] = 'Tuner';
            options.wheelType[VehicleWheelType.HighEnd] = 'HighEnd';
        }

        for (let i = 1; i < 15; i++) {
            if (DoesExtraExist(vehicle, i)) {
                options.extra.push(i);
            }
        }

        return options;
    }

    public applyVehicleConfiguration(vehicle: number, configuration: VehicleConfiguration): void {
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

            if (configuration.color.pearlescent !== null || configuration.color.rim !== null) {
                SetVehicleExtraColours(vehicle, configuration.color.pearlescent ?? 0, configuration.color.rim ?? 0);
            }
        }

        if (configuration.dashboardColor !== null) {
            SetVehicleDashboardColour(vehicle, configuration.dashboardColor);
        }

        if (configuration.interiorColor !== null) {
            SetVehicleInteriorColour(vehicle, configuration.interiorColor);
        }

        if (configuration.liveryRoof !== null) {
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

            if (configuration.neon.color) {
                SetVehicleNeonLightsColour(
                    vehicle,
                    configuration.neon.color[0],
                    configuration.neon.color[1],
                    configuration.neon.color[2]
                );
            }
        } else {
            DisableVehicleNeonLights(vehicle, true);
        }

        if (configuration.plateStyle !== null) {
            SetVehicleNumberPlateTextIndex(vehicle, configuration.plateStyle);
        }

        if (configuration.tyreSmokeColor) {
            SetVehicleTyreSmokeColor(
                vehicle,
                configuration.tyreSmokeColor[0],
                configuration.tyreSmokeColor[1],
                configuration.tyreSmokeColor[2]
            );
        }

        if (configuration.wheelType !== null) {
            SetVehicleWheelType(vehicle, configuration.wheelType);
        }

        if (GetVehicleClass(vehicle) === VehicleClass.Motorcycles) {
            SetVehicleWheelType(vehicle, VehicleWheelType.BikeWheels);
        }

        SetVehicleWindowTint(vehicle, configuration.windowTint || 0);

        if (configuration.xenonColor !== null) {
            SetVehicleXenonLightsColour(vehicle, configuration.xenonColor);
        }

        if (configuration.livery !== null && configuration.livery !== undefined) {
            if (GetNumVehicleMods(vehicle, VehicleModType.Livery) > 0) {
                SetVehicleMod(vehicle, VehicleModType.Livery, configuration.livery, false);
            } else {
                SetVehicleLivery(vehicle, configuration.livery);
            }
        } else {
            RemoveVehicleMod(vehicle, VehicleModType.Livery);
            SetVehicleLivery(vehicle, -1);
        }

        for (const [key, value] of Object.entries(VehicleModificationHelpers)) {
            value.apply(vehicle, configuration.modification[key], configuration);
        }

        for (const extraStr of Object.keys(configuration.extra)) {
            const extra = parseInt(extraStr, 10);

            SetVehicleExtra(vehicle, extra, !configuration.extra[extra]);
        }
    }

    public getVehicleConfiguration(vehicle: number): VehicleConfiguration {
        const [primaryColor, secondaryColor] = GetVehicleColours(vehicle);
        const [pearlescentColor, wheelColor] = GetVehicleExtraColours(vehicle);

        let livery = null;

        if (GetNumVehicleMods(vehicle, VehicleModType.Livery) > 0) {
            livery = GetVehicleMod(vehicle, VehicleModType.Livery);
        } else if (GetVehicleLiveryCount(vehicle) > 0) {
            livery = GetVehicleLivery(vehicle);
        }

        const modification = {};

        for (const [key, value] of Object.entries(VehicleModificationHelpers)) {
            modification[key] = value.get(vehicle);
        }

        const extra = {};

        for (let i = 1; i < 14; i++) {
            if (DoesExtraExist(vehicle, i)) {
                extra[i] = IsVehicleExtraTurnedOn(vehicle, i);
            }
        }

        return {
            color: {
                primary: primaryColor,
                secondary: secondaryColor,
                pearlescent: pearlescentColor,
                rim: wheelColor,
            },
            dashboardColor: GetVehicleDashboardColour(vehicle),
            interiorColor: GetVehicleInteriorColour(vehicle),
            livery,
            wheelType: GetVehicleWheelType(vehicle),
            windowTint: GetVehicleWindowTint(vehicle),
            xenonColor: GetVehicleXenonLightsColour(vehicle),
            liveryRoof: GetVehicleRoofLivery(vehicle),
            plateStyle: GetVehicleNumberPlateTextIndex(vehicle),
            neon: {
                light: {
                    [VehicleNeonLight.Back]: IsVehicleNeonLightEnabled(vehicle, VehicleNeonLight.Back),
                    [VehicleNeonLight.Front]: IsVehicleNeonLightEnabled(vehicle, VehicleNeonLight.Front),
                    [VehicleNeonLight.Left]: IsVehicleNeonLightEnabled(vehicle, VehicleNeonLight.Left),
                    [VehicleNeonLight.Right]: IsVehicleNeonLightEnabled(vehicle, VehicleNeonLight.Right),
                },
                color: GetVehicleNeonLightsColour(vehicle),
            },
            tyreSmokeColor: GetVehicleTyreSmokeColor(vehicle),
            customWheelFront: GetVehicleModVariation(vehicle, VehicleModType.WheelFront),
            customWheelRear: GetVehicleModVariation(vehicle, VehicleModType.WheelRear),
            modification,
            extra,
        };
    }
}
