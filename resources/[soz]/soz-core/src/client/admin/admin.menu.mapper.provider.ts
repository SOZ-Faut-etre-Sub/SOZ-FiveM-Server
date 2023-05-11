import { Command } from '../../core/decorators/command';
import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { SozRole } from '../../core/permissions';
import { emitRpc } from '../../core/rpc';
import { RGBAColor } from '../../shared/color';
import { NuiEvent } from '../../shared/event';
import { Property } from '../../shared/housing/housing';
import { MenuType } from '../../shared/nui/menu';
import { BoxZone, Zone } from '../../shared/polyzone/box.zone';
import { Err, Ok } from '../../shared/result';
import { RpcServerEvent } from '../../shared/rpc';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';
import { NuiZoneProvider } from '../nui/nui.zone.provider';
import { HousingRepository } from '../resources/housing.repository';

type ZoneDrawn = {
    zone: BoxZone<string>;
    id: string;
    color: RGBAColor;
};

const COLOR_BY_TYPE: Record<string, RGBAColor> = {
    entry: [0, 255, 0, 100],
    garage: [255, 0, 0, 100],
    exit: [0, 0, 255, 100],
    fridge: [255, 255, 0, 100],
    stash: [0, 255, 255, 100],
    closet: [255, 0, 255, 100],
    money: [255, 0, 255, 100],
};

