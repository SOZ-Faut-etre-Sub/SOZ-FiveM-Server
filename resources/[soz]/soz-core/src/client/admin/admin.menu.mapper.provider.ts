import { Command } from '../../core/decorators/command';
import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { SozRole } from '../../core/permissions';
import { NuiEvent } from '../../shared/event';
import { MenuType } from '../../shared/nui/menu';
import { Zone } from '../../shared/polyzone/box.zone';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';
import { HousingRepository } from '../resources/housing.repository';

@Provider()
export class AdminMenuMapperProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(HousingRepository)
    private housingRepository: HousingRepository;

    @Command('admin_mapper_menu', {
        role: ['admin', 'staff', 'gamemaster', 'helper'] as SozRole[],
        keys: [
            {
                mapper: 'keyboard',
                key: 'F11',
            },
        ],
    })
    public async toggleMapperMenu(): Promise<void> {
        if (this.nuiMenu.getOpened() === MenuType.AdminMapperMenu) {
            this.nuiMenu.closeMenu();

            return;
        }

        this.nuiMenu.openMenu(MenuType.AdminMapperMenu, {
            properties: this.housingRepository.get(),
        });
    }

    @OnNuiEvent(NuiEvent.AdminMenuMapperShowPropertyZone)
    public async showPropertyZone({
        propertyId,
        propertyZoneType,
    }: {
        propertyId: string;
        propertyZoneType: 'entry' | 'garage';
    }): Promise<void> {}

    @OnNuiEvent(NuiEvent.AdminMenuMapperShowApartmentZone)
    public async showApartmentZone({
        propertyId,
        apartmentId,
        apartmentZoneType,
    }: {
        propertyId: string;
        apartmentId: string;
        apartmentZoneType: 'entry' | 'exit' | 'fridge' | 'stash' | 'closet' | 'money';
    }): Promise<void> {}

    @OnNuiEvent(NuiEvent.AdminMenuMapperTeleportToZone)
    public async teleport({ zone }: { zone: Zone }): Promise<void> {
        SetPedCoordsKeepVehicle(PlayerPedId(), zone.center[0], zone.center[1], zone.center[2]);
    }

    @OnNuiEvent(NuiEvent.AdminMenuMapperUpdatePropertyZone)
    public async updatePropertyZone({
        propertyId,
        propertyZoneType,
        zone,
    }: {
        propertyId: string;
        propertyZoneType: 'entry' | 'garage';
        zone: Zone;
    }): Promise<void> {}

    @OnNuiEvent(NuiEvent.AdminMenuMapperUpdateApartmentZone)
    public async updateApartmentZone({
        propertyId,
        apartmentId,
        apartmentZoneType,
        zone,
    }: {
        propertyId: string;
        apartmentId: string;
        apartmentZoneType: 'entry' | 'exit' | 'fridge' | 'stash' | 'closet' | 'money';
        zone: Zone;
    }): Promise<void> {}

    @OnNuiEvent(NuiEvent.AdminMenuMapperAddApartment)
    public async addApartment({ propertyId }: { propertyId: string }): Promise<void> {}

    @OnNuiEvent(NuiEvent.AdminMenuMapperAddProperty)
    public async addProperty(): Promise<void> {}

    @OnNuiEvent(NuiEvent.AdminMenuMapperSetApartmentName)
    public async setApartmentName({
        propertyId,
        apartmentId,
    }: {
        propertyId: string;
        apartmentId: string;
    }): Promise<void> {}

    @OnNuiEvent(NuiEvent.AdminMenuMapperSetApartmentPrice)
    public async setApartmentPrice({
        propertyId,
        apartmentId,
    }: {
        propertyId: string;
        apartmentId: string;
    }): Promise<void> {}

    @OnNuiEvent(NuiEvent.AdminMenuMapperSetApartmentIdentifier)
    public async setApartmentIdentifier({
        propertyId,
        apartmentId,
    }: {
        propertyId: string;
        apartmentId: string;
    }): Promise<void> {}

    @OnNuiEvent(NuiEvent.AdminMenuMapperDeleteApartment)
    public async deleteApartment({
        propertyId,
        apartmentId,
    }: {
        propertyId: string;
        apartmentId: string;
    }): Promise<void> {}

    @OnNuiEvent(NuiEvent.AdminMenuMapperDeleteProperty)
    public async deleteProperty({ propertyId }: { propertyId: string }): Promise<void> {}

    @OnNuiEvent(NuiEvent.AdminMenuMapperShowAllProperty)
    public async showAllProperty(): Promise<void> {}
}
