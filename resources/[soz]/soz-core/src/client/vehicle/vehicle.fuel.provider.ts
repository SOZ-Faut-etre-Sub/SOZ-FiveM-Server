import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { emitRpc } from '../../core/rpc';
import { wait } from '../../core/utils';
import { AnimationStopReason } from '../../shared/animation';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { FuelStation, FuelStationType, FuelType } from '../../shared/fuel';
import { JobType } from '../../shared/job';
import { Vector3 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { isVehicleModelElectric, VehicleClass, VehicleCondition, VehicleSeat } from '../../shared/vehicle/vehicle';
import { AnimationService } from '../animation/animation.service';
import { BlipFactory } from '../blip';
import { Notifier } from '../notifier';
import { NuiDispatch } from '../nui/nui.dispatch';
import { ObjectProvider } from '../object/object.provider';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../progress.service';
import { FuelStationRepository } from '../repository/fuel.station.repository';
import { RopeService } from '../rope.service';
import { SoundService } from '../sound.service';
import { TargetFactory } from '../target/target.factory';
import { VehicleService } from './vehicle.service';
import { VehicleStateService } from './vehicle.state.service';

type CurrentStationPistol = {
    entity: number;
    station: string;
    filling: boolean;
};

const MAX_LENGTH_ROPE = 15.0;

const VehicleClassFuelMultiplier: Partial<Record<VehicleClass, number>> = {
    [VehicleClass.Helicopters]: 6.33,
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

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(RopeService)
    private ropeService: RopeService;

    private currentStationPistol: CurrentStationPistol | null = null;

    private publicOilStationPrice = 0;
    private publicKeroseneStationPrice = 0;
    private ready = false;

    @Once(OnceStep.RepositoriesLoaded)
    public async onRepositoryLoaded() {
        let stations = this.fuelStationRepository.get();

        while (!stations) {
            await wait(100);
            stations = this.fuelStationRepository.get();
        }

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

            if (
                station.type === FuelStationType.Private ||
                station.fuel === FuelType.Kerosene ||
                station.name === 'Cayo'
            ) {
                station.objectId = await this.objectProvider.createObject({
                    model: station.model,
                    position: station.position,
                    id: 'fuel_station_' + station.id,
                });
            }
        }

        this.targetFactory.createForModel(this.fuelStationRepository.getModels(), [
            {
                label: "Remplir la station d'essence",
                color: JobType.Oil,
                icon: 'c:fuel/pistolet.png',
                action: entity => {
                    const station = this.fuelStationRepository.getStationForEntity(entity);

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

                    if (!this.playerService.getState().tankerEntity || !player.job.onduty) {
                        return false;
                    }

                    const station = this.fuelStationRepository.getStationForEntity(entity);

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
                    const station = this.fuelStationRepository.getStationForEntity(entity);

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

                    const station = this.fuelStationRepository.getStationForEntity(entity);

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

                    const station = this.fuelStationRepository.getStationForEntity(entity);

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
                label: 'Prendre le pistolet',
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

                    const station = this.fuelStationRepository.getStationForEntity(entity);

                    if (!station) {
                        return false;
                    }

                    if (this.currentStationPistol) {
                        return false;
                    }

                    return player.job.id === station.job && player.job.onduty;
                },
                blackoutGlobal: true,
            },
            {
                icon: 'c:fuel/pistolet.png',
                label: 'Prendre le pistolet ' + '($' + this.publicOilStationPrice.toFixed(2) + '/L)',
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

                    const station = this.fuelStationRepository.getStationForEntity(entity);

                    if (!station) {
                        return false;
                    }

                    if (this.currentStationPistol) {
                        return false;
                    }

                    return station.type === FuelStationType.Public && station.fuel === FuelType.Essence;
                },
                blackoutGlobal: true,
            },
            {
                icon: 'c:fuel/pistolet.png',
                label: 'Prendre le pistolet ' + '($' + this.publicKeroseneStationPrice.toFixed(2) + '/L)',
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

                    const station = this.fuelStationRepository.getStationForEntity(entity);

                    if (!station) {
                        return false;
                    }

                    if (this.currentStationPistol) {
                        return false;
                    }

                    return station.type === FuelStationType.Public && station.fuel === FuelType.Kerosene;
                },
                blackoutGlobal: true,
            },
            {
                icon: 'c:fuel/pistolet.png',
                label: 'Reposer le pistolet',
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

                    const station = this.fuelStationRepository.getStationForEntity(entity);

                    if (!station) {
                        return false;
                    }

                    if (!this.currentStationPistol) {
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
                    const model = GetEntityModel(entity);

                    if (
                        !IsThisModelAHeli(model) &&
                        !IsThisModelAPlane(model) &&
                        !this.vehicleService.checkBackOfVehicle(entity)
                    ) {
                        return false;
                    }

                    return this.currentStationPistol !== null;
                },
                action: (entity: number) => {
                    this.fillVehicle(entity);
                },
            },
        ]);

        this.ready = true;
    }

    public isReady() {
        return this.ready;
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

        if (IsThisModelABicycle(model)) {
            this.notifier.notify("~r~Ce véhicule fonctionne uniquement à l'huile de coude", 'error');
            await this.disableStationPistol();

            return;
        }

        if (
            (IsThisModelABoat(model) ||
                IsThisModelAHeli(model) ||
                IsThisModelAPlane(model) ||
                isVehicleModelElectric(model)) &&
            station.fuel === FuelType.Essence
        ) {
            this.notifier.notify("~r~Vous ne pouvez pas remplir ce véhicule avec de l'essence.", 'error');
            await this.disableStationPistol();

            return;
        }

        if (
            !IsThisModelABoat(model) &&
            !IsThisModelAHeli(model) &&
            !IsThisModelAPlane(model) &&
            station.fuel === FuelType.Kerosene
        ) {
            this.notifier.notify('~r~Vous ne pouvez pas remplir ce véhicule avec du kérosene.', 'error');
            await this.disableStationPistol();

            return;
        }

        const refreshStation = await emitRpc<FuelStation>(RpcServerEvent.OIL_GET_STATION, station.id);

        if (refreshStation.stock <= 0) {
            this.notifier.notify("La station ne contient pas assez d'essence.", 'error');
            await this.disableStationPistol();

            return;
        }

        const driver = GetPedInVehicleSeat(vehicle, VehicleSeat.Driver);

        if (driver) {
            this.notifier.notify('Vous ne pouvez pas remplir un véhicule avec un conducteur au volant.', 'error');
            await this.disableStationPistol();

            return;
        }

        if (GetIsVehicleEngineRunning(vehicle)) {
            this.notifier.notify('Vous ne pouvez pas remplir un véhicule avec le moteur allumé.', 'error');
            await this.disableStationPistol();

            return;
        }

        const condition = await this.vehicleStateService.getVehicleCondition(vehicle);

        if (condition.fuelLevel > 99.0) {
            this.notifier.notify('Le véhicule est déjà plein.', 'error');
            await this.disableStationPistol();

            return;
        }

        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

        this.currentStationPistol.filling = true;
        TriggerServerEvent(ServerEvent.VEHICLE_FUEL_START, vehicleNetworkId, station.id);
    }

    @OnEvent(ClientEvent.VEHICLE_FUEL_START)
    private async onVehicleFuelStart(duration: number, amount: number, price: number) {
        const maxPrice = amount * price;

        this.nuiDispatch.dispatch('progress', 'Start', {
            label: 'Remplissage du véhicule',
            duration,
            units: [
                {
                    unit: 'L',
                    start: 0,
                    end: amount,
                },
                {
                    unit: '$',
                    start: 0,
                    end: maxPrice,
                },
            ],
        });
    }

    @OnEvent(ClientEvent.VEHICLE_FUEL_STOP)
    private async onVehicleFuelStop() {
        this.nuiDispatch.dispatch('progress', 'Stop');

        if (this.currentStationPistol) {
            this.currentStationPistol.filling = false;

            await this.disableStationPistol();
        }
    }

    private async toggleStationPistol(entity: number) {
        const station = this.fuelStationRepository.getStationForEntity(entity);

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

        this.ropeService.deleteRope();

        this.currentStationPistol = null;

        this.soundService.playAround('fuel/end_fuel', 5, 0.3);
    }

    private async activateStationPistol(entity: number, station: FuelStation) {
        TaskTurnPedToFaceEntity(PlayerPedId(), entity, 500);
        await wait(500);

        const stopReason = await this.animationService.playAnimation({
            base: {
                dictionary: 'anim@mp_atm@enter',
                name: 'enter',
                blendInSpeed: 8.0,
                blendOutSpeed: -8.0,
                duration: 2500,
                lockX: true,
                lockY: true,
                lockZ: true,
                options: {
                    freezeLastFrame: true,
                },
            },
        });

        if (stopReason !== AnimationStopReason.Finished) {
            return;
        }

        this.soundService.playAround('fuel/start_fuel', 5, 0.3);

        const ropePosition = GetOffsetFromEntityInWorldCoords(entity, 0.0, 0.0, 1.0) as Vector3;
        if (!this.ropeService.createNewRope(ropePosition, entity, 1, MAX_LENGTH_ROPE, 'prop_cs_fuel_nozle')) {
            return;
        }

        this.currentStationPistol = {
            entity,
            station: station.name,
            filling: false,
        };
    }

    @Tick(TickInterval.EVERY_SECOND)
    private async soundRefuelingTick() {
        if (!this.currentStationPistol) {
            return;
        }

        if (!this.currentStationPistol.filling) {
            return;
        }

        if (this.ropeService.getRopeDistance() > MAX_LENGTH_ROPE) {
            await this.disableStationPistol();
            return;
        }

        this.soundService.playAround('fuel/refueling', 5, 0.3);
    }

    private async getStationFuelLevel(entity: number) {
        const station = this.fuelStationRepository.getStationForEntity(entity);

        if (!station) {
            return;
        }

        const refreshStation = await emitRpc<FuelStation>(RpcServerEvent.OIL_GET_STATION, station.id);

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
            this.notifier.notify(`Statut de la cuve: ~b~${refreshStation.stock}L`, 'success');
        }
    }

    public checkVehicleFuel(vehicleEntityId: number, vehicleCondition: VehicleCondition): Partial<VehicleCondition> {
        if (!IsVehicleEngineOn(vehicleEntityId)) {
            return {};
        }

        const model = GetEntityModel(vehicleEntityId);

        if (IsThisModelABicycle(model)) {
            return {};
        }

        const fuelLevel = vehicleCondition.fuelLevel;
        const oilLevel = vehicleCondition.oilLevel;

        let multiplier = VehicleClassFuelMultiplier[GetVehicleClass(vehicleEntityId)] || 1.0;
        let rpm = GetVehicleCurrentRpm(vehicleEntityId);

        if (isVehicleModelElectric(model)) {
            if (rpm < 0.25) {
                rpm = 0.08;
            } else if (rpm < 0.35) {
                rpm = rpm * 0.4;
            } else if (rpm < 0.55) {
                rpm = rpm * 0.45;
            } else if (rpm < 0.7) {
                rpm = rpm * 0.5;
            } else if (rpm < 0.8) {
                rpm = rpm * 0.75;
            }

            multiplier = 0.5;
        }

        const consumedFuel = rpm * 0.084 * multiplier;
        const consumedOil = consumedFuel / 12;

        const newOil = Math.max(0, oilLevel - consumedOil);
        const newFuel = Math.max(0, fuelLevel - consumedFuel);

        if (newFuel <= 0.1) {
            SetVehicleEngineOn(vehicleEntityId, false, true, true);
        }

        if (newOil <= 0.1) {
            const newEngineHealth = Math.max(0, GetVehicleEngineHealth(vehicleEntityId) - 50);
            SetVehicleEngineHealth(vehicleEntityId, newEngineHealth);
            SetVehicleEngineOn(vehicleEntityId, false, true, true);
        }

        return {
            fuelLevel: newFuel,
            oilLevel: newOil,
        };
    }

    @Tick(TickInterval.EVERY_5_MINUTE)
    private async refreshStationPrices() {
        const stationPrices = await emitRpc<Record<FuelType, number>>(RpcServerEvent.OIL_GET_STATION_PRICES);
        this.publicOilStationPrice = stationPrices[FuelType.Essence];
        this.publicKeroseneStationPrice = stationPrices[FuelType.Kerosene];
    }
}
