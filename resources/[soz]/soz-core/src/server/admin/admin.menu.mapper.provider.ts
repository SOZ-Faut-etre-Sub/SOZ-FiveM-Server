import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { Property } from '../../shared/housing/housing';
import { Zone, ZoneTyped } from '../../shared/polyzone/box.zone';
import { RpcServerEvent } from '../../shared/rpc';
import { HousingProvider } from '../housing/housing.provider';
import { InventoryManager } from '../inventory/inventory.manager';
import { PlayerService } from '../player/player.service';
import { HousingRepository } from '../repository/housing.repository';
import { SenateRepository } from '../repository/senate.repository';
import { ZoneRepository } from '../repository/zone.repository';

@Provider()
export class AdminMenuMapperProvider {
    @Inject(HousingRepository)
    private housingRepository: HousingRepository;

    @Inject(ZoneRepository)
    private zoneRepository: ZoneRepository;

    @Inject(SenateRepository)
    private senateRepository: SenateRepository;

    @Inject(HousingProvider)
    private housingProvider: HousingProvider;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Rpc(RpcServerEvent.ADMIN_MAPPER_SET_APARTMENT_PRICE)
    public async setApartmentPrice(source: number, apartmentId: number, price: number): Promise<Property[]> {
        await this.housingRepository.setApartmentPrice(apartmentId, price);

        return await this.housingRepository.get();
    }

    @Rpc(RpcServerEvent.ADMIN_MAPPER_SET_APARTMENT_NAME)
    public async setApartmentName(source: number, apartmentId: number, name: string): Promise<Property[]> {
        await this.housingRepository.setApartmentName(apartmentId, name);

        return await this.housingRepository.get();
    }

    @Rpc(RpcServerEvent.ADMIN_MAPPER_SET_APARTMENT_IDENTIFIER)
    public async setApartmentIdentifier(source: number, apartmentId: number, identifier: string): Promise<Property[]> {
        await this.housingRepository.setApartmentIdentifier(apartmentId, identifier);

        return await this.housingRepository.get();
    }

    @Rpc(RpcServerEvent.ADMIN_MAPPER_UPDATE_APARTMENT_ZONE)
    public async updateApartmentZone(
        source: number,
        apartmentId: number,
        zone: Zone,
        type: 'inside' | 'exit' | 'fridge' | 'stash' | 'closet' | 'money'
    ): Promise<Property[]> {
        await this.housingRepository.updateApartmentZone(apartmentId, zone, type);

        return await this.housingRepository.get();
    }

    @Rpc(RpcServerEvent.ADMIN_MAPPER_UPDATE_PROPERTY_ZONE)
    public async updatePropertyZone(
        source: number,
        propertyId: number,
        zone: Zone,
        type: 'entry' | 'garage'
    ): Promise<Property[]> {
        await this.housingRepository.updatePropertyZone(propertyId, zone, type);

        return await this.housingRepository.get();
    }

    @Rpc(RpcServerEvent.ADMIN_MAPPER_ADD_PROPERTY)
    public async addProperty(source: number, name: string): Promise<Property[]> {
        await this.housingRepository.addProperty(name);

        return await this.housingRepository.get();
    }

    @Rpc(RpcServerEvent.ADMIN_MAPPER_REMOVE_PROPERTY)
    public async removeProperty(source: number, id: number): Promise<Property[]> {
        await this.housingRepository.removeProperty(id);

        return await this.housingRepository.get();
    }

    @Rpc(RpcServerEvent.ADMIN_MAPPER_ADD_APARTMENT)
    public async addApartment(
        source: number,
        propertyId: number,
        identifier: string,
        label: string
    ): Promise<Property[]> {
        await this.housingRepository.addApartment(propertyId, identifier, label);

        return await this.housingRepository.get();
    }

    @Rpc(RpcServerEvent.ADMIN_MAPPER_REMOVE_APARTMENT)
    public async removeApartment(source: number, id: number): Promise<Property[]> {
        await this.housingRepository.removeApartment(id);

        return this.housingRepository.get();
    }

