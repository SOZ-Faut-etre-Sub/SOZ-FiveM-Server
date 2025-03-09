import { VehicleBusinessProvider } from '@private/client/gang/business.vehicle.provider';
import { DealershipType } from '@public/config/dealership';
import { JobPermission, JobType } from '@public/shared/job';
import {
    isVehicleModelElectric,
    isVehicleModelTrailer,
    LSCustomMode,
    VehicleCategoryMap,
    VehicleClass,
    VehicleOrderMode,
    VehicleSeat,
    VehiculeInformation,
} from '@public/shared/vehicle/vehicle';

import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Tick, TickInterval } from '../../../core/decorators/tick';
import { ClientEvent, NuiEvent, ServerEvent } from '../../../shared/event';
import { BennysConfig } from '../../../shared/job/bennys';
import { MenuType } from '../../../shared/nui/menu';
import { BoxZone } from '../../../shared/polyzone/box.zone';
import { MultiZone } from '../../../shared/polyzone/multi.zone';
import { Vector3 } from '../../../shared/polyzone/vector';
import { Notifier } from '../../notifier';
import { NuiDispatch } from '../../nui/nui.dispatch';
import { NuiMenu } from '../../nui/nui.menu';
import { PhoneService } from '../../phone/phone.service';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../progress.service';
import { TargetFactory } from '../../target/target.factory';
import { VehicleModificationService } from '../../vehicle/vehicle.modification.service';
import { VehicleService } from '../../vehicle/vehicle.service';
import { VehicleStateService } from '../../vehicle/vehicle.state.service';
import { JobService } from '../job.service';

