import { Once, OnceStep, OnNuiEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { emitRpc } from '@core/rpc';
import { wait } from '@core/utils';
import { Apartment } from '@public/shared/housing/housing';

import { NuiEvent, ServerEvent } from '../../shared/event';
import { Feature, isFeatureEnabled } from '../../shared/features';
import { JobPermission, JobType } from '../../shared/job';
import { MenuType } from '../../shared/nui/menu';
import { BoxZone } from '../../shared/polyzone/box.zone';
import { getDistance, toVector3Object, Vector3, Vector4 } from '../../shared/polyzone/vector';
import { Err, Ok } from '../../shared/result';
import { RpcServerEvent } from '../../shared/rpc';
import { Garage, GarageCategory, GarageType, GarageVehicle } from '../../shared/vehicle/garage';
import { VehicleClass } from '../../shared/vehicle/vehicle';
import { BlipFactory } from '../blip';
import { InventoryManager } from '../inventory/inventory.manager';
import { JobService } from '../job/job.service';
import { Monitor } from '../monitor/monitor';
import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';
import { ObjectProvider } from '../object/object.provider';
import { PlayerService } from '../player/player.service';
import { GarageRepository } from '../repository/garage.repository';
import { VehicleRepository } from '../repository/vehicle.repository';
import { TargetFactory } from '../target/target.factory';
import { VehicleService } from './vehicle.service';

type BlipConfig = {
    name: string;
    sprite: number;
    color: number;
};

const DISTANCE_STORE_VEHICLE_THRESHOLD = 15.0;

const BlipConfigMap: Partial<Record<GarageType, Partial<Record<GarageCategory, BlipConfig | null>>>> = {
    [GarageType.Private]: {
        [GarageCategory.Car]: { name: 'Parking Privé', sprite: 357, color: 5 },
        [GarageCategory.Sea]: { name: 'Port Privé', sprite: 356, color: 5 },
    },
    [GarageType.Public]: {
        [GarageCategory.Car]: { name: 'Parking Public', sprite: 357, color: 3 },
        [GarageCategory.Air]: { name: 'Héliport Public', sprite: 360, color: 3 },
        [GarageCategory.All]: { name: 'Parking Public', sprite: 357, color: 3 },
        [GarageCategory.Sea]: { name: 'Port Public', sprite: 356, color: 3 },
    },
    [GarageType.Depot]: {
        [GarageCategory.All]: { name: 'Fourrière', sprite: 68, color: 3 },
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

    @Inject(VehicleRepository)
    private vehicleRepository: VehicleRepository;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(JobService)
    private jobService: JobService;

    @Inject(Monitor)
    private monitor: Monitor;

    private pounds: Record<string, Garage> = {};

    private isShowingGaragePlaces = false;

    @Once(OnceStep.RepositoriesLoaded)
    public init() {
        const garageList = this.garageRepository.get();
        const jobGaragePayStation = GetHashKey('soz_prop_paystation');
        this.pounds = {};

        for (const garageIdentifier of Object.keys(garageList)) {
            const garage = garageList[garageIdentifier];

            if (!isFeatureEnabled(Feature.Boat) && garage.category === GarageCategory.Sea) {
                continue;
            }

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

            if (
                garage.type === GarageType.Depot ||
                garage.category == GarageCategory.Sea ||
                garage.id == 'lsmc_privateparking'
            ) {
                this.objectProvider.createObject({
                    model: jobGaragePayStation,
                    position: [...garage.zone.center, garage.zone.heading] as Vector4,
                    id: `garage_${garageIdentifier}`,
                });

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
            }

            if (garage.type === GarageType.Job) {
                this.objectProvider.createObject({
                    model: jobGaragePayStation,
                    position: [...garage.zone.center, garage.zone.heading] as Vector4,
                    id: `garage_${garageIdentifier}`,
                });

                targets.push({
                    label: 'Accéder au parking entreprise',
                    icon: 'c:garage/GarageEntreprise.png',
                    action: () => {
                        this.enterGarage(garageIdentifier, garage);
                    },
                    job: garage.job,
                });
            }

            if (garage.type === GarageType.JobLuxury) {
                this.objectProvider.createObject({
                    model: jobGaragePayStation,
                    position: [...garage.zone.center, garage.zone.heading] as Vector4,
                    id: `garage_${garageIdentifier}`,
                });

                targets.push({
                    label: 'Accéder au parking entreprise luxe',
                    icon: 'c:garage/GarageEntreprise.png',
                    action: () => {
                        this.enterGarage(garageIdentifier, garage);
                    },
                    job: garage.job,
                });
            }

            if (targets.length > 0) {
                this.targetFactory.createForBoxZone(
                    `garage_enter_${garageIdentifier}`,
                    { ...garage.zone },
                    targets,
                    2.5
                );
            }
        }

        this.targetFactory.createForAllVehicle(
            [
                {
                    label: 'Fourriérer',
                    icon: 'c:mechanic/CarFourriere.png',
                    action: async entity => {
                        const closestPound = this.getClosestPound();

                        if (!closestPound) {
                            return false;
                        }

                        await this.doStoreVehicle(closestPound[0], closestPound[1], entity);
                    },
                    blackoutGlobal: true,
                    blackoutJob: JobType.Bennys,
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
                {
                    label: 'Fourrière Fédérale',
                    icon: 'c:mechanic/CarFourriere.png',
                    action: async entity => {
                        const closestPound = this.getClosestPound();

                        if (!closestPound) {
                            return false;
                        }

                        const value = await this.inputService.askInput(
                            {
                                title: "Delai d'immobilisation du véhicule en heures (0-72)",
                                defaultValue: '',
                                maxCharacters: 30,
                            },
                            value => {
                                if (!value) {
                                    return Ok(true);
                                }
                                const int = parseInt(value);
                                if (isNaN(int) || int < 0 || int > 72) {
                                    return Err('Valeur incorrecte');
                                }
                                return Ok(true);
                            }
                        );

                        const intValue = parseInt(value);
                        if (isNaN(intValue)) {
                            return;
                        }

                        await wait(50);

                        const model = GetEntityModel(entity);
                        const vehConfig = this.vehicleRepository.getByModelHash(model);
                        const maxPrice = Math.round(vehConfig.price * 0.15);

                        const cost = await this.inputService.askInput(
                            {
                                title: `Coût de sortie (0-${maxPrice})`,
                                defaultValue: '',
                                maxCharacters: 30,
                            },
                            value => {
                                if (!value) {
                                    return Ok(true);
                                }
                                const int = parseInt(value);
                                if (isNaN(int) || int < 0 || int > maxPrice) {
                                    return Err('Valeur incorrecte');
                                }
                                return Ok(true);
                            }
                        );

                        const intCost = parseInt(cost);
                        if (isNaN(intCost)) {
                            return;
                        }

                        await this.doStoreVehicle(closestPound[0], closestPound[1], entity, intValue, intCost);
                    },
                    job: { lspd: 0, bcso: 0, sasp: 0 },
                    blackoutGlobal: true,
                    canInteract: (): boolean => {
                        const player = this.playerService.getPlayer();

                        if (!player) {
                            return false;
                        }

                        if (!player.job.onduty) {
                            return false;
                        }

                        if (!this.jobService.hasPermission(player.job.id, JobPermission.FDOFedPound)) {
                            return false;
                        }

                        const closestPound = this.getClosestPound();

                        if (!closestPound) {
                            return false;
                        }

                        return true;
                    },
                },
            ],
            1.5
        );
    }

    private getClosestPound(): [string, Garage] | null {
        const playerPosition = GetEntityCoords(PlayerPedId(), false) as Vector3;

        for (const garageIdentifier of Object.keys(this.pounds)) {
            const garage = this.pounds[garageIdentifier];
            const distance = getDistance(playerPosition, garage.zone.center);

            if (distance < DISTANCE_STORE_VEHICLE_THRESHOLD) {
                return [garageIdentifier, garage];
            }

            for (const place of garage.parkingPlaces) {
                const distance = getDistance(playerPosition, place.center);

                if (distance < DISTANCE_STORE_VEHICLE_THRESHOLD) {
                    return [garageIdentifier, garage];
                }
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
        let isNear = false;

        if (getDistance(position, garage.zone.center) <= DISTANCE_STORE_VEHICLE_THRESHOLD) {
            isNear = true;
        }

        if (!isNear) {
            for (const place of garage.parkingPlaces) {
                if (getDistance(position, place.center) <= DISTANCE_STORE_VEHICLE_THRESHOLD) {
                    isNear = true;

                    break;
                }
            }
        }

        if (!isNear) {
            this.notifier.notify('Vous devez vous rapprocher du parking pour ranger votre véhicule.', 'error');

            return;
        }

        await this.doStoreVehicle(id, garage, vehicle);

        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.VehicleGarageStoreTrailer)
    public async storeVehicleTrailer({ id, garage }) {
        const vehicle = this.vehicleService.getClosestVehicle({ maxDistance: 25 }, vehicle => {
            return GetVehicleClass(vehicle) === VehicleClass.Utility;
        });

        if (!vehicle) {
            this.notifier.notify('Aucune remorque à proximité.', 'error');
            return;
        }

        await this.doStoreVehicle(id, garage, vehicle);

        this.nuiMenu.closeMenu();
    }

    public async doStoreVehicle(id: string, garage: Garage, vehicle: number, delai = 0, cost = 0) {
        if (IsVehicleAttachedToTrailer(vehicle)) {
            DetachVehicleFromTrailer(vehicle);

            await wait(500);
        }

        const networkId = NetworkGetNetworkIdFromEntity(vehicle);
        const plate = GetVehicleNumberPlateText(vehicle).trim();

        this.monitor.publish(
            'vehicle_garage_in_client_start',
            {
                vehicle_plate: plate,
            },
            {
                garage: id,
                garage_type: garage.type,
                position: toVector3Object(GetEntityCoords(PlayerPedId()) as Vector3),
            }
        );
        TriggerServerEvent(ServerEvent.VEHICLE_GARAGE_STORE, id, garage, networkId, delai, cost);
    }

    @OnNuiEvent(NuiEvent.VehicleGarageShowPlaces)
    public async showPlacesGarages({ garage }: { garage: Garage }) {
        if (this.isShowingGaragePlaces) {
            return null;
        }

        this.isShowingGaragePlaces = true;
        const places = [];

        for (const parkingPlace of garage.parkingPlaces) {
            places.push(BoxZone.fromZone(parkingPlace));
        }

        const end = GetGameTimer() + 15000;

        while (GetGameTimer() < end) {
            for (const place of places) {
                DrawLightWithRange(place.center[0], place.center[1], place.center[2], 54, 193, 110, 3.0, 80.0);
            }

            await wait(0);
        }

        this.isShowingGaragePlaces = false;
    }

    public async openHouseGarageMenu(propertyId: string, apartments: Apartment[]) {
        const garage = this.garageRepository.get()[propertyId];

        if (!garage) {
            this.notifier.notify('Aucun garage trouvé.', 'error');

            return;
        }

        await this.enterGarage(propertyId, garage, apartments);
    }

    @OnNuiEvent(NuiEvent.VehicleGarageSetName)
    public async renameVehicle({ id, garage, vehicle }: { id: number; garage: Garage; vehicle: number }) {
        const input = await this.inputService.askInput(
            {
                title: 'Nom du véhicule',
                defaultValue: '',
                maxCharacters: 30,
            },
            input => {
                if (input.length < 5) {
                    return Err('Le nom doit faire au moins 5 caractères.');
                }

                if (input.length > 30) {
                    return Err('Le nom doit faire au plus 30 caractères.');
                }

                return Ok(true);
            }
        );

        if (!input) {
            return;
        }

        TriggerServerEvent(ServerEvent.VEHICLE_GARAGE_RENAME, id, garage, vehicle, input);

        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.VehicleGarageTakeOut)
    public async takeOutVehicle({
        id,
        garage,
        vehicle,
        use_ticket,
    }: {
        id: number;
        garage: Garage;
        vehicle: number;
        use_ticket: boolean;
    }) {
        const garageWithFreePlaces: Garage = { ...garage, parkingPlaces: [] };

        for (const parkingPlace of garage.parkingPlaces) {
            if (
                !IsPositionOccupied(
                    parkingPlace.center[0],
                    parkingPlace.center[1],
                    parkingPlace.center[2],
                    0.1,
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

        TriggerServerEvent(ServerEvent.VEHICLE_GARAGE_RETRIEVE, id, garageWithFreePlaces, vehicle, use_ticket);

        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.VehicleGarageTransfer)
    public async transferVehicle({ id, from, to }: { id: number; from: Garage; to: Garage }) {
        TriggerServerEvent(ServerEvent.VEHICLE_GARAGE_TRANSFER, id, from, to);

        this.nuiMenu.closeMenu();
    }

    public async enterGarage(id: string, garage: Garage, apartments: Apartment[] = []) {
        const vehicles = await emitRpc<GarageVehicle[]>(RpcServerEvent.VEHICLE_GARAGE_GET_VEHICLES, id, garage);
        if (vehicles === null) {
            return;
        }

        let free_places = null;
        let max_places = null;
        let apartmentPlaces = {} as Record<number, [number | null, number | null]>;

        if (garage.type === GarageType.Private) {
            [free_places, max_places] = await emitRpc<[number, number]>(
                RpcServerEvent.VEHICLE_GARAGE_GET_PLACES,
                id,
                garage
            );
        }

        if (garage.type === GarageType.House) {
            apartmentPlaces = await emitRpc<Record<string, [number | null, number | null]>>(
                RpcServerEvent.VEHICLE_GARAGE_GET_PROPERTY_PLACES,
                id,
                garage,
                apartments.map(apartment => apartment.identifier)
            );
        }

        const vehicleRenamed = vehicles.map(garageVehicle => {
            if (garageVehicle.name === null) {
                const name = GetLabelText(GetDisplayNameFromVehicleModel(garageVehicle.vehicle.modelName));

                return { ...garageVehicle, name };
            }

            return garageVehicle;
        });

        this.nuiMenu.openMenu(
            MenuType.Garage,
            {
                vehicles: vehicleRenamed,
                id,
                garage,
                free_places,
                max_places,
                has_fake_ticket: this.inventoryManager.hasEnoughItem('parking_ticket_fake', 1),
                transferGarageList:
                    garage.transferList
                        ?.map(garageId => {
                            const garage = this.garageRepository.get()[garageId];

                            if (!garage) {
                                return null;
                            }

                            return {
                                id: garageId,
                                garage,
                            };
                        })
                        .filter(garage => garage !== null) ?? [],
                apartments: apartments,
                apartmentsPlaces: apartmentPlaces,
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
