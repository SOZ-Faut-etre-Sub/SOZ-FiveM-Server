import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { emitRpc } from '../../core/rpc';
import { wait } from '../../core/utils';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { FuelStation, FuelStationType, FuelType } from '../../shared/fuel';
import { JobType } from '../../shared/job';
import { BoxZone } from '../../shared/polyzone/box.zone';
import { Vector3 } from '../../shared/polyzone/vector';
import { RpcEvent } from '../../shared/rpc';
import { AnimationService } from '../animation/animation.service';
import { BlipFactory } from '../blip';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../progress.service';
import { FuelStationRepository } from '../resources/fuel.station.repository';
import { SoundService } from '../sound.service';
import { TargetFactory } from '../target/target.factory';
import { ObjectFactory } from '../world/object.factory';
import { VehicleService } from './vehicle.service';

type StationZone = {
    station: FuelStation;
    zone: BoxZone;
};

type CurrentStationPistol = {
    object: number;
    rope: number;
    entity: number;
    station: string;
    filling: boolean;
};

@Provider()
export class VehicleFuelProvider {
    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(FuelStationRepository)
    private fuelStationRepository: FuelStationRepository;

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

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(SoundService)
    private soundService: SoundService;

    @Inject(ObjectFactory)
    private objectFFactory: ObjectFactory;

    private stationsByModel: Record<number, StationZone[]> = {};

    private currentStationPistol: CurrentStationPistol | null = null;

