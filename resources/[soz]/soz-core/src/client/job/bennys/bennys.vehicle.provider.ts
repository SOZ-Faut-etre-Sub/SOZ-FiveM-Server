import { JobPermission, JobType } from '@public/shared/job';
import { isVehicleModelElectric, isVehicleModelTrailer } from '@public/shared/vehicle/vehicle';

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

    @Inject(JobService)
    private jobService: JobService;

    private upgradeZone: MultiZone<BoxZone> = new MultiZone([
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
        new BoxZone([1913.98, 3088.9, 46.92], 8.8, 6.2, {
            heading: 330.0,
            minZ: 45.92,
            maxZ: 48.922,
        }),
        new BoxZone([1900.02, 3081.82, 46.91], 6.2, 10.0, {
            heading: 330.0,
            minZ: 45.91,
            maxZ: 48.912,
        }),
        new BoxZone([1915.46, 3107.86, 46.81], 6.6, 16.4, {
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
        const dutyTargets = [
            {
                icon: 'fas fa-sign-in-alt',
                label: 'Prendre son service',
                action: () => {
                    TriggerServerEvent('QBCore:ToggleDuty');
                },
                canInteract: () => {
                    return !this.playerService.isOnDuty();
                },
                job: JobType.Bennys,
            },
            {
                icon: 'fas fa-sign-in-alt',
                label: 'Finir son service',
                action: () => {
                    TriggerServerEvent('QBCore:ToggleDuty');
                },
                canInteract: () => {
                    return this.playerService.isOnDuty();
                },
                job: JobType.Bennys,
            },
            {
                icon: 'fas fa-users',
                label: 'Employé(e)s en service',
                action: () => {
                    TriggerServerEvent('QBCore:GetEmployOnDuty');
                },
                canInteract: () => {
                    const player = this.playerService.getPlayer();
                    return (
                        this.playerService.isOnDuty() &&
                        this.jobService.hasPermission(player.job.id, JobPermission.OnDutyView)
                    );
                },
                job: JobType.Bennys,
            },
        ];

        this.targetFactory.createForModel(-1830645735, dutyTargets);

        this.targetFactory.createForBoxZone(
            'bennys_duty_north',
            new BoxZone([1908.09, 3090.02, 46.93], 2.8, 0.8, {
                heading: 330.0,
                minZ: 45.93,
                maxZ: 46.932,
            }),
            dutyTargets
        );

        this.targetFactory.createForAllVehicle([
            {
                icon: 'c:mechanic/repair_engine.png',
                label: 'Réparer moteur',
                color: 'bennys',
                action: this.repairVehicleEngine.bind(this),
                blackoutGlobal: true,
                blackoutJob: 'bennys',
                canInteract: entity => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    if (IsEntityDead(entity)) {
                        return false;
                    }

                    if (!this.isInsideUpgradeZoneOrNearRepairVehicle()) {
                        return false;
                    }

                    return player.job.onduty && player.job.id === JobType.Bennys;
                },
            },
            {
                icon: 'c:mechanic/reparer.png',
                label: 'Réparer carrosserie',
                color: 'bennys',
                action: this.repairVehicleBody.bind(this),
                blackoutGlobal: true,
                blackoutJob: 'bennys',
                canInteract: entity => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    if (IsEntityDead(entity)) {
                        return false;
                    }

                    if (!this.isInsideUpgradeZoneOrNearRepairVehicle()) {
                        return false;
                    }

                    return player.job.onduty && player.job.id === JobType.Bennys;
                },
            },
            {
                icon: 'c:mechanic/repair_tank.png',
                label: 'Réparer réservoir',
                color: 'bennys',
                action: this.repairVehicleTank.bind(this),
                blackoutGlobal: true,
                blackoutJob: 'bennys',
                canInteract: entity => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    if (IsEntityDead(entity)) {
                        return false;
                    }

                    if (!this.isInsideUpgradeZoneOrNearRepairVehicle()) {
                        return false;
                    }

                    if (isVehicleModelElectric(GetEntityModel(entity))) {
                        return false;
                    }

                    return player.job.onduty && player.job.id === JobType.Bennys;
                },
            },
            {
                icon: 'c:mechanic/repair_wheel.png',
                label: 'Changement des roues',
                color: 'bennys',
                action: this.repairVehicleWheel.bind(this),
                blackoutGlobal: true,
                blackoutJob: 'bennys',
                canInteract: entity => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    if (IsEntityDead(entity)) {
                        return false;
                    }

                    if (!this.isInsideUpgradeZoneOrNearRepairVehicle()) {
                        return false;
                    }

                    return player.job.onduty && player.job.id === JobType.Bennys;
                },
            },
            {
                icon: 'c:mechanic/nettoyer.png',
                label: 'Laver',
                color: 'bennys',
                blackoutGlobal: true,
                blackoutJob: 'bennys',
                action: this.washVehicle.bind(this),
                canInteract: () => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    if (!this.isInsideUpgradeZoneOrNearRepairVehicle()) {
                        return false;
                    }

                    return player.job.onduty && player.job.id === JobType.Bennys;
                },
            },
            {
                icon: 'c:mechanic/repair_diag.png',
                label: 'Faire un diagnostic',
                color: 'bennys',
                blackoutGlobal: true,
                blackoutJob: 'bennys',
                job: 'bennys',
                item: 'diagnostic_pad',
                action: this.analyzeVehicle.bind(this),
                canInteract: () => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    return player.job.onduty && player.job.id === JobType.Bennys;
                },
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

    public async upgradeVehicle(vehicleEntityId: number) {
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
    public async onUpgradeVehicle() {
        const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);

        if (vehicle) {
            await this.upgradeVehicle(vehicle);
        }

        return true;
    }

    @OnEvent(ClientEvent.JOB_OPEN_MENU)
    public async toggleJobMenu(job: JobType) {
        if (job !== JobType.Bennys) {
            return;
        }

        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);
        const isDriver = vehicle ? GetPedInVehicleSeat(vehicle, -1) === PlayerPedId() : false;

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
        const doorExist = [];

        let tabletType: 'car' | 'electric' | 'trailer' = 'car';

        if (isVehicleModelElectric(model)) {
            tabletType = 'electric';
        }
        if (isVehicleModelTrailer(model)) {
            tabletType = 'trailer';
        }

        const windowExist = [
            GetEntityBoneIndexByName(vehicle, 'window_lf') !== -1,
            GetEntityBoneIndexByName(vehicle, 'window_rf') !== -1,
            GetEntityBoneIndexByName(vehicle, 'window_lr') !== -1,
            GetEntityBoneIndexByName(vehicle, 'window_rr') !== -1,
            GetEntityBoneIndexByName(vehicle, 'window_lm') !== -1,
            GetEntityBoneIndexByName(vehicle, 'window_rm') !== -1,
            GetEntityBoneIndexByName(vehicle, 'windscreen') !== -1,
            GetEntityBoneIndexByName(vehicle, 'windscreen_r') !== -1,
        ];

        for (const index of Object.keys(condition.doorStatus)) {
            if (GetIsDoorValid(vehicle, parseInt(index))) {
                doorExist.push(index);
            }
        }

        this.nuiDispatch.dispatch('repair', 'open', {
            condition: condition,
            doors: doorExist,
            windows: windowExist,
            tabletType: tabletType,
        });
    }
}
