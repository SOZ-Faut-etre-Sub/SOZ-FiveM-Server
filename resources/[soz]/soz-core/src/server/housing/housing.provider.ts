import { Command } from '@public/core/decorators/command';
import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { wait } from '@public/core/utils';
import { BankService } from '@public/server/bank/bank.service';
import { PriceService } from '@public/server/bank/price.service';
import { HousingFournitureProvider } from '@public/server/housing/housing.fourniture.provider';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { Monitor } from '@public/server/monitor/monitor';
import { Notifier } from '@public/server/notifier';
import { PlayerAppearanceService } from '@public/server/player/player.appearance.service';
import { PlayerCriminalService } from '@public/server/player/player.criminal.service';
import { PlayerMoneyService } from '@public/server/player/player.money.service';
import { PlayerPositionProvider } from '@public/server/player/player.position.provider';
import { PlayerService } from '@public/server/player/player.service';
import { ProgressService } from '@public/server/player/progress.service';
import { HousingRepository } from '@public/server/repository/housing.repository';
import { VehicleService } from '@public/server/vehicle/vehicle.service';
import { ClientEvent } from '@public/shared/event/client';
import { ServerEvent } from '@public/shared/event/server';
import {
    ApartementTiers,
    Apartment,
    getApartmentGarageName,
    getPropertyGarageName,
    getResellPrice,
    hasSearchWarrantAccessInApartment,
    isApartmentExcludeFromHousing,
    isMotel,
    isTrailer,
    Property,
} from '@public/shared/housing/housing';
import { HousingTiers, TYPE_LABEL } from '@public/shared/housing/upgrades';
import {
    HOUSE_CLOAKROOM_TIER_WEIGHTS,
    HOUSE_FRIDGE_TIER_WEIGHTS,
    HOUSE_STORAGE_TIER_WEIGHTS,
    InventoryType,
} from '@public/shared/inventory';
import { PlayerData } from '@public/shared/player';
import { getDistance, Vector3, Vector4 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';
import { TaxType } from '@public/shared/tax';
import { differenceInCalendarDays, differenceInHours } from 'date-fns';

const WEEK_IN_MILLISECONDS = 604_800_000;

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

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

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

    @Inject(PriceService)
    private priceService: PriceService;

    @Inject(HousingFournitureProvider)
    private housingFournitureProvider: HousingFournitureProvider;

    private playerTemporaryAccess = new Map<string, Set<number>>();

    private giveKey(source: number, target: PlayerData, apartment: Apartment) {
        if (!this.playerTemporaryAccess.has(target.citizenid)) {
            this.playerTemporaryAccess.set(target.citizenid, new Set());
        }

        this.playerTemporaryAccess.get(target.citizenid).add(apartment.id);

        this.notifier.notify(target.source, `Vous avez reçu un accès temporaire à une habitation.`, 'success');
        this.notifier.notify(
            source,
            `Vous avez donné un accès temporaire à l'habitation ${apartment.label}.`,
            'success'
        );

        TriggerClientEvent(ClientEvent.HOUSING_ADD_TEMPORARY_ACCESS, target.source, apartment.id);
    }

    @Command('givekey', { role: 'admin' })
    public async giveKeyCommand(source: number, targetSource: number, apartmentId: string) {
        const target = this.playerService.getPlayer(targetSource);

        if (!target) {
            this.notifier.notify(source, 'Pas de joueur avec cet id');
            return;
        }

        const apartment = await this.housingRepository.getApartmentByIdentifier(apartmentId);
        this.giveKey(source, target, apartment);
    }

    @Command('set-apartment-change', {
        role: ['admin', 'staff'],
        arguments: [
            { name: 'source', help: 'Target player so change the timer' },
            { name: 'minutes', help: 'Number of minute to set the time to be able to change main residence in' },
        ],
    })
    public async setApartmentChange(source: number, targetSource: number, minutes: number) {
        const target = this.playerService.getPlayer(targetSource);

        if (!target) {
            this.notifier.notify(source, 'Aucun joueur avec cet id.');
            return;
        }

        const nextChange = Date.now() + minutes * 60_000;
        this.playerService.setPlayerMetadata(
            target.source,
            'main_residence_last_change',
            nextChange - WEEK_IN_MILLISECONDS
        );

        const now = Date.now();
        if (nextChange > now) {
            const diffInHours = differenceInHours(nextChange, now);
            this.notifier.notify(
                source,
                `${target.charinfo.lastname} ${target.charinfo.firstname} peut changer de résidence principale dans ${diffInHours < 24 ? `${diffInHours} heure(s).` : `${differenceInCalendarDays(nextChange, now)} jour(s).`}`
            );
        } else {
            this.notifier.notify(
                source,
                `${target.charinfo.lastname} ${target.charinfo.firstname} peut changer de résidence principale.`
            );
        }
    }

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
            apartment.tenant !== player.citizenid &&
            apartment.roommate !== player.citizenid &&
            (apartment.senatePartyId === null || apartment.senatePartyId !== player.partyMember?.partyId)
        ) {
            this.notifier.error(player.source, 'Vous ne pouvez pas donner les clés de cette habitation.');

            return;
        }

        this.giveKey(source, target, apartment);
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

    @OnEvent(ServerEvent.HOUSING_CHANGE_PRINCIPAL_APARTMENT)
    public async changePrincipalApartement(source: number, propertyId: number, apartmentId: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const [property, apartment] = await this.housingRepository.getApartment(propertyId, apartmentId);

        if (!property || !apartment) {
            return;
        }

        const currentApartment = await this.housingRepository.getPlayerApartment(player.citizenid);

        if (currentApartment) {
            if (currentApartment.owner === player.citizenid && player.metadata.main_residence_last_change) {
                const now = Date.now();
                const canChangeAt = player.metadata.main_residence_last_change + WEEK_IN_MILLISECONDS;
                if (canChangeAt > now) {
                    const diffInHours = differenceInHours(canChangeAt, now);
                    this.notifier.error(
                        player.source,
                        `Vous ne pouvez pas changer de résidence principale pour le moment. Attendez encore ${diffInHours < 24 ? `${diffInHours} heure(s).` : `${differenceInCalendarDays(canChangeAt, now)} jour(s).`}`
                    );

                    return;
                }
            }

            if (currentApartment.owner !== player.citizenid) {
                this.notifier.error(
                    player.source,
                    'Vous devez quitter votre habitation actuelle avant de changer de résidence principale.'
                );

                return;
            }
        }

        if (apartment.owner !== player.citizenid) {
            this.notifier.error(player.source, 'Vous ne possédez pas cette habitation.');

            return;
        }

        if (apartment.tenant !== null) {
            this.notifier.error(player.source, 'Cette habitation a un locataire.');

            return;
        }

        if (apartment.roommate !== null) {
            this.notifier.error(player.source, 'Cette habitation a un co-locataire.');

            return;
        }

        if (apartment.senatePartyId !== null) {
            this.notifier.error(player.source, 'Cette habitation est réservé à un parti politique.');

            return;
        }

        if (currentApartment) {
            await this.housingRepository.setApartmentTenant(null, currentApartment.id);
            currentApartment.tenant = null;
            this.housingFournitureProvider.deletePlatesIfNeeded(currentApartment);
        }

        await this.housingRepository.setApartmentTenant(player.citizenid, apartment.id);

        this.playerService.setPlayerApartment(player.source, apartment, property);
        this.playerService.setPlayerMetadata(player.source, 'main_residence_last_change', Date.now());
        this.housingFournitureProvider.clearPlateCheck(apartment.id);

        this.notifier.notify(player.source, "Vous avez changé d'habitation principale.", 'success');
    }

    @OnEvent(ServerEvent.HOUSING_ADD_TENANT)
    public async addTenant(source: number, propertyId: number, apartmentId: number, targetSource: number) {
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
            this.notifier.error(player.source, 'Vous ne possédez pas cette habitation.');

            return;
        }

        if (apartment.tenant !== null) {
            this.notifier.error(player.source, 'Cette habitation a déjà un locataire.');

            return;
        }

        if (apartment.senatePartyId !== null) {
            this.notifier.error(player.source, 'Cette habitation est réservé à un parti politique.');

            return;
        }

        await this.housingRepository.setApartmentTenant(target.citizenid, apartment.id);

        this.playerService.setPlayerApartment(target.source, apartment, property);
        this.housingFournitureProvider.clearPlateCheck(apartment.id);

        this.notifier.notify(target.source, 'Vous avez été ajouté en tant que locataire.', 'success');
        this.notifier.notify(player.source, 'Vous avez ajouté un locataire à votre maison.', 'success');
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
            this.notifier.error(player.source, 'Vous ne possédez pas cette habitation.');

            return;
        }

        if (apartment.roommate !== null) {
            this.notifier.error(player.source, 'Cette habitation a déjà un colocataire.');

            return;
        }

        if (apartment.senatePartyId !== null) {
            this.notifier.error(player.source, 'Cette habitation est réservé à un parti politique.');

            return;
        }

        await this.housingRepository.setApartmentRoommate(target.citizenid, apartment.id);

        this.playerService.setPlayerApartment(target.source, apartment, property);
        this.housingFournitureProvider.clearPlateCheck(apartment.id);

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

        if (apartment.senatePartyId !== null) {
            this.notifier.error(player.source, 'Cet appartement est réservé à un parti politique.');

            return;
        }

        this.notifier.notify(player.source, `Vous avez sonné à la porte du ${apartment.label}.`, 'info');

        const targets: number[] = [];

        const owner = this.playerService.getPlayerByCitizenId(apartment.owner);
        const tenant = this.playerService.getPlayerByCitizenId(apartment.tenant);
        const roommate = this.playerService.getPlayerByCitizenId(apartment.roommate);

        if (!apartment.tenant && !apartment.roommate) {
            if (owner) {
                targets.push(owner.source);
            }
        } else {
            if (tenant) {
                targets.push(tenant.source);
            }

            if (apartment.roommate !== null && roommate) {
                targets.push(roommate.source);
            }
        }

        if (targets.length === 0) {
            return;
        }

        targets.forEach(target => {
            TriggerClientEvent(
                ClientEvent.HOUSING_REQUEST_ENTER,
                target,
                propertyId,
                apartmentId,
                source,
                apartment.label
            );
        });
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

        if (apartment.owner !== null) {
            this.notifier.error(player.source, 'Cette habitation est déjà possédé.');

            return;
        }

        if (apartment.senatePartyId !== null) {
            this.notifier.error(player.source, 'Cet appartement est réservé à un parti politique.');

            return;
        }

        const hasPlayerAnotherApartment = await this.housingRepository.hasApartment(player.citizenid);
        if (hasPlayerAnotherApartment && isMotel(apartment)) {
            this.notifier.error(
                player.source,
                "Il n'est pas possible d'acheter cette habitation en tant que résidence secondaire."
            );

            return;
        }

        if (!(await this.playerMoneyService.buy(player.source, apartment.price, TaxType.HOUSING))) {
            this.notifier.error(player.source, "Vous n'avez pas assez d'argent.");

            return;
        }

        if (hasPlayerAnotherApartment) {
            await this.housingRepository.setApartmentOwner(player.citizenid, apartment.id);
        } else {
            await this.housingRepository.setApartmentOwnerAndTenant(player.citizenid, apartment.id);
            this.playerService.setPlayerMetadata(player.source, 'main_residence_last_change', Date.now());
        }

        this.monitor.traceEvent('house_buy', {
            player_source: player.source,
            house_id: apartment.identifier,
            amount: apartment.price,
        });

        if (!hasPlayerAnotherApartment) {
            this.playerService.setPlayerApartment(player.source, apartment, property);
        }

        const taxedPrice = await this.priceService.getPrice(apartment.price, TaxType.HOUSING);
        this.notifier.notify(
            player.source,
            `Vous venez ~g~d'acquérir~s~ une maison pour ~b~$${taxedPrice.toLocaleString('FR-fr')}.${isApartmentExcludeFromHousing(apartment) ? `` : `~s~<br><br>Entrez dans votre logement et consultez les plans d'aménagement de vos meubles à l'aide du Menu ~g~H~s~ !`}`,
            'success',
            30_000
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

        TriggerClientEvent(ClientEvent.HOUSING_TELEPORT, player.source, false, false);
    }

    @OnEvent(ServerEvent.HOUSING_REMOVE_TENANT)
    public async removeTenant(source: number, propertyId: number, apartmentId: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const [property, apartment] = await this.housingRepository.getApartment(propertyId, apartmentId);

        if (!property || !apartment) {
            return;
        }

        if (apartment.owner !== player.citizenid && apartment.tenant !== player.citizenid) {
            this.notifier.error(player.source, 'Vous ne possédez pas cette habitation.');

            return;
        }

        if (apartment.owner === apartment.tenant) {
            this.notifier.error(player.source, 'Vous habitez cette habitation.');

            return;
        }

        if (apartment.tenant === null) {
            this.notifier.error(player.source, "Cette habitation n'a pas de colocataire.");

            return;
        }

        await this.vehicleService.transferToAirport(getPropertyGarageName(property), apartment.tenant);
        this.playerAppearanceService.clearCloakroom(apartment.tenant);

        const tenant = this.playerService.getPlayerByCitizenId(apartment.tenant);
        if (tenant) {
            this.playerService.setPlayerApartment(tenant.source, null, null);

            if (tenant.citizenid === player.citizenid) {
                this.notifier.notify(tenant.source, 'Vous avez quitté votre location.', 'error');
            } else {
                this.notifier.notify(tenant.source, 'Vous avez été retiré de votre location.', 'error');
            }
        }

        if (apartment.owner === player.citizenid) {
            this.notifier.notify(player.source, 'Vous avez retiré votre locataire de votre maison.', 'success');
        }

        await this.housingRepository.setApartmentTenant(null, apartment.id);
        apartment.tenant = null;
        this.housingFournitureProvider.deletePlatesIfNeeded(apartment);
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
            this.notifier.error(player.source, 'Vous ne possédez pas cette habitation.');

            return;
        }

        if (apartment.roommate === null) {
            this.notifier.error(player.source, "Cette habitation n'a pas de colocataire.");

            return;
        }

        await this.vehicleService.transferToAirport(getPropertyGarageName(property), apartment.roommate);
        this.playerAppearanceService.clearCloakroom(apartment.roommate);

        const roommate = this.playerService.getPlayerByCitizenId(apartment.roommate);

        if (roommate) {
            this.playerService.setPlayerApartment(roommate.source, null, null);
            if (roommate.citizenid === player.citizenid) {
                this.notifier.notify(roommate.source, 'Vous avez quitté votre colocation.', 'error');
            } else {
                this.notifier.notify(roommate.source, 'Vous avez été retiré de votre colocation.', 'error');
            }
        }

        if (apartment.owner === player.citizenid) {
            this.notifier.notify(player.source, 'Vous avez retiré votre colocataire de votre maison.', 'success');
        }

        await this.housingRepository.setApartmentRoommate(null, apartment.id);
        apartment.roommate = null;
        this.housingFournitureProvider.deletePlatesIfNeeded(apartment);
    }

    public async clearApartment(property: Property, apartment: Apartment, notify = true) {
        const apartmentInventory = await this.inventoryFactory.get(`house_stash_${apartment.identifier}`);
        const apartmentFridge = await this.inventoryFactory.get(`house_fridge_${apartment.identifier}`);
        const apartmentCloakroom = await this.inventoryFactory.get(`house_cloakroom_${apartment.identifier}`);

        apartmentInventory?.clear();
        apartmentFridge?.clear();
        apartmentCloakroom?.clear();

        apartmentInventory?.updateConfiguration({
            maxWeight: HOUSE_STORAGE_TIER_WEIGHTS[0],
        });
        apartmentFridge?.updateConfiguration({
            maxWeight: HOUSE_FRIDGE_TIER_WEIGHTS[0],
        });
        apartmentCloakroom?.updateConfiguration({
            maxWeight: HOUSE_CLOAKROOM_TIER_WEIGHTS[0],
        });

        await this.bankService.clearAccount(apartment.identifier);

        if (apartment.tenant !== null) {
            this.playerAppearanceService.clearCloakroom(apartment.tenant);
            await this.vehicleService.transferToAirport(getPropertyGarageName(property), apartment.tenant);

            const tenant = this.playerService.getPlayerByCitizenId(apartment.tenant);

            if (tenant) {
                this.playerService.setPlayerApartment(tenant.source, null, null);

                if (notify && apartment.owner !== apartment.tenant) {
                    this.notifier.notify(tenant.source, `Votre propriétaire vient de vendre votre habitation.`, 'info');
                }
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
                        `Votre propriétaire vient de vendre votre habitation.`,
                        'info'
                    );
                }
            }
        }

        await this.vehicleService.transferToAirport(getApartmentGarageName(apartment));
        await this.housingFournitureProvider.clearFourniture(apartment.id);
        await this.clearTemporaryAccess(apartment.id);
        await this.housingRepository.clearApartment(apartment.id);
    }

    private async clearTemporaryAccess(apartmentId: number) {
        for (const [citizenId, temporaryAccess] of this.playerTemporaryAccess) {
            if (temporaryAccess.has(apartmentId)) {
                const target = this.playerService.getPlayerByCitizenId(citizenId);
                if (target) {
                    TriggerClientEvent(ClientEvent.HOUSING_REMOVE_TEMPORARY_ACCESS, target.source, apartmentId);
                }
                temporaryAccess.delete(apartmentId);
            }
        }
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
            this.notifier.error(player.source, 'Vous ne possédez pas cette habitation.');

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

        this.monitor.traceEvent('house_sell', {
            player_source: player.source,
            house_id: apartment.identifier,
            amount: resellPrice,
        });

        this.notifier.notify(
            player.source,
            `Vous venez de ~r~céder~s~ votre maison pour ~b~$${resellPrice.toLocaleString('FR-fr')}.`,
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
    public async upgradeTier(
        source: number,
        apartmentTier: Partial<ApartementTiers>,
        propertyId: number,
        apartmentId: number
    ) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const [property, apartment] = await this.housingRepository.getApartment(propertyId, apartmentId);
        if (!property || !apartment) {
            this.notifier.error(player.source, "Vous ne possédez pas cette d'habitation.");
            return;
        }

        if (isMotel(apartment)) {
            this.notifier.error(player.source, "Vous ne pouvez pas améliorer cette d'habitation.");
            return;
        }

        let zkeaAmount = 0;
        let price = 0;
        for (const [type, upgrade] of Object.entries(apartmentTier)) {
            const currentTier = apartment[type];

            for (let i = currentTier + 1; i <= upgrade; i++) {
                zkeaAmount += HousingTiers[type][i].zkeaPrice;
                price += (apartment.price * HousingTiers[type][i].pricePercent) / 100;
            }
        }

        const inventory = await this.inventoryFactory.getOrCreate('cabinet_storage', InventoryType.CabinetStorage);
        const apartmentInventory = await this.inventoryFactory.getOrCreate(
            `house_stash_${apartment.identifier}`,
            InventoryType.HouseStash
        );
        const apartmentFridge = await this.inventoryFactory.getOrCreate(
            `house_fridge_${apartment.identifier}`,
            InventoryType.HouseFridge
        );
        const apartmentCloakroom = await this.inventoryFactory.getOrCreate(
            `house_cloakroom_${apartment.identifier}`,
            InventoryType.HouseCloakroom
        );

        if (inventory.getItemCount('cabinet_zkea') < zkeaAmount) {
            this.notifier.error(player.source, "Amélioration de palier impossible car Zkea n'a pas assez de stock.");

            return;
        }

        if (!(await this.playerMoneyService.buy(player.source, price, TaxType.HOUSING))) {
            this.notifier.error(player.source, "Vous n'avez pas assez d'argent.");

            return;
        }

        inventory.remove('cabinet_zkea', zkeaAmount);

        if (apartmentTier.tier !== undefined) {
            apartmentInventory?.updateConfiguration({
                maxWeight: HOUSE_STORAGE_TIER_WEIGHTS[apartmentTier.tier] || HOUSE_STORAGE_TIER_WEIGHTS[0],
            });
            apartmentFridge?.updateConfiguration({
                maxWeight: HOUSE_FRIDGE_TIER_WEIGHTS[apartmentTier.tier] || HOUSE_FRIDGE_TIER_WEIGHTS[0],
            });
            apartmentCloakroom?.updateConfiguration({
                maxWeight: HOUSE_CLOAKROOM_TIER_WEIGHTS[apartmentTier.tier] || HOUSE_CLOAKROOM_TIER_WEIGHTS[0],
            });
        }

        this.playerService.setPlayerApartmentTier(player.source, apartmentTier);

        await this.housingRepository.setApartmentTier(apartment.id, apartmentTier);

        const priceWithTaxes = await this.priceService.getPrice(price, TaxType.HOUSING);
        this.notifier.notify(
            player.source,
            `Vous venez ~g~d'améliorer~s~ votre habitation pour ~b~$${priceWithTaxes.toLocaleString('FR-fr')}~s~:<br>- ${Object.keys(
                apartmentTier
            )
                .map(tier => `${TYPE_LABEL[tier]} au palier ~g~${apartmentTier[tier] + 1}~s~`)
                .join('<br>- ')}`,
            'success'
        );

        this.monitor.traceEvent('house_upgrade', {
            player_source: player.source,
            house_id: apartment.identifier,
            message: apartmentTier.toString(),
            amount: priceWithTaxes,
        });

        if (apartment.roommate) {
            const roommate = this.playerService.getPlayerByCitizenId(apartment.roommate);

            if (roommate) {
                this.playerService.setPlayerApartmentTier(roommate.source, apartmentTier);
            }
        }
    }

    @OnEvent(ServerEvent.HOUSING_ADD_PARKING_PLACE)
    public async addParkingPlace(source: number, hasParking: boolean, propertyId: number, apartmentId: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const [property, apartment] = await this.housingRepository.getApartment(propertyId, apartmentId);
        if (!property || !apartment) {
            this.notifier.error(player.source, "Vous ne possédez pas cette d'habitation.");
            return;
        }

        if (!isTrailer(property)) {
            return;
        }

        const price = hasParking ? apartment.price * 0.5 : 0;

        if (!(await this.playerMoneyService.buy(player.source, price, TaxType.HOUSING))) {
            this.notifier.error(player.source, "Vous n'avez pas assez d'argent.");

            return;
        }

        this.playerService.setPlayerApartmentHasParking(player.source, hasParking);

        await this.housingRepository.setApartmentHasParking(apartment.id, hasParking);

        const taxedPrice = await this.priceService.getPrice(price, TaxType.HOUSING);
        this.notifier.notify(
            player.source,
            `Vous venez ~g~d'ajouter~s~ une place de parking à votre caravane pour ~b~$${taxedPrice.toLocaleString('FR-fr')}~s~.`,
            'success'
        );
    }

    public async hasAccessToApartment(player: PlayerData, apartmentIdentifier: string) {
        const apartment = await this.housingRepository.getApartmentByIdentifier(apartmentIdentifier);

        if (!apartment) {
            return false;
        }

        if (apartment.owner === player.citizenid && apartment.tenant === null && apartment.roommate === null) {
            return true;
        }

        if (apartment.tenant === player.citizenid) {
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

        if (hasSearchWarrantAccessInApartment(apartment, player)) {
            return true;
        }

        return false;
    }

    public async hasAccessToApartmentGarageStore(player: PlayerData, apartmentIdentifier: string) {
        const apartment = await this.housingRepository.getApartmentByIdentifier(apartmentIdentifier);

        if (!apartment) {
            return false;
        }

        if (apartment.tenant === player.citizenid) {
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

        if (hasSearchWarrantAccessInApartment(apartment, player)) {
            return true;
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

        if (player.metadata.inside.apartment == false) {
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
        }

        TriggerClientEvent(ClientEvent.HOUSING_TELEPORT, player.source, apartment.id, property.id);
    }
}
