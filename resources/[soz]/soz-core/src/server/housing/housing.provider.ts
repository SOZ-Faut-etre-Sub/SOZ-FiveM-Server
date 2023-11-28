import { OnEvent } from '../../core/decorators/event';
import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { wait } from '../../core/utils';
import { ClientEvent } from '../../shared/event/client';
import { ServerEvent } from '../../shared/event/server';
import {
    Apartment,
    getApartmentGarageName,
    getPropertyGarageName,
    getResellPrice,
    isTrailer,
    Property,
} from '../../shared/housing/housing';
import { PlayerData } from '../../shared/player';
import { getDistance, Vector3, Vector4 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { BankService } from '../bank/bank.service';
import { InventoryManager } from '../inventory/inventory.manager';
import { Monitor } from '../monitor/monitor';
import { Notifier } from '../notifier';
import { PlayerAppearanceService } from '../player/player.appearance.service';
import { PlayerCriminalService } from '../player/player.criminal.service';
import { PlayerMoneyService } from '../player/player.money.service';
import { PlayerPositionProvider } from '../player/player.position.provider';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../player/progress.service';
import { HousingRepository } from '../repository/housing.repository';
import { VehicleService } from '../vehicle/vehicle.service';

@Provider()
export class HousingProvider {
    @Inject(HousingRepository)
    private housingRepository: HousingRepository;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerPositionProvider)
    private playerPositionProvider: PlayerPositionProvider;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(BankService)
    private bankService: BankService;

    @Inject(PlayerAppearanceService)
    private playerAppearanceService: PlayerAppearanceService;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(PlayerCriminalService)
    private playerCriminalService: PlayerCriminalService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    private playerTemporaryAccess = new Map<string, Set<number>>();

    @OnEvent(ServerEvent.HOUSING_ADD_TEMPORARY_ACCESS)
    public async addTemporaryAccess(source: number, propertyId: number, apartmentId: number, targetSource: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const target = this.playerService.getPlayer(targetSource);

        if (!target) {
            return;
        }

        const [property, apartment] = await this.housingRepository.getApartment(propertyId, apartmentId);

        if (!property || !apartment) {
            return;
        }

        if (
            apartment.owner !== player.citizenid &&
            apartment.roommate !== player.citizenid &&
            (apartment.senatePartyId === null || apartment.senatePartyId !== player.partyMember?.partyId)
        ) {
            this.notifier.error(player.source, 'Vous ne possédez pas cet appartement.');

            return;
        }

        if (!this.playerTemporaryAccess.has(target.citizenid)) {
            this.playerTemporaryAccess.set(target.citizenid, new Set());
        }

        this.playerTemporaryAccess.get(target.citizenid).add(apartmentId);

        this.notifier.notify(target.source, `Vous avez reçu un accès temporaire à un appartement.`, 'success');
        this.notifier.notify(
            player.source,
            `Vous avez donné un accès temporaire à l'appartement ${apartment.label}.`,
            'success'
        );

        TriggerClientEvent(ClientEvent.HOUSING_ADD_TEMPORARY_ACCESS, target.source, apartmentId);
    }

    @Rpc(RpcServerEvent.HOUSING_GET_TEMPORARY_ACCESS)
    public getTemporaryAccess(source: number): number[] {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        // check cayo perico
        // check party house

        if (!this.playerTemporaryAccess.has(player.citizenid)) {
            return [];
        }

        const apartments = [];

        for (const apartment of this.playerTemporaryAccess.get(player.citizenid)) {
            apartments.push(apartment);
        }

        return apartments;
    }

    @Exportable('GetApartmentTier')
    public async getApartmentTier(propertyId: number, apartmentId: number) {
        const [, apartment] = await this.housingRepository.getApartment(propertyId, apartmentId);

        if (!apartment || apartment.tier === null) {
            return 0;
        }

        return apartment.tier;
    }

    @OnEvent(ServerEvent.HOUSING_ADD_ROOMMATE)
    public async addRoommate(source: number, propertyId: number, apartmentId: number, targetSource: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const target = this.playerService.getPlayer(targetSource);

        if (!target) {
            return;
        }

        const [property, apartment] = await this.housingRepository.getApartment(propertyId, apartmentId);

        if (!property || !apartment) {
            return;
        }

        const playerPosition = GetEntityCoords(GetPlayerPed(player.source)) as Vector3;
        const targetPosition = GetEntityCoords(GetPlayerPed(target.source)) as Vector3;

        if (getDistance(playerPosition, targetPosition) > 2) {
            this.notifier.error(player.source, "Personne n'est à portée de vous.");

            return;
        }

        if (await this.housingRepository.hasApartment(target.citizenid)) {
            this.notifier.error(player.source, 'Cette personne a déjà une maison.');

            return;
        }

        if (apartment.owner !== player.citizenid) {
            this.notifier.error(player.source, 'Vous ne possédez pas cet appartement.');

            return;
        }

        if (apartment.roommate !== null) {
            this.notifier.error(player.source, 'Cet appartement a déjà un colocataire.');

            return;
        }

        if (apartment.senatePartyId !== null) {
            this.notifier.error(player.source, 'Cet appartement est réservé à un parti politique.');

            return;
        }

        await this.housingRepository.setApartmentRoommate(target.citizenid, apartment.id);

        this.playerService.setPlayerApartment(target.source, apartment, property);

        this.notifier.notify(target.source, 'Vous avez été ajouté en tant que colocataire.', 'success');
        this.notifier.notify(player.source, 'Vous avez ajouté un colocataire à votre maison.', 'success');
    }

    @OnEvent(ServerEvent.HOUSING_BELL_APARTMENT)
    public async bell(source: number, propertyId: number, apartmentId: number) {
        const [property, apartment] = await this.housingRepository.getApartment(propertyId, apartmentId);

        if (!property || !apartment) {
            return;
        }

        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        this.notifier.notify(player.source, `Vous avez sonné à la porte du ${apartment.label}.`, 'info');

        let target = this.playerService.getPlayerByCitizenId(apartment.owner);

        if (!target && apartment.roommate !== null) {
            target = this.playerService.getPlayerByCitizenId(apartment.roommate);
        }

        if (!target) {
            return;
        }

        if (apartment.senatePartyId !== null) {
            this.notifier.error(player.source, 'Cet appartement est réservé à un parti politique.');

            return;
        }

        TriggerClientEvent(ClientEvent.HOUSING_REQUEST_ENTER, target.source, propertyId, apartmentId, source);
    }

    @OnEvent(ServerEvent.HOUSING_BUY_APARTMENT)
    public async buy(source: number, propertyId: number, apartmentId: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const [property, apartment] = await this.housingRepository.getApartment(propertyId, apartmentId);

        if (!property || !apartment) {
            return;
        }

        if (await this.housingRepository.hasApartment(player.citizenid)) {
            this.notifier.error(player.source, "Vous ne pouvez acheter plus d'une propriété.");

            return;
        }

        if (apartment.owner !== null) {
            this.notifier.error(player.source, 'Cet appartement est déjà possédé.');

            return;
        }

        if (apartment.senatePartyId !== null) {
            this.notifier.error(player.source, 'Cet appartement est réservé à un parti politique.');

            return;
        }

        if (this.playerMoneyService.remove(player.source, apartment.price) === false) {
            this.notifier.error(player.source, "Vous n'avez pas assez d'argent.");

            return;
        }

        await this.housingRepository.setApartmentOwner(player.citizenid, apartment.id);

        this.monitor.publish(
            'house_buy',
            {
                player_source: player.source,
            },
            {
                house_id: apartment.identifier,
                amount: apartment.price,
            }
        );

        this.playerService.setPlayerApartment(player.source, apartment, property);

        this.notifier.notify(
            player.source,
            `Vous venez ~g~d'acquérir~s~ une maison pour ~b~$${apartment.price}.`,
            'success'
        );
    }

    @OnEvent(ServerEvent.HOUSING_ENTER_APARTMENT)
    public async enter(source: number, propertyId: number, apartmentId: number, target: number | null = null) {
        const player = this.playerService.getPlayer(target ? target : source);

        if (!player) {
            return;
        }

        const [property, apartment] = await this.housingRepository.getApartment(propertyId, apartmentId);

        if (!property || !apartment) {
            return;
        }

        await this.doEnterApartment(player, property, apartment);
    }

    @OnEvent(ServerEvent.HOUSING_EXIT_APARTMENT)
    public async exit(source: number, propertyId: number, apartmentId: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const [property, apartment] = await this.housingRepository.getApartment(propertyId, apartmentId);

        if (!property || !apartment) {
            return;
        }

        if (player.metadata.inside.exitCoord === false) {
            return;
        }

        const position = [
            player.metadata.inside.exitCoord.x,
            player.metadata.inside.exitCoord.y,
            player.metadata.inside.exitCoord.z,
            player.metadata.inside.exitCoord.w,
        ] as Vector4;

        const { completed } = await this.progressService.progress(
            player.source,
            'housing_action',
            'Vous sortez...',
            1000,
            {
                dictionary: 'mp_doorbell',
                name: 'ring_bell_b',
                options: {
                    onlyUpperBody: true,
                },
            }
        );

        if (!completed) {
            return;
        }

        this.playerPositionProvider.teleportToCoords(player.source, position);

        this.playerService.setPlayerMetadata(player.source, 'inside', {
            apartment: false,
            property: null,
            exitCoord: player.metadata.inside.exitCoord, //keep exitCoord for command player-tp-entrance
        });

        TriggerClientEvent(ClientEvent.HOUSING_TELEPORT, player.source, false);
    }

    @OnEvent(ServerEvent.HOUSING_REMOVE_ROOMMATE)
    public async removeRoommate(source: number, propertyId: number, apartmentId: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const [property, apartment] = await this.housingRepository.getApartment(propertyId, apartmentId);

        if (!property || !apartment) {
            return;
        }

        if (apartment.owner !== player.citizenid && apartment.roommate !== player.citizenid) {
            this.notifier.error(player.source, 'Vous ne possédez pas cet appartement.');

            return;
        }

        if (apartment.roommate === null) {
            this.notifier.error(player.source, "Cet appartement n'a pas de colocataire.");

            return;
        }

        await this.vehicleService.transferToAirport(getPropertyGarageName(property), apartment.roommate);
        this.playerAppearanceService.clearCloakroom(apartment.roommate);

        const roommate = this.playerService.getPlayerByCitizenId(apartment.roommate);

        if (roommate) {
            this.playerService.setPlayerApartment(roommate.source, null, null);
            this.notifier.notify(roommate.source, 'Vous avez été retiré de votre colocation.', 'error');
        }

        if (apartment.owner === player.citizenid) {
            this.notifier.notify(player.source, 'Vous avez retiré votre colocataire de votre maison.', 'success');
        }

        await this.housingRepository.setApartmentRoommate(null, apartment.id);
    }

    public async clearApartment(property: Property, apartment: Apartment, notify = true) {
        this.inventoryManager.clearApartment(apartment.identifier);
        this.bankService.clearAccount(apartment.identifier);

        if (apartment.owner !== null) {
            this.playerAppearanceService.clearCloakroom(apartment.owner);
            await this.vehicleService.transferToAirport(getPropertyGarageName(property), apartment.owner);

            const player = this.playerService.getPlayerByCitizenId(apartment.owner);

            if (player) {
                this.playerService.setPlayerApartment(player.source, null, null);
            }
        }

        if (apartment.roommate !== null) {
            this.playerAppearanceService.clearCloakroom(apartment.roommate);
            await this.vehicleService.transferToAirport(getPropertyGarageName(property), apartment.roommate);

            const roommate = this.playerService.getPlayerByCitizenId(apartment.roommate);

            if (roommate) {
                this.playerService.setPlayerApartment(roommate.source, null, null);

                if (notify) {
                    this.notifier.notify(
                        roommate.source,
                        `Votre colocataire vient de vendre votre appartement.`,
                        'info'
                    );
                }
            }
        }

        await this.vehicleService.transferToAirport(getApartmentGarageName(apartment));
        await this.housingRepository.clearApartment(apartment.id);
    }

    @OnEvent(ServerEvent.HOUSING_SELL_APARTMENT)
    public async sell(source: number, propertyId: number, apartmentId: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const [property, apartment] = await this.housingRepository.getApartment(propertyId, apartmentId);

        if (!property || !apartment) {
            return;
        }

        if (apartment.owner !== player.citizenid) {
            this.notifier.error(player.source, 'Vous ne possédez pas cet appartement.');

            return;
        }

        if (apartment.senatePartyId !== null) {
            this.notifier.error(player.source, 'Cet appartement est réservé à un parti politique.');

            return;
        }

        const resellPrice = getResellPrice(apartment, property);

        if (!this.playerMoneyService.add(player.source, resellPrice)) {
            return;
        }

        await this.clearApartment(property, apartment, true);

        this.monitor.publish(
            'house_sell',
            {
                player_source: player.source,
            },
            {
                house_id: apartment.identifier,
                amount: resellPrice,
            }
        );

        this.notifier.notify(
            player.source,
            `Vous venez de ~r~céder~s~ votre maison pour ~b~$${resellPrice}.`,
            'success'
        );
    }

    @OnEvent(ServerEvent.HOUSING_VISIT_APARTMENT)
    public async visit(source: number, propertyId: number, apartmentId: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const [property, apartment] = await this.housingRepository.getApartment(propertyId, apartmentId);

        if (!property || !apartment) {
            return;
        }

        if (apartment.senatePartyId !== null) {
            this.notifier.error(player.source, 'Cet appartement est réservé à un parti politique.');

            return;
        }

        await this.doEnterApartment(player, property, apartment);
    }

    @OnEvent(ServerEvent.HOUSING_UPGRADE_APARTMENT_TIER)
    public async upgradeTier(source: number, tier: number, price: number, zkeaAmount: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        if (!player.apartment) {
            this.notifier.error(player.source, "Vous n'avez pas d'appartement.");

            return;
        }

        const [property, apartment] = await this.housingRepository.getApartment(
            player.apartment.property_id,
            player.apartment.id
        );

        if (!property || !apartment) {
            return;
        }

        if (!this.playerMoneyService.remove(player.source, price)) {
            this.notifier.error(player.source, "Vous n'avez pas assez d'argent.");

            return;
        }

        if (!this.inventoryManager.removeItemFromInventory('cabinet_storage', 'cabinet_zkea', zkeaAmount)) {
            this.notifier.error(player.source, "Amélioration de palier impossible car Zkea n'a pas assez de stock.");
            this.playerMoneyService.add(player.source, price);

            return;
        }

        this.inventoryManager.setHouseStashMaxWeightFromTier(apartment.identifier, tier);
        this.playerService.setPlayerApartmentTier(player.source, tier);

        await this.housingRepository.setApartmentTier(apartment.id, tier);

        this.notifier.notify(
            player.source,
            `Vous venez ~g~d'améliorer~s~ votre appartement au palier ~g~${tier}~s~ pour ~b~$${price}~s~.`,
            'success'
        );

        this.monitor.publish(
            'house_upgrade',
            {
                player_source: player.source,
            },
            {
                house_id: apartment.identifier,
                tier: tier,
                amount: price,
            }
        );

        if (apartment.roommate) {
            const roommate = this.playerService.getPlayerByCitizenId(apartment.roommate);

            if (roommate) {
                this.playerService.setPlayerApartmentTier(roommate.source, tier);
            }
        }
    }

    @OnEvent(ServerEvent.HOUSING_ADD_PARKING_PLACE)
    public async addParkingPlace(source: number, hasParking: boolean, price: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        if (!player.apartment) {
            this.notifier.error(player.source, "Vous n'avez pas d'appartement.");

            return;
        }

        const [property, apartment] = await this.housingRepository.getApartment(
            player.apartment.property_id,
            player.apartment.id
        );

        if (!property || !apartment) {
            return;
        }

        if (!isTrailer(property)) {
            return;
        }

        if (!this.playerMoneyService.remove(player.source, price)) {
            this.notifier.error(player.source, "Vous n'avez pas assez d'argent.");

            return;
        }

        this.playerService.setPlayerApartmentHasParking(player.source, hasParking);

        await this.housingRepository.setApartmentHasParking(apartment.id, hasParking);

        this.notifier.notify(
            player.source,
            `Vous venez ~g~d'ajouter~s~ une place de parking à votre caravane pour ~b~$${price}~s~.`,
            'success'
        );
    }

    public async hasAccessToApartment(player: PlayerData, apartmentIdentifier: string) {
        const apartment = await this.housingRepository.getApartmentByIdentifier(apartmentIdentifier);

        if (!apartment) {
            return false;
        }

        if (apartment.owner === player.citizenid) {
            return true;
        }

        if (apartment.roommate === player.citizenid) {
            return true;
        }

        if (apartment.senatePartyId !== null && apartment.senatePartyId === player.partyMember?.partyId) {
            return true;
        }

        if (this.playerTemporaryAccess.has(player.citizenid)) {
            return this.playerTemporaryAccess.get(player.citizenid).has(apartment.id);
        }

        return false;
    }

    private async doEnterApartment(player: PlayerData, property: Property, apartment: Apartment) {
        if (this.playerCriminalService.isCriminal(player.citizenid)) {
            this.notifier.error(player.source, 'Vous devez attendre après avoir réalisé une action criminelle.');

            return;
        }

        const ped = GetPlayerPed(player.source);
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (vehicle) {
            this.notifier.error(player.source, "Vous devez d'abord descendre de votre véhicule.");

            return;
        }

        const position = GetEntityCoords(ped) as Vector3;
        const heading = GetEntityHeading(ped);

        const { completed } = await this.progressService.progress(
            player.source,
            'housing_action',
            'Vous entrez...',
            1000,
            {
                dictionary: 'mp_doorbell',
                name: 'ring_bell_b',
                options: {
                    onlyUpperBody: true,
                },
            }
        );

        if (!completed) {
            return;
        }

        this.playerPositionProvider.teleportToCoords(player.source, apartment.position);

        // wait for fade in, so we don't remove culling too early
        await wait(500);

        this.playerService.setPlayerMetadata(player.source, 'inside', {
            apartment: apartment.id,
            property: property.id,
            exitCoord: {
                x: position[0],
                y: position[1],
                z: position[2],
                w: heading,
            },
        });

        TriggerClientEvent(ClientEvent.HOUSING_TELEPORT, player.source, apartment.id);
    }
}