    @Once(OnceStep.RepositoriesLoaded)
    public async onRepositoryLoaded() {
        let stations = this.fuelStationRepository.get();

        while (!stations) {
            await wait(100);
            stations = this.fuelStationRepository.get();
        }

        const models: number[] = [];
        this.stationsByModel = {};

        for (const station of Object.values(stations)) {
            if (station.type === FuelStationType.Public) {
                this.blipFactory.create(`fuel_station_${station.name}`, {
                    coords: {
                        x: station.position[0],
                        y: station.position[1],
                        z: station.position[2],
                    },
                    name: 'Station essence',
                    sprite: 361,
                    color: 4,
                    alpha: 100,
                });
            }

            if (station.type === FuelStationType.Private || station.fuel === FuelType.Kerosene) {
                this.objectFFactory.create(station.model, station.position, true);
            }

            if (!this.stationsByModel[station.model]) {
                this.stationsByModel[station.model] = [];
                models.push(station.model);
            }

            const zone = new BoxZone(station.zone.center, station.zone.length, station.zone.width, {
                heading: station.zone.heading,
                minZ: station.zone.minZ - 2.0,
                maxZ: station.zone.maxZ + 2.0,
            });

            this.stationsByModel[station.model].push({
                station,
                zone,
            });
        }

        this.targetFactory.createForModel(models, [
            {
                label: "Remplir la station d'essence",
                color: JobType.Oil,
                icon: 'c:fuel/pistolet.png',
                action: entity => {
                    const station = this.getStationForEntity(entity);

                    if (!station) {
                        return false;
                    }

                    TriggerEvent(ClientEvent.OIL_REFILL_ESSENCE_STATION, entity, station.id);
                },
                canInteract: (entity: number) => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    if (!LocalPlayer.state.tankerEntity || !player.job.onduty) {
                        return false;
                    }

                    const station = this.getStationForEntity(entity);

                    if (!station) {
                        return false;
                    }

                    return station.fuel === FuelType.Essence;
                },
                job: JobType.Oil,
                blackoutGlobal: true,
                blackoutJob: JobType.Oil,
            },
            {
                label: 'Remplir la station de kérosène',
                color: JobType.Oil,
                icon: 'c:fuel/pistolet.png',
                action: entity => {
                    const station = this.getStationForEntity(entity);

                    if (!station) {
                        return false;
                    }

                    TriggerEvent(ClientEvent.OIL_REFILL_KEROSENE_STATION, entity, station.id);
                },
                canInteract: (entity: number) => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    if (!player.job.onduty) {
                        return false;
                    }

                    const station = this.getStationForEntity(entity);

                    if (!station) {
                        return false;
                    }

                    return station.fuel === FuelType.Kerosene;
                },
                item: 'kerosene',
                job: JobType.Oil,
                blackoutGlobal: true,
                blackoutJob: JobType.Oil,
            },
            {
                label: 'État de la station',
                icon: 'c:fuel/pistolet.png',
                event: 'fuel:client:GetFuelLevel',
                action: (entity: number) => {
                    this.getStationFuelLevel(entity);
                },
                canInteract: (entity: number) => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    if (!player.job.onduty) {
                        return false;
                    }

                    const station = this.getStationForEntity(entity);

                    if (!station) {
                        return false;
                    }

                    if (player.job.id === JobType.Oil) {
                        return true;
                    }

                    return station.type === FuelStationType.Private && station.job === player.job.id;
                },
                blackoutGlobal: true,
            },
            {
                icon: 'c:fuel/pistolet.png',
                label: 'Pistolet',
                action: (entity: number) => {
                    this.toggleStationPistol(entity);
                },
                canInteract: (entity: number) => {
                    if (GetEntityHealth(entity) <= 0) {
                        return false;
                    }

                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    const station = this.getStationForEntity(entity);

                    if (!station) {
                        return false;
                    }

                    if (station.type === FuelStationType.Public) {
                        return true;
                    }

                    return player.job.id === station.job && player.job.onduty;
                },
                blackoutGlobal: true,
            },
        ]);

        this.targetFactory.createForAllVehicle([
            {
                label: 'Remplir le véhicule',
                icon: 'c:fuel/remplir.png',
                blackoutGlobal: true,
                canInteract: (entity: number) => {
                    if (GetEntityHealth(entity) <= 0) {
                        return false;
                    }

                    return this.currentStationPistol !== null;
                },
                action: (entity: number) => {
                    this.fillVehicle(entity);
                },
            },
        ]);
    }

    private async fillVehicle(vehicle: number) {
        if (!this.currentStationPistol) {
            return;
        }

        const station = this.fuelStationRepository.find(this.currentStationPistol.station);

        if (!station) {
            return;
        }

        const model = GetEntityModel(vehicle);

        if ((IsThisModelAHeli(model) || IsThisModelAPlane(model)) && station.fuel === FuelType.Essence) {
            this.notifier.notify("~r~Vous ne pouvez pas remplir ce véhicule avec de l'essence.", 'error');

            return;
        }

        if (!IsThisModelAHeli(model) && !IsThisModelAPlane(model) && station.fuel === FuelType.Kerosene) {
            this.notifier.notify('~r~Vous ne pouvez pas remplir ce véhicule avec du kérosene.', 'error');

            return;
        }

        if (station.stock <= 0) {
            this.notifier.notify("La station ne contient pas assez d'essence.", 'error');

            return;
        }

        const vehicleState = this.vehicleService.getVehicleState(vehicle);

        if (vehicleState.condition.fuelLevel > 99.0) {
            this.notifier.notify('Le véhicule est déjà plein.', 'error');

            return;
        }

        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

        this.currentStationPistol.filling = true;
        TriggerServerEvent(ServerEvent.VEHICLE_FUEL_START, vehicleNetworkId, station.id);
    }

    @OnEvent(ClientEvent.VEHICLE_FUEL_STOP)
    private onVehicleFuelStop() {
        if (this.currentStationPistol) {
            this.currentStationPistol.filling = false;
        }
    }

    private async toggleStationPistol(entity: number) {
        const station = this.getStationForEntity(entity);

        if (!station) {
            return;
        }

        if (this.currentStationPistol !== null) {
            await this.disableStationPistol();
        } else {
            await this.activateStationPistol(entity, station);
        }
    }

    private async disableStationPistol() {
        if (!this.currentStationPistol) {
            return;
        }

        RopeUnloadTextures();
        DeleteRope(this.currentStationPistol.rope);
        SetEntityAsMissionEntity(this.currentStationPistol.object, true, true);
        DeleteEntity(this.currentStationPistol.object);

        this.currentStationPistol = null;

        this.soundService.playAround('fuel/end_fuel', 5, 0.3);
    }

    private async activateStationPistol(entity: number, station: FuelStation) {
        TaskTurnPedToFaceEntity(PlayerPedId(), entity, 500);
        await wait(500);

        await this.animationService.playAnimation({
            base: {
                dictionary: 'anim@mp_atm@enter',
                name: 'enter',
                blendInSpeed: 8.0,
                blendOutSpeed: -8.0,
                duration: 3000,
                lockX: true,
                lockY: true,
                lockZ: true,
            },
        });

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
        const ropePosition = GetOffsetFromEntityInWorldCoords(entity, 0.0, 0.0, 1.0) as Vector3;
        AttachRopeToEntity(rope, entity, ropePosition[0], ropePosition[1], ropePosition[2], true);
        ActivatePhysics(rope);

        this.currentStationPistol = {
            rope,
            object,
            entity,
            station: station.name,
            filling: false,
        };
    }

    @Tick(TickInterval.EVERY_SECOND)
    private async handleStationPistol() {
        if (!this.currentStationPistol) {
            return;
        }

        if (this.currentStationPistol.filling) {
            this.soundService.playAround('fuel/refueling', 5, 0.3);
        }

        const ropePosition = GetOffsetFromEntityInWorldCoords(
            this.currentStationPistol.entity,
            0.0,
            0.0,
            1.0
        ) as Vector3;
        const handPosition = GetWorldPositionOfEntityBone(
            PlayerPedId(),
            GetEntityBoneIndexByName(PlayerPedId(), 'BONETAG_L_FINGER2')
        ) as Vector3;

        AttachEntitiesToRope(
            this.currentStationPistol.rope,
            this.currentStationPistol.entity,
            PlayerPedId(),
            ropePosition[0],
            ropePosition[1],
            ropePosition[2],
            handPosition[0],
            handPosition[1],
            handPosition[2],
            5.0,
            true,
            true,
            null,
            'BONETAG_L_FINGER2'
        );
    }

    private async getStationFuelLevel(entity: number) {
        const station = this.getStationForEntity(entity);

        if (!station) {
            return;
        }

        const refreshStation = await emitRpc<FuelStation>(RpcEvent.OIL_GET_STATION, station.id);

        TaskTurnPedToFaceEntity(PlayerPedId(), entity, 500);
        await wait(500);

        const { completed } = await this.progressService.progress(
            'get_fuel_level',
            'Vous vérifiez le niveau...',
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
            this.notifier.notify(`Status de la cuve: ~b~${refreshStation.stock}L`, 'success');
        }
    }

    @Tick(TickInterval.EVERY_SECOND)
    private async onTick() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return;
        }

        if (!IsVehicleEngineOn(vehicle)) {
            return;
        }

        const owner = NetworkGetEntityOwner(vehicle);

        if (owner !== PlayerId()) {
            return;
        }

        const consumedFuel = GetVehicleCurrentRpm(vehicle) * 0.084;
        const consumedOil = consumedFuel / 280;

        const state = this.vehicleService.getVehicleState(vehicle);

        const newOil = Math.max(0, state.condition.oilLevel - consumedOil);
        const newFuel = Math.max(0, state.condition.fuelLevel - consumedFuel);

        this.vehicleService.updateVehicleState(vehicle, {
            condition: {
                ...state.condition,
                oilLevel: newOil,
                fuelLevel: newFuel,
            },
        });

        SetVehicleOilLevel(vehicle, newOil);
        SetVehicleFuelLevel(vehicle, newFuel);

        if (newOil <= 0.1) {
            const newEngineHealth = Math.max(0, GetVehicleEngineHealth(vehicle) - 50);
            SetVehicleEngineHealth(vehicle, newEngineHealth);
            SetVehicleEngineOn(vehicle, false, true, true);
        }
    }

    private getStationForEntity(entity: number): FuelStation | null {
        const model = GetEntityModel(entity);
        const stations = this.stationsByModel[model];

        if (!stations) {
            return null;
        }

        const position = GetEntityCoords(entity, false) as Vector3;

        for (const station of stations) {
            if (station.zone.isPointInside(position)) {
                const updateToDateStation = this.fuelStationRepository.find(station.station.name);

                if (!updateToDateStation) {
                    return;
                }

                return updateToDateStation;
            }
        }

        return null;
    }
}
