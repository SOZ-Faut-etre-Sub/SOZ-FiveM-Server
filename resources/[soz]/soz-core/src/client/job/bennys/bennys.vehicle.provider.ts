import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Tick, TickInterval } from '../../../core/decorators/tick';
import { emitRpc } from '../../../core/rpc';
import { ClientEvent, NuiEvent, ServerEvent } from '../../../shared/event';
import { JobType } from '../../../shared/job';
import { BennysConfig } from '../../../shared/job/bennys';
import { MenuType } from '../../../shared/nui/menu';
import { BoxZone } from '../../../shared/polyzone/box.zone';
import { MultiZone } from '../../../shared/polyzone/multi.zone';
import { Vector3 } from '../../../shared/polyzone/vector';
import { RpcEvent } from '../../../shared/rpc';
import { VehicleConfiguration } from '../../../shared/vehicle/modification';
import { Notifier } from '../../notifier';
import { NuiMenu } from '../../nui/nui.menu';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../progress.service';
import { TargetFactory } from '../../target/target.factory';
import { VehicleModificationService } from '../../vehicle/vehicle.modification.service';
import { VehicleService } from '../../vehicle/vehicle.service';

@Provider()
export class BennysVehicleProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

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
            maxZ: 46.922,
        }),
        new BoxZone([1905.86, 3081.09, 46.92], 6.0, 8.0, {
            heading: 330.0,
            minZ: 45.92,
            maxZ: 46.922,
        }),
        new BoxZone([1915.46, 3107.86, 46.81], 6.6, 16.4, {
            heading: 330.0,
            minZ: 43.81,
            maxZ: 50.812,
        }),
    ]);

    @Once(OnceStep.PlayerLoaded)
    public onStart() {
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

                    if (!this.isInsideUpgradeZone()) {
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

                    if (!this.isInsideUpgradeZone()) {
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

                    if (!this.isInsideUpgradeZone()) {
                        return false;
                    }

                    return player.job.onduty && player.job.id === JobType.Bennys;
                },
            },
            {
                icon: 'c:mechanic/repair_wheel.png',
                label: 'Changements de roues',
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

                    if (!this.isInsideUpgradeZone()) {
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

                    if (!this.isInsideUpgradeZone()) {
                        return false;
                    }

                    return player.job.onduty && player.job.id === JobType.Bennys;
                },
            },
            {
                icon: 'c:mechanic/reparer.png',
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

    public isInsideUpgradeZone(): boolean {
        const position = GetEntityCoords(PlayerPedId(), true) as Vector3;

        return this.upgradeZone.isPointInside(position);
    }

    public async upgradeVehicle(vehicleEntityId: number) {
        const options = this.vehicleModificationService.createOptions(vehicleEntityId);
        const state = this.vehicleService.getVehicleState(vehicleEntityId);
        let vehicleConfiguration = this.vehicleModificationService.getVehicleConfiguration(vehicleEntityId);

        if (state.id) {
            const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicleEntityId);
            vehicleConfiguration = await emitRpc<VehicleConfiguration>(
                RpcEvent.VEHICLE_CUSTOM_GET_MODS,
                vehicleNetworkId
            );
        }

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

        this.nuiMenu.closeMenu();

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

        const inVehicle = IsPedInAnyVehicle(PlayerPedId(), false);

        if (this.nuiMenu.getOpened() === MenuType.JobBennys) {
            this.nuiMenu.closeMenu();
        } else {
            this.nuiMenu.openMenu(MenuType.JobBennys, {
                insideUpgradeZone: inVehicle && this.isInsideUpgradeZone(),
            });
        }
    }

    public async analyzeVehicle(vehicle: number) {
        const state = this.vehicleService.getVehicleState(vehicle);

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

        const plate = state.plate || GetVehicleNumberPlateText(vehicle);

        this.notifier.notify(
            `
Diagnostic du véhicule ${plate} :<br /><br />
Moteur : ${state.condition.engineHealth.toFixed(0)}<br />
Carrosserie : ${state.condition.bodyHealth.toFixed(0)}<br />
Réservoir : ${state.condition.tankHealth.toFixed(0)}<br />
Essence : ${state.condition.fuelLevel.toFixed(2)}%<br />
Huile : ${state.condition.oilLevel.toFixed(2)}%<br />
Kilométrage : ${((state.condition.mileage || 0) / 1000).toFixed(2)}km
`
        );
    }
}
