import { Once, OnceStep, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { JobType } from '../../shared/job';
import { MenuType } from '../../shared/nui/menu';
import { getDistance, Vector3 } from '../../shared/polyzone/vector';
import { RpcEvent } from '../../shared/rpc';
import { Garage, GarageCategory, GarageType, GarageVehicle } from '../../shared/vehicle/garage';
import { BlipFactory } from '../blip';
import { Notifier } from '../notifier';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { GarageRepository } from '../resources/garage.repository';
import { TargetFactory } from '../target/target.factory';
import { ObjectFactory } from '../world/object.factory';
import { VehicleService } from './vehicle.service';

type BlipConfig = {
    name: string;
    sprite: number;
    color: number;
};

const BlipConfigMap: Partial<Record<GarageType, Partial<Record<GarageCategory, BlipConfig | null>>>> = {
    [GarageType.Private]: {
        [GarageCategory.Car]: { name: 'Parking Privé', sprite: 357, color: 5 },
    },
    [GarageType.Public]: {
        [GarageCategory.Car]: { name: 'Parking public', sprite: 357, color: 3 },
        [GarageCategory.Air]: { name: 'Héliport Public', sprite: 360, color: 3 },
    },
    [GarageType.Depot]: {
        [GarageCategory.Car]: { name: 'Fourrière', sprite: 68, color: 3 },
    },
};

@Provider()
export class VehicleGarageProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(GarageRepository)
    private garageRepository: GarageRepository;

    @Inject(ObjectFactory)
    private objectFactory: ObjectFactory;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerService)
    private playerService: PlayerService;

    private pounds: Record<string, Garage> = {};

    @Once(OnceStep.RepositoriesLoaded)
    public init() {
        const garageList = this.garageRepository.get();
        const jobGaragePayStation = GetHashKey('soz_prop_paystation');
        this.pounds = {};

        for (const garageIdentifier of Object.keys(garageList)) {
            const garage = garageList[garageIdentifier];
            const blipConfig = BlipConfigMap[garage.type]?.[garage.category] ?? null;

            if (blipConfig) {
                this.blipFactory.remove(`garage_${garageIdentifier}`);
                this.blipFactory.create(`garage_${garageIdentifier}`, {
                    name: blipConfig.name,
                    coords: { x: garage.zone.center[0], y: garage.zone.center[1], z: garage.zone.center[2] },
                    sprite: blipConfig.sprite,
                    color: blipConfig.color,
                });
            }

            const targets = [];

            if (garage.type === GarageType.Public) {
                targets.push({
                    label: 'Accéder au parking public',
                    icon: 'c:garage/ParkingPublic.png',
                    action: () => {
                        this.enterGarage(garageIdentifier, garage);
                    },
                });
            }

            if (garage.type === GarageType.Private) {
                targets.push({
                    label: 'Accéder au parking privé',
                    icon: 'c:garage/ParkingPrive.png',
                    action: () => {
                        this.enterGarage(garageIdentifier, garage);
                    },
                });
            }

            if (garage.type === GarageType.Depot) {
                targets.push({
                    label: 'Accéder à la fourrière',
                    icon: 'c:garage/Fourriere.png',
                    action: () => {
                        this.enterGarage(garageIdentifier, garage);
                    },
                });

                this.pounds[garageIdentifier] = garage;
            }

            if (garage.type === GarageType.Job) {
                this.objectFactory.create(jobGaragePayStation, [...garage.zone.center, garage.zone.heading], true);
                targets.push({
                    label: 'Accéder au parking entreprise',
                    icon: 'c:garage/GarageEntreprise.png',
                    action: () => {
                        this.enterGarage(garageIdentifier, garage);
                    },
                });
            }

            if (targets.length > 0) {
                this.targetFactory.createForBoxZone(
                    `garage_enter_${garageIdentifier}`,
                    { ...garage.zone, debugPoly: true },
                    targets,
                    2.5
                );
            }
        }

        this.targetFactory.createForAllVehicle([
            {
                label: 'Fourriérer',
                icon: 'c:mechanic/CarFourriere.png',
                action: entity => {
                    const closestPound = this.getClosestPound();
                    const networkId = NetworkGetNetworkIdFromEntity(entity);

                    if (!closestPound) {
                        return false;
                    }

                    TriggerServerEvent(ServerEvent.VEHICLE_GARAGE_STORE, closestPound[0], closestPound[1], networkId);
                },
                blackoutGlobal: true,
                blackoutJob: JobType.Bennys,
                job: JobType.Bennys,
                canInteract: (): boolean => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    if (player.job.id !== JobType.Bennys || !player.job.onduty) {
                        return false;
                    }

                    const closestPound = this.getClosestPound();

                    if (!closestPound) {
                        return false;
                    }

                    return true;
                },
            },
        ]);
    }

    private getClosestPound(): [string, Garage] | null {
        const playerPosition = GetEntityCoords(PlayerPedId(), false) as Vector3;

        for (const garageIdentifier of Object.keys(this.pounds)) {
            const garage = this.pounds[garageIdentifier];
            const distance = getDistance(playerPosition, garage.zone.center);

            if (distance < 10) {
                return [garageIdentifier, garage];
            }
        }

        return null;
    }

    @OnNuiEvent(NuiEvent.VehicleGarageStore)
    public async storeVehicle({ id, garage }) {
        const vehicle = GetPlayersLastVehicle();

        if (!vehicle) {
            this.notifier.notify('Vous devez monter dans un véhicule avant de pouvoir le ranger.', 'error');

            return;
        }

        const position = GetEntityCoords(vehicle, true) as Vector3;
        const playerPosition = GetEntityCoords(PlayerPedId(), true) as Vector3;

        if (getDistance(position, playerPosition) > 10) {
            this.notifier.notify('Vous devez vous rapprocher du parking pour ranger votre véhicule.', 'error');

            return;
        }

        const networkId = NetworkGetNetworkIdFromEntity(vehicle);

        TriggerServerEvent(ServerEvent.VEHICLE_GARAGE_STORE, id, garage, networkId);

        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.VehicleGarageStoreTrailer)
    public async storeVehicleTrailer({ id, garage }) {
        const vehicle = this.vehicleService.getClosestVehicle(10, vehicle => {
            const vehicleState = this.vehicleService.getVehicleState(vehicle);

            if (!vehicleState.id) {
                return false;
            }

            if (GetVehicleType(vehicle) !== 'trailer') {
                return false;
            }

            return true;
        });

        if (!vehicle) {
            this.notifier.notify('Aucune remorque à proximité.', 'error');

            return;
        }

        const networkId = NetworkGetNetworkIdFromEntity(vehicle);
        TriggerServerEvent(ServerEvent.VEHICLE_GARAGE_STORE, id, garage, networkId);
        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.VehicleGarageShowPlaces)
    public async showPlacesGarages({ id, garage }) {
        // @TODO
    }
    @OnNuiEvent(NuiEvent.VehicleGarageTakeOut)
    public async takeOutVehicle({ id, garage, vehicle }: { id: number; garage: Garage; vehicle: number }) {
        const garageWithFreePlaces: Garage = { ...garage, parkingPlaces: [] };

        for (const parkingPlace of garage.parkingPlaces) {
            if (
                !IsPositionOccupied(
                    parkingPlace.center[0],
                    parkingPlace.center[1],
                    parkingPlace.center[2],
                    0.5,
                    false,
                    true,
                    true,
                    false,
                    false,
                    0,
                    false
                )
            ) {
                garageWithFreePlaces.parkingPlaces.push(parkingPlace);
            }
        }

        if (garageWithFreePlaces.parkingPlaces.length === 0) {
            this.notifier.notify("Il n'y a plus de place disponible dans ce parking.", 'error');

            return;
        }

        TriggerServerEvent(ServerEvent.VEHICLE_GARAGE_RETRIEVE, id, garageWithFreePlaces, vehicle);

        this.nuiMenu.closeMenu();
    }

    private async enterGarage(id: string, garage: Garage) {
        const vehicles = await emitRpc<GarageVehicle[]>(RpcEvent.VEHICLE_GARAGE_GET_VEHICLES, id, garage);
        let free_places = null;

        if (garage.type === GarageType.Private) {
            free_places = await emitRpc<number>(RpcEvent.VEHICLE_GARAGE_GET_FREE_PLACES, id, garage);
        }

        const vehicleRenamed = vehicles.map(garageVehicle => {
            if (garageVehicle.name === null) {
                const name = GetLabelText(GetDisplayNameFromVehicleModel(garageVehicle.vehicle.modelName));

                return { ...garageVehicle, name };
            }
        });

        this.nuiMenu.openMenu(
            MenuType.Garage,
            {
                vehicles: vehicleRenamed,
                id,
                garage,
                free_places,
            },
            {
                position: {
                    position: garage.zone.center,
                    distance: 5.0,
                },
            }
        );
    }
}