    @Rpc(RpcServerEvent.ADMIN_MAPPER_ADD_PROPERTY_CULLING)
    public async addPropertyCulling(source: number, id: number, culling: number): Promise<Property[]> {
        await this.housingRepository.addPropertyExteriorCulling(id, culling);

        return this.housingRepository.get();
    }

    @Rpc(RpcServerEvent.ADMIN_MAPPER_REMOVE_PROPERTY_CULLING)
    public async removePropertyCulling(source: number, id: number, culling: number): Promise<Property[]> {
        await this.housingRepository.removePropertyExteriorCulling(id, culling);

        return this.housingRepository.get();
    }

    @Rpc(RpcServerEvent.ADMIN_MAPPER_ADD_ZONE)
    public async addZone(source: number, zone: Zone): Promise<ZoneTyped[]> {
        await this.zoneRepository.addZone(zone);

        return this.zoneRepository.get();
    }

    @Rpc(RpcServerEvent.ADMIN_MAPPER_REMOVE_ZONE)
    public async removeZone(source: number, id: number): Promise<ZoneTyped[]> {
        await this.zoneRepository.removeZone(id);

        return this.zoneRepository.get();
    }

    @Rpc(RpcServerEvent.ADMIN_MAPPER_SET_SENATE_PARTY)
    public async setSenateParty(
        source: number,
        propertyId: number,
        apartmentId: number,
        senatePartyId: string | null
    ): Promise<Property[]> {
        const [property, apartment] = await this.housingRepository.getApartment(propertyId, apartmentId);

        if (!property || !apartment) {
            return this.housingRepository.get();
        }

        if (!senatePartyId) {
            await this.housingRepository.setSenateParty(apartmentId, null);
            await this.housingProvider.clearApartment(property, apartment, false);

            return this.housingRepository.get();
        }

        const senateParty = await this.senateRepository.find(senatePartyId);

        if (!senateParty) {
            return this.housingRepository.get();
        }

        await this.housingRepository.setSenateParty(apartmentId, senatePartyId);

        return this.housingRepository.get();
    }

    @Rpc(RpcServerEvent.ADMIN_MAPPER_SET_OWNER)
    public async setOwner(
        source: number,
        propertyId: number,
        apartmentId: number,
        citizenId: string
    ): Promise<Property[]> {
        const [property, apartment] = await this.housingRepository.getApartment(propertyId, apartmentId);

        if (!property || !apartment) {
            return this.housingRepository.get();
        }

        await this.housingRepository.setApartmentOwner(citizenId, apartmentId);

        const connectedPlayer = this.playerService.getPlayerByCitizenId(citizenId);

        if (connectedPlayer) {
            this.playerService.setPlayerApartment(connectedPlayer.source, apartment, property);
        }

        return this.housingRepository.get();
    }

    @Rpc(RpcServerEvent.ADMIN_MAPPER_CLEAR_OWNER)
    public async clearOwner(source: number, propertyId: number, apartmentId: number): Promise<Property[]> {
        const [property, apartment] = await this.housingRepository.getApartment(propertyId, apartmentId);

        if (!property || !apartment) {
            return this.housingRepository.get();
        }

        await this.housingProvider.clearApartment(property, apartment, false);

        return this.housingRepository.get();
    }

    @Rpc(RpcServerEvent.ADMIN_MAPPER_SET_APARTMENT_TIER)
    public async setTier(source: number, propertyId: number, apartmentId: number, tier: number): Promise<Property[]> {
        const [property, apartment] = await this.housingRepository.getApartment(propertyId, apartmentId);

        if (!property || !apartment) {
            return this.housingRepository.get();
        }

        this.inventoryManager.setHouseStashMaxWeightFromTier(apartment.identifier, tier);
        await this.housingRepository.setApartmentTier(apartment.id, tier);

        return this.housingRepository.get();
    }
}
