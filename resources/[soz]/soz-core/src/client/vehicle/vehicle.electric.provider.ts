import { Tick, TickInterval } from '@public/core/decorators/tick';
import { emitRpc } from '@public/core/rpc';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { UpwStation } from '@public/shared/fuel';
import { JobType } from '@public/shared/job';
import { getDistance, Vector3 } from '@public/shared/polyzone/vector';
import { RpcEvent } from '@public/shared/rpc';
import { isVehicleModelElectric } from '@public/shared/vehicle/vehicle';

import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { wait } from '../../core/utils';
import { AnimationService } from '../animation/animation.service';
import { BlipFactory } from '../blip';
import { Notifier } from '../notifier';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../progress.service';
import { UpwChargerRepository } from '../resources/upw.station.repository';
import { SoundService } from '../sound.service';
import { TargetFactory } from '../target/target.factory';
import { VehicleService } from './vehicle.service';

type CurrentStationPlug = {
    object: number;
    rope: number;
    entity: number;
    station: string;
    filling: boolean;
};

@Provider()
export class VehicleElectricProvider {
    @Inject(UpwChargerRepository)
    private upwChargerRepository: UpwChargerRepository;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(SoundService)
    private soundService: SoundService;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    private currentStationPlug: CurrentStationPlug | null = null;

    @Once(OnceStep.RepositoriesLoaded)
    public async onRepositoryLoaded() {
        let upwCharger = this.upwChargerRepository.get();

        while (!upwCharger) {
            await wait(100);
            upwCharger = this.upwChargerRepository.get();
        }
    }