@Provider()
export class BennysVehicleProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(VehicleModificationService)
    private vehicleModificationService: VehicleModificationService;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(PhoneService)
    private phoneService: PhoneService;

    @Inject(VehicleBusinessProvider)
    private vehicleBusinessProvider: VehicleBusinessProvider;

    @Inject(JobService)
    private jobService: JobService;

    private upgradeZone: MultiZone<BoxZone> = new MultiZone([
        new BoxZone([-199.1, -1324.23, 31.11], 6.4, 5.2, {
            heading: 269.06,
            minZ: 30.11,
            maxZ: 32.11,
        }),
        new BoxZone([-222.49, -1323.6, 30.89], 9, 6, {
            heading: 90,
            minZ: 29.89,
            maxZ: 33.89,
        }),
        new BoxZone([-222.62, -1330.24, 30.89], 9, 6, {
            heading: 90,
            minZ: 29.89,
            maxZ: 33.89,
        }),
        new BoxZone([-168.78, -1252.58, 31.3], 6.2, 13.6, {
            heading: 0,
            minZ: 30.3,
            maxZ: 35.3,
        }),
        new BoxZone([-145.98, -1272.34, 49.57], 15, 15.6, {
            heading: 0,
            minZ: 48.57,
            maxZ: 51.57,
        }),
        new BoxZone([1913.98, 3088.9, 46.92], 10.8, 9.1, {
            heading: 330.0,
            minZ: 45.92,
            maxZ: 48.922,
        }),
        new BoxZone([1900.02, 3081.82, 46.91], 8.2, 10.0, {
            heading: 330.0,
            minZ: 45.91,
            maxZ: 48.912,
        }),
        new BoxZone([1915.46, 3107.86, 46.81], 8.6, 16.4, {
            heading: 330.0,
            minZ: 43.81,
            maxZ: 50.812,
        }),
        new BoxZone([5126.11, -4649.94, 0.62], 71.0, 29.2, {
            heading: 255.65,
            minZ: -0.38,
            maxZ: 1.62,
        }),
    ]);

    @Once(OnceStep.PlayerLoaded)
    public setupBennysJob() {
        this.targetFactory.createForAllVehicle([
            {
                icon: 'mechanic/repair_engine',
                label: 'Réparer moteur',
                action: this.repairVehicleEngine.bind(this),
                blackoutGlobal: true,
                blackoutJob: JobType.Bennys,
                job: JobType.Bennys,
                category: 'society',
                canInteract: entity => !IsEntityDead(entity) && this.isInsideUpgradeZoneOrNearRepairVehicle(),
            },
            {
                icon: 'mechanic/reparer',
                label: 'Réparer carrosserie',
                action: this.repairVehicleBody.bind(this),
                blackoutGlobal: true,
                blackoutJob: JobType.Bennys,
                job: JobType.Bennys,
                category: 'society',
                canInteract: entity => !IsEntityDead(entity) && this.isInsideUpgradeZoneOrNearRepairVehicle(),
            },
            {
                icon: 'mechanic/repair_tank',
                label: 'Réparer réservoir',
                action: this.repairVehicleTank.bind(this),
                blackoutGlobal: true,
                blackoutJob: JobType.Bennys,
                job: JobType.Bennys,
                category: 'society',
                canInteract: entity =>
                    !IsEntityDead(entity) &&
                    this.isInsideUpgradeZoneOrNearRepairVehicle() &&
                    !isVehicleModelElectric(GetEntityModel(entity)),
            },
            {
                icon: 'mechanic/repair_wheel',
                label: 'Changement des roues',
                action: this.repairVehicleWheel.bind(this),
                blackoutGlobal: true,
                blackoutJob: JobType.Bennys,
                job: JobType.Bennys,
                category: 'society',
                canInteract: entity => !IsEntityDead(entity) && this.isInsideUpgradeZoneOrNearRepairVehicle(),
            },
            {
                icon: 'mechanic/nettoyer',
                label: 'Laver',
                blackoutGlobal: true,
                blackoutJob: JobType.Bennys,
                category: 'society',
                action: this.washVehicle.bind(this),
                job: JobType.Bennys,
                canInteract: entity => !IsEntityDead(entity) && this.isInsideUpgradeZoneOrNearRepairVehicle(),
            },
            {
                icon: 'mechanic/repair_diag',
                label: 'Faire un diagnostic',
                blackoutGlobal: true,
                blackoutJob: JobType.Bennys,
                job: JobType.Bennys,
                item: 'diagnostic_pad',
                category: 'society',
                action: this.analyzeVehicle.bind(this),
            },
        ]);
    }

    public isInsideUpgradeZoneOrNearRepairVehicle(allowRemoteVehicle = true): boolean {
        const position = GetEntityCoords(PlayerPedId(), true) as Vector3;

        if (this.upgradeZone.isPointInside(position)) {
            return true;
        }

        if (!allowRemoteVehicle) {
            return false;
        }

        const allowedModel = GetHashKey('burrito6');

        const closestVehicle = this.vehicleService.getClosestVehicle({}, vehicle => {
            const model = GetEntityModel(vehicle);

            if (model !== allowedModel) {
                return false;
            }

            const plate = GetVehicleNumberPlateText(vehicle);

            return plate.startsWith('NEWG');
        });

        return closestVehicle !== null;
    }

    public async upgradeVehicle(vehicleEntityId: number, mode: LSCustomMode) {
        const vehicleCondition = await this.vehicleStateService.getVehicleCondition(vehicleEntityId);

        if (
            [LSCustomMode.LsCustom, LSCustomMode.NewGahray].includes(mode) &&
            this.vehicleService.isInBadCondition(vehicleEntityId, vehicleCondition)
        ) {
            this.notifier.notify(
                'Ce véhicule est trop endommagé pour être modifié, veuillez le réparer avant de le modifier.',
                'error'
            );

            return;
        }

        if ([LSCustomMode.LsCustom, LSCustomMode.NewGahray].includes(mode) && vehicleCondition.dirtLevel > 5.0) {
            this.notifier.notify(
                'Ce véhicule est trop sale pour être modifié, veuillez le laver avant de le modifier.',
                'error'
            );

            return;
        }

        const options = this.vehicleModificationService.createOptions(vehicleEntityId);
        const vehicleConfiguration = await this.vehicleService.getVehicleConfiguration(vehicleEntityId);

        SetVehicleUndriveable(vehicleEntityId, true);
        SetVehicleLights(vehicleEntityId, 2);

        this.nuiMenu.openMenu(
            MenuType.BennysUpgradeVehicle,
            {
                vehicle: vehicleEntityId,
                options,
                originalConfiguration: vehicleConfiguration,
                currentConfiguration: vehicleConfiguration,
                mode: mode,
                advenced: false,
            },
            {
                useMouse: true,
            }
        );
    }

    public async repairVehicleEngine(vehicle: number) {
        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

        TriggerServerEvent(ServerEvent.BENNYS_REPAIR_VEHICLE_ENGINE, vehicleNetworkId);
    }

    public async repairVehicleBody(vehicle: number) {
        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

        TriggerServerEvent(ServerEvent.BENNYS_REPAIR_VEHICLE_BODY, vehicleNetworkId);
    }

    public async repairVehicleTank(vehicle: number) {
        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

        TriggerServerEvent(ServerEvent.BENNYS_REPAIR_VEHICLE_TANK, vehicleNetworkId);
    }

    public async repairVehicleWheel(vehicle: number) {
        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

        TriggerServerEvent(ServerEvent.BENNYS_REPAIR_VEHICLE_WHEEL, vehicleNetworkId);
    }

    public async washVehicle(vehicle: number) {
        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

        TriggerServerEvent(ServerEvent.BENNYS_WASH_VEHICLE, vehicleNetworkId);
    }

    @Tick(TickInterval.EVERY_SECOND)
    public checkCloseMenu(): void {
        if (this.nuiMenu.getOpened() !== MenuType.BennysUpgradeVehicle) {
            return;
        }

        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (vehicle) {
            return;
        }

        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.BennysUpgradeVehicle)
    public async onUpgradeVehicle(mode: LSCustomMode) {
        const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);

        if (!vehicle) {
            return;
        }

        if (mode == LSCustomMode.CrimiCusto && !this.vehicleBusinessProvider.testCrimiGarage(vehicle, true)) {
            return;
        }

        await this.upgradeVehicle(vehicle, mode);

        return true;
    }

    @OnEvent(ClientEvent.JOB_OPEN_MENU)
    public async toggleJobMenu(job: JobType) {
        if (job !== JobType.Bennys) {
            return;
        }

        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);
        const isDriver = vehicle ? GetPedInVehicleSeat(vehicle, VehicleSeat.Driver) === PlayerPedId() : false;

        if (this.nuiMenu.getOpened() === MenuType.JobBennys) {
            this.nuiMenu.closeMenu();
        } else {
            this.nuiMenu.openMenu(MenuType.JobBennys, {
                insideUpgradeZone: isDriver && this.isInsideUpgradeZoneOrNearRepairVehicle(false),
            });
        }
    }

    public async analyzeVehicle(vehicle: number) {
        if (this.phoneService.isPhoneVisible()) {
            this.notifier.notify(
                'Vous ne pouvez pas faire un diagnostic lorsque vous utilisez votre téléphone',
                'error'
            );

            return;
        }

        const { completed } = await this.progressService.progress(
            'vehicle_analyze',
            'Vous analysez le véhicule.',
            BennysConfig.Estimate.duration,
            {
                name: 'base',
                dictionary: 'missheistdockssetup1clipboard@base',
                flags: 1,
            },
            {
                disableMovement: true,
                disableCarMovement: true,
                disableMouse: false,
                disableCombat: true,
                firstProp: {
                    model: 'prop_notepad_01',
                    bone: 18905,
                    coords: { x: 0.1, y: 0.02, z: 0.08 },
                    rotation: { x: -80.0, y: 0.0, z: 0.0 },
                },
                secondProp: {
                    model: 'prop_pencil_01',
                    bone: 58866,
                    coords: { x: 0.12, y: -0.02, z: 0.001 },
                    rotation: { x: -150.0, y: 0.0, z: 0.0 },
                },
            }
        );

        if (!completed) {
            return;
        }

        const condition = await this.vehicleStateService.getVehicleCondition(vehicle);
        const model = GetEntityModel(vehicle);
        const doorExist = this.vehicleService.getDoorExists(vehicle, condition);
        const windowExist = this.vehicleService.getWindowExists(vehicle);
        const vehicleClass = GetVehicleClassFromName(model) as VehicleClass;
        const vehicleCategory = VehicleCategoryMap[vehicleClass] ?? '';
        const vehicleBrandName = GetMakeNameFromVehicleModel(model)
            ? GetLabelText(GetMakeNameFromVehicleModel(model))
            : null;
        const vehicleName = GetDisplayNameFromVehicleModel(model)
            ? GetLabelText(GetDisplayNameFromVehicleModel(model))
            : null;

        const vehiculeInformations: VehiculeInformation = {
            plate: GetVehicleNumberPlateText(vehicle) ?? '',
            brand: vehicleBrandName,
            model: vehicleName,
            category: vehicleCategory,
        };

        console.log(vehiculeInformations);

        let tabletType: 'car' | 'electric' | 'trailer' = 'car';

        if (isVehicleModelElectric(model)) {
            tabletType = 'electric';
        }
        if (isVehicleModelTrailer(model)) {
            tabletType = 'trailer';
        }

        this.nuiDispatch.dispatch('repair', 'open', {
            vehiculeInformations: vehiculeInformations,
            condition: condition,
            doors: doorExist,
            windows: windowExist,
            tabletType: tabletType,
        });
    }

    @Once(OnceStep.Start)
    public async onStart() {
        const orderZone = BennysConfig.Order.zone;
        this.targetFactory.createForBoxZone(orderZone.name, orderZone, [
            {
                label: 'Commander une voiture',
                icon: 'mechanic/order',
                job: JobType.Bennys,
                blackoutJob: JobType.Bennys,
                blackoutGlobal: true,
                category: 'society',
                canInteract: () => {
                    return this.jobService.hasPermission(JobType.Bennys, JobPermission.Order);
                },
                action: async () => {
                    this.nuiMenu.openMenu(
                        MenuType.VehicleOrderMenu,
                        {
                            dealerships: [
                                DealershipType.Cycle,
                                DealershipType.Luxury,
                                DealershipType.Moto,
                                DealershipType.Pdm,
                            ],
                            mode: VehicleOrderMode.Job,
                        },
                        {
                            position: {
                                position: orderZone.center,
                                distance: 5.0,
                            },
                        }
                    );
                },
            },
        ]);
    }
}
