import { Once, OnceStep, OnNuiEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { emitRpc } from '../../../core/rpc';
import { NuiEvent, ServerEvent } from '../../../shared/event';
import { JobType } from '../../../shared/job';
import { BennysConfig } from '../../../shared/job/bennys';
import { MenuType } from '../../../shared/nui/menu';
import { BoxZone } from '../../../shared/polyzone/box.zone';
import { MultiZone } from '../../../shared/polyzone/multi.zone';
import { Vector3 } from '../../../shared/polyzone/vector';
import { RpcEvent } from '../../../shared/rpc';
import { VehicleConfiguration, VehicleCustomMenuData } from '../../../shared/vehicle/modification';
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
    ]);

    @Once(OnceStep.PlayerLoaded)
    public onStart() {
        this.targetFactory.createForModel(-1830645735, [
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
        ]);

        this.targetFactory.createForAllVehicle([
            {
                icon: 'c:mechanic/reparer.png',
                label: 'Réparer',
                color: 'bennys',
                action: this.repairVehicle.bind(this),
                blackoutGlobal: true,
                blackoutJob: 'bennys',
                canInteract: () => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
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
            {
                icon: 'c:mechanic/Modifier.png',
                label: 'Modifier',
                color: JobType.Bennys,
                blackoutGlobal: true,
                blackoutJob: JobType.Bennys,
                action: this.upgradeVehicle.bind(this),
                canInteract: () => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    const position = GetEntityCoords(PlayerPedId(), true) as Vector3;

                    return (
                        player.job.onduty &&
                        player.job.id === JobType.Bennys &&
                        this.upgradeZone.isPointInside(position)
                    );
                },
            },
        ]);
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

        this.nuiMenu.openMenu(MenuType.BennysUpgradeVehicle, {
            vehicle: vehicleEntityId,
            options,
            originalConfiguration: vehicleConfiguration,
            currentConfiguration: vehicleConfiguration,
        });
    }

    public async repairVehicle(vehicle: number) {
        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

        TriggerServerEvent(ServerEvent.BENNYS_REPAIR_VEHICLE, vehicleNetworkId);
    }

    public async washVehicle(vehicle: number) {
        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

        TriggerServerEvent(ServerEvent.BENNYS_WASH_VEHICLE, vehicleNetworkId);
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
Moteur : ${state.condition.engineHealth}<br />
Carrosserie : ${state.condition.bodyHealth}<br />
Réservoir : ${state.condition.tankHealth}<br />
Essence : ${state.condition.fuelLevel}%<br />
Huile : ${state.condition.oilLevel}%
`
        );
    }
}