    public async getStationEnergyLevel(entity: number) {
        if (!entity) {
            return;
        }
        const position = GetEntityCoords(entity) as Vector3;
        const charger = this.upwChargerRepository.getClosestCharger(position);
        if (!charger) {
            return;
        }

        const refreshStation = await emitRpc<UpwStation>(RpcEvent.UPW_GET_STATION, charger.station);

        TaskTurnPedToFaceEntity(PlayerPedId(), entity, 500);
        await wait(500);

        const { completed } = await this.progressService.progress(
            'get_fuel_level',
            'Vous vérifiez la charge...',
            5000,
            {
                task: 'PROP_HUMAN_PARKING_METER',
            },
            {
                disableMovement: true,
                disableCombat: true,
            }
        );

        if (completed) {
            this.notifier.notify(
                `Charge de la station : ~b~${refreshStation.stock} / ${refreshStation.max_stock}kWh`,
                'success'
            );
        }
    }

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        this.targetFactory.createForModel(this.upwChargerRepository.getModel(), [
            {
                label: "Recharger à l'énergie fossile",
                color: JobType.Upw,
                icon: 'c:fuel/charger.png',
                blackoutGlobal: true,
                blackoutJob: JobType.Upw,
                job: JobType.Upw,
                canInteract: entity => {
                    const player = this.playerService.getPlayer();
                    return player && player.job.onduty;
                },
                action: entity => {
                    const position = GetEntityCoords(entity) as Vector3;
                    const charger = this.upwChargerRepository.getClosestCharger(position);

                    if (!charger) {
                        return false;
                    }

                    TriggerServerEvent(ServerEvent.UPW_REFILL_STATION, charger.station, 'energy_cell_fossil');
                },
                item: 'energy_cell_fossil',
            },
            {
                label: "Recharger à l'énergie hydraulique",
                color: JobType.Upw,
                icon: 'c:fuel/charger.png',
                blackoutGlobal: true,
                blackoutJob: JobType.Upw,
                job: JobType.Upw,
                canInteract: entity => {
                    const player = this.playerService.getPlayer();
                    return player && player.job.onduty;
                },
                action: entity => {
                    const position = GetEntityCoords(entity) as Vector3;
                    const charger = this.upwChargerRepository.getClosestCharger(position);

                    if (!charger) {
                        return false;
                    }

                    TriggerServerEvent(ServerEvent.UPW_REFILL_STATION, charger.station, 'energy_cell_hydro');
                },
                item: 'energy_cell_hydro',
            },
            {
                label: "Recharger à l'énergie éolienne",
                color: JobType.Upw,
                icon: 'c:fuel/charger.png',
                blackoutGlobal: true,
                blackoutJob: JobType.Upw,
                job: JobType.Upw,
                canInteract: entity => {
                    const player = this.playerService.getPlayer();
                    return player && player.job.onduty;
                },
                action: entity => {
                    const position = GetEntityCoords(entity) as Vector3;
                    const charger = this.upwChargerRepository.getClosestCharger(position);

                    if (!charger) {
                        return false;
                    }

                    TriggerServerEvent(ServerEvent.UPW_REFILL_STATION, charger.station, 'energy_cell_wind');
                },
                item: 'energy_cell_wind',
            },
            {
                label: 'État de la station',
                color: JobType.Upw,
                icon: 'c:fuel/battery.png',
                blackoutGlobal: true,
                blackoutJob: JobType.Upw,
                job: JobType.Upw,
                action: (entity: number) => {
                    this.getStationEnergyLevel(entity);
                },
                canInteract: (entity: number) => {
                    const player = this.playerService.getPlayer();
                    return player && player.job.onduty;
                },
            },
            {
                icon: 'c:fuel/plug.png',
                label: 'Prendre la prise',
                action: (entity: number) => {
                    this.toggleStationPlug(entity);
                },
                canInteract: (entity: number) => {
                    if (GetEntityHealth(entity) <= 0) {
                        return false;
                    }

                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    const station = this.upwChargerRepository.getStationForEntity(entity);

                    if (!station) {
                        return false;
                    }

                    if (this.currentStationPlug) {
                        return false;
                    }

                    return true;
                },
                blackoutGlobal: true,
            },
            {
                icon: 'c:fuel/plug.png',
                label: 'Déposer la prise',
                action: (entity: number) => {
                    this.toggleStationPlug(entity);
                },
                canInteract: (entity: number) => {
                    if (GetEntityHealth(entity) <= 0) {
                        return false;
                    }

                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    const station = this.upwChargerRepository.getStationForEntity(entity);

                    if (!station) {
                        return false;
                    }

                    if (!this.currentStationPlug) {
                        return false;
                    }

                    return true;
                },
                blackoutGlobal: true,
            },
        ]);
        this.targetFactory.createForAllVehicle([
            {
                label: 'Charger le véhicule',
                icon: 'c:fuel/recharge.png',
                blackoutGlobal: true,
                canInteract: (entity: number) => {
                    if (GetEntityHealth(entity) <= 0) {
                        return false;
                    }

                    return this.currentStationPlug !== null && this.checkBackOfVehicle(entity);
                },
                action: (entity: number) => {
                    this.chargeVehicle(entity);
                },
            },
        ]);
    }

    private async chargeVehicle(vehicle: number) {
        if (!this.currentStationPlug) {
            return;
        }

        const station = this.currentStationPlug.station; // name of the station as string

        if (!station) {
            return;
        }

        const model = GetEntityModel(vehicle);

        if (!this.checkBackOfVehicle(vehicle)) {
            this.notifier.notify('~r~Vous devez être derrière le véhicule pour le recharger.', 'error');

            return;
        }

        if (IsThisModelABicycle(model)) {
            this.notifier.notify("~r~Ce véhicule fonctionne uniquement à l'huile de coude", 'error');
            await this.disableStationPlug();

            return;
        }

        if (IsThisModelAHeli(model) || IsThisModelAPlane(model) || !isVehicleModelElectric(model)) {
            this.notifier.notify("~r~Ce véhicule n'est pas éléctrique.", 'error');
            await this.disableStationPlug();

            return;
        }

        const refreshStation = await emitRpc<UpwStation>(RpcEvent.UPW_GET_STATION, station);

        if (refreshStation.stock <= 0) {
            this.notifier.notify("La station n'a plus de courant.", 'error');
            await this.disableStationPlug();

            return;
        }

        const driver = GetPedInVehicleSeat(vehicle, -1);

        if (driver) {
            this.notifier.notify('Vous ne pouvez pas charger un véhicule avec un conducteur au volant.', 'error');
            await this.disableStationPlug();

            return;
        }

        if (GetIsVehicleEngineRunning(vehicle)) {
            this.notifier.notify('Vous ne pouvez pas charger un véhicule avec le moteur allumé.', 'error');
            await this.disableStationPlug();

            return;
        }

        const vehicleState = this.vehicleService.getVehicleState(vehicle);

        if (vehicleState.condition.fuelLevel > 97.0) {
            this.notifier.notify('Le véhicule est déjà plein.', 'error');
            await this.disableStationPlug();

            return;
        }

        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);
        this.currentStationPlug.filling = true;
        TaskTurnPedToFaceEntity(PlayerPedId(), vehicle, 500);
        await wait(500);
        this.soundService.playAround('fuel/blip_in', 5, 0.3);

        TriggerServerEvent(ServerEvent.VEHICLE_CHARGE_START, vehicleNetworkId, refreshStation.id);
    }

    private async toggleStationPlug(entity: number) {
        const station = this.upwChargerRepository.getStationForEntity(entity);

        if (!station) {
            console.log('No station found for entity', entity);
            return;
        }

        if (this.currentStationPlug !== null) {
            await this.disableStationPlug();
        } else {
            await this.activateStationPlug(entity, station);
        }
    }

    private async disableStationPlug() {
        if (!this.currentStationPlug) {
            return;
        }

        RopeUnloadTextures();
        DeleteRope(this.currentStationPlug.rope);
        SetEntityAsMissionEntity(this.currentStationPlug.object, true, true);
        DeleteEntity(this.currentStationPlug.object);

        this.currentStationPlug = null;

        this.soundService.playAround('fuel/end_fuel', 5, 0.3);
    }

    private checkBackOfVehicle(vehicle: number): boolean {
        const playerPosition = GetEntityCoords(PlayerPedId(), true) as Vector3;
        const model = GetEntityModel(vehicle);
        const [min, max] = GetModelDimensions(model) as [Vector3, Vector3];
        const vehicleLength = max[1] - min[1];
        const backPosition = GetOffsetFromEntityInWorldCoords(vehicle, 0.0, -vehicleLength / 2, 0.0) as Vector3;
        const distance = getDistance(backPosition, playerPosition);
        return distance < 2.0;
    }

    private async activateStationPlug(entity: number, station: string) {
        TaskTurnPedToFaceEntity(PlayerPedId(), entity, 500);
        await wait(500);

        await this.animationService.playAnimation({
            base: {
                dictionary: 'anim@move_m@trash',
                name: 'pickup',
                blendInSpeed: 8.0,
                blendOutSpeed: -8.0,
                duration: 3000,
                lockX: true,
                lockY: true,
                lockZ: true,
            },
        });

        if (this.currentStationPlug !== null) {
            return;
        }

        this.soundService.playAround('fuel/start_fuel', 5, 0.3);

        const position = GetEntityCoords(PlayerPedId(), true) as Vector3;
        const object = CreateObject(
            GetHashKey('prop_cs_fuel_nozle'),
            position[0],
            position[1],
            position[2] - 1.0,
            true,
            true,
            true
        );

        SetNetworkIdCanMigrate(ObjToNet(object), false);
        AttachEntityToEntity(
            object,
            PlayerPedId(),
            GetPedBoneIndex(PlayerPedId(), 26610),
            0.04,
            -0.04,
            0.02,
            305.0,
            270.0,
            -40.0,
            true,
            true,
            false,
            true,
            0,
            true
        );
        RopeLoadTextures();

        const [rope] = AddRope(
            position[0],
            position[1],
            position[2],
            0.0,
            0.0,
            0.0,
            15.0,
            1,
            10.0,
            1.0,
            0,
            false,
            true,
            true,
            1.0,
            false,
            0
        );

        this.currentStationPlug = {
            rope,
            object,
            entity,
            station: station,
            filling: false,
        };

        const ropePosition = GetOffsetFromEntityInWorldCoords(entity, 0.0, 0.0, 1.0) as Vector3;
        AttachRopeToEntity(rope, entity, ropePosition[0], ropePosition[1], ropePosition[2], true);
        ActivatePhysics(rope);
    }

    @Tick(TickInterval.EVERY_SECOND)
    private async handleStationPlug() {
        if (!this.currentStationPlug) {
            return;
        }

        const ropePosition = GetOffsetFromEntityInWorldCoords(this.currentStationPlug.entity, 0.0, 0.0, 1.0) as Vector3;
        const handPosition = GetWorldPositionOfEntityBone(
            PlayerPedId(),
            GetEntityBoneIndexByName(PlayerPedId(), 'BONETAG_L_FINGER2')
        ) as Vector3;

        AttachEntitiesToRope(
            this.currentStationPlug.rope,
            this.currentStationPlug.entity,
            PlayerPedId(),
            ropePosition[0],
            ropePosition[1],
            ropePosition[2],
            handPosition[0],
            handPosition[1],
            handPosition[2],
            10.0,
            true,
            true,
            null,
            'BONETAG_L_FINGER2'
        );
    }

    @OnEvent(ClientEvent.VEHICLE_CHARGE_START)
    private async onVehicleChargeStart(duration: number, amount: number, price: number) {
        const maxPrice = amount * price;

        this.nuiDispatch.dispatch('progress', 'Start', {
            label: 'Chargement du véhicule...',
            duration,
            color: 'text-yellow-400',
            units: [
                {
                    unit: 'kWh',
                    start: 60 - amount,
                    end: 60,
                },
                {
                    unit: '$',
                    start: 0,
                    end: maxPrice,
                },
            ],
        });
    }

    @OnEvent(ClientEvent.VEHICLE_CHARGE_STOP)
    private async onVehicleChargeStop() {
        this.nuiDispatch.dispatch('progress', 'Stop');
        this.soundService.playAround('fuel/blip_in', 5, 0.3);
        await wait(500);

        if (this.currentStationPlug) {
            this.currentStationPlug.filling = false;

            await this.disableStationPlug();
        }
    }
}