@Provider()
export class AdminMenuMapperProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(HousingRepository)
    private housingRepository: HousingRepository;

    @Inject(NuiZoneProvider)
    private nuiZoneProvider: NuiZoneProvider;

    private zonesDrawn: ZoneDrawn[] = [];

    @Tick()
    public async showMenuMapperZones(): Promise<void> {
        for (const zoneDrawn of this.zonesDrawn) {
            zoneDrawn.zone.draw(zoneDrawn.color);
        }
    }

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
        type,
        show,
    }: {
        propertyId: number;
        type: 'entry' | 'garage';
        show: boolean;
    }): Promise<void> {
        const zoneField = `${type}Zone`;
        const id = `apartment-${propertyId}-${type}`;

        // Remove existing zone if any
        this.zonesDrawn = this.zonesDrawn.filter(zoneDrawn => zoneDrawn.id !== id);

        if (show) {
            const property = this.housingRepository.findProperty(propertyId);

            if (!property) {
                return;
            }

            this.zonesDrawn.push({
                zone: BoxZone.fromZone(property[zoneField]),
                id,
                color: COLOR_BY_TYPE[type],
            });
        }
    }

    @OnNuiEvent(NuiEvent.AdminMenuMapperShowApartmentZone)
    public async showApartmentZone({
        propertyId,
        apartmentId,
        type,
        show,
    }: {
        propertyId: number;
        apartmentId: number;
        type: 'exit' | 'fridge' | 'stash' | 'closet' | 'money';
        show: boolean;
    }): Promise<void> {
        const zoneField = `${type}Zone`;
        const id = `apartment-${propertyId}-${apartmentId}-${type}`;

        // Remove existing zone if any
        this.zonesDrawn = this.zonesDrawn.filter(zoneDrawn => zoneDrawn.id !== id);

        if (show) {
            const apartment = this.housingRepository.findApartment(propertyId, apartmentId);

            if (!apartment) {
                return;
            }

            this.zonesDrawn.push({
                zone: BoxZone.fromZone(apartment[zoneField]),
                id,
                color: COLOR_BY_TYPE[type],
            });
        }
    }

    @OnNuiEvent(NuiEvent.AdminMenuMapperTeleportToZone)
    public async teleport({ zone }: { zone: Zone }): Promise<void> {
        SetPedCoordsKeepVehicle(PlayerPedId(), zone.center[0], zone.center[1], zone.center[2]);
    }

    @OnNuiEvent(NuiEvent.AdminMenuMapperUpdatePropertyZone)
    public async updatePropertyZone({
        propertyId,
        type,
    }: {
        propertyId: number;
        type: 'entry' | 'garage';
        zone: Zone;
    }): Promise<Property[]> {
        const property = this.housingRepository.findProperty(propertyId);
        const zoneField = `${type}Zone`;

        if (!property) {
            return;
        }

        const existingZone = property[zoneField] || null;
        const newZone = await this.nuiZoneProvider.askZone(existingZone);

        return emitRpc<Property[]>(RpcServerEvent.ADMIN_MAPPER_UPDATE_PROPERTY_ZONE, propertyId, newZone, type);
    }

    @OnNuiEvent(NuiEvent.AdminMenuMapperUpdateApartmentZone)
    public async updateApartmentZone({
        propertyId,
        apartmentId,
        type,
    }: {
        propertyId: number;
        apartmentId: number;
        type: 'entry' | 'exit' | 'fridge' | 'stash' | 'closet' | 'money';
    }): Promise<Property[]> {
        const apartment = this.housingRepository.findApartment(propertyId, apartmentId);
        const zoneField = `${type}Zone`;

        if (!apartment) {
            return this.housingRepository.get();
        }

        const existingZone = apartment[zoneField] || null;
        const newZone = await this.nuiZoneProvider.askZone(existingZone);

        return emitRpc<Property[]>(RpcServerEvent.ADMIN_MAPPER_UPDATE_APARTMENT_ZONE, apartmentId, newZone, type);
    }

    @OnNuiEvent(NuiEvent.AdminMenuMapperAddApartment)
    public async addApartment({ propertyId }: { propertyId: number }): Promise<Property[]> {
        const apartmentIdentifier = await this.inputService.askInput(
            {
                title: "Identifiant de l'interieur",
                defaultValue: '',
            },
            value => {
                if (!value) {
                    return Err('Le nom ne peut pas être vide');
                }

                return Ok(value);
            }
        );

        if (!apartmentIdentifier) {
            return this.housingRepository.get();
        }

        const apartmentName = await this.inputService.askInput(
            {
                title: "Nom de l'intérieur",
                defaultValue: '',
            },
            value => {
                if (!value) {
                    return Err('Le nom ne peut pas être vide');
                }

                return Ok(value);
            }
        );

        if (!apartmentName) {
            return this.housingRepository.get();
        }

        return await emitRpc<Property[]>(
            RpcServerEvent.ADMIN_MAPPER_ADD_APARTMENT,
            propertyId,
            apartmentIdentifier,
            apartmentName
        );
    }

    @OnNuiEvent(NuiEvent.AdminMenuMapperAddProperty)
    public async addProperty(): Promise<Property[]> {
        const propertyName = await this.inputService.askInput(
            {
                title: 'Identifiant de la propriété',
                defaultValue: '',
            },
            value => {
                if (!value) {
                    return Err('Le nom ne peut pas être vide');
                }

                return Ok(value);
            }
        );

        if (!propertyName) {
            return this.housingRepository.get();
        }

        return await emitRpc<Property[]>(RpcServerEvent.ADMIN_MAPPER_ADD_PROPERTY, propertyName);
    }

    @OnNuiEvent(NuiEvent.AdminMenuMapperSetApartmentName)
    public async setApartmentName({ apartmentId }: { apartmentId: number }): Promise<Property[]> {
        const apartmentName = await this.inputService.askInput(
            {
                title: "Nom de l'interieur",
                defaultValue: '',
            },
            value => {
                if (!value) {
                    return Err('Le nom ne peut pas être vide');
                }

                return Ok(value);
            }
        );

        if (!apartmentName) {
            return this.housingRepository.get();
        }

        return await emitRpc<Property[]>(RpcServerEvent.ADMIN_MAPPER_SET_APARTMENT_NAME, apartmentId, apartmentName);
    }

    @OnNuiEvent(NuiEvent.AdminMenuMapperSetApartmentPrice)
    public async setApartmentPrice({
        apartmentId,
        price,
    }: {
        apartmentId: number;
        price: number | null;
    }): Promise<Property[]> {
        if (price === null) {
            const apartmentPrice = await this.inputService.askInput(
                {
                    title: "Prix de l'intérieur",
                    defaultValue: '',
                },
                value => {
                    if (!value) {
                        return Err('Le nom ne peut pas être vide');
                    }

                    if (isNaN(Number(value))) {
                        return Err('Le prix doit être un nombre');
                    }

                    return Ok(value);
                }
            );

            if (!apartmentPrice) {
                return this.housingRepository.get();
            }

            price = Number(apartmentPrice);
        }

        return await emitRpc<Property[]>(RpcServerEvent.ADMIN_MAPPER_SET_APARTMENT_PRICE, apartmentId, price);
    }

    @OnNuiEvent(NuiEvent.AdminMenuMapperSetApartmentIdentifier)
    public async setApartmentIdentifier({ apartmentId }: { apartmentId: number }): Promise<Property[]> {
        const apartmentIdentifier = await this.inputService.askInput(
            {
                title: "Identifiant de l'interieur",
                defaultValue: '',
            },
            value => {
                if (!value) {
                    return Err('Le nom ne peut pas être vide');
                }

                return Ok(value);
            }
        );

        if (!apartmentIdentifier) {
            return this.housingRepository.get();
        }

        return await emitRpc<Property[]>(
            RpcServerEvent.ADMIN_MAPPER_SET_APARTMENT_IDENTIFIER,
            apartmentId,
            apartmentIdentifier
        );
    }

    @OnNuiEvent(NuiEvent.AdminMenuMapperDeleteApartment)
    public async deleteApartment({ apartmentId }: { apartmentId: number }): Promise<Property[]> {
        const confirmed = await this.inputService.askConfirm('Êtes-vous sûr de vouloir supprimer cet appartement ?');

        if (!confirmed) {
            return this.housingRepository.get();
        }

        return await emitRpc<Property[]>(RpcServerEvent.ADMIN_MAPPER_REMOVE_APARTMENT, apartmentId);
    }

    @OnNuiEvent(NuiEvent.AdminMenuMapperDeleteProperty)
    public async deleteProperty({ propertyId }: { propertyId: number }): Promise<Property[]> {
        const confirmed = await this.inputService.askConfirm('Êtes-vous sûr de vouloir supprimer ce batiment ?');

        if (!confirmed) {
            return this.housingRepository.get();
        }

        return await emitRpc<Property[]>(RpcServerEvent.ADMIN_MAPPER_REMOVE_PROPERTY, propertyId);
    }

    @OnNuiEvent(NuiEvent.AdminMenuMapperShowAllProperty)
    public async showAllProperty(): Promise<void> {}
}
