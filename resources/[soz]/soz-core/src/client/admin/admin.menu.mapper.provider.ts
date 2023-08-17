import { Command } from '../../core/decorators/command';
import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { SozRole } from '../../core/permissions';
import { emitRpc } from '../../core/rpc';
import { wait } from '../../core/utils';
import { RGBAColor } from '../../shared/color';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { Property } from '../../shared/housing/housing';
import { Font } from '../../shared/hud';
import { JobType } from '../../shared/job';
import { MenuType } from '../../shared/nui/menu';
import { BoxZone, Zone } from '../../shared/polyzone/box.zone';
import { toVector4Object, Vector3, Vector4 } from '../../shared/polyzone/vector';
import { Err, Ok } from '../../shared/result';
import { RpcServerEvent } from '../../shared/rpc';
import { DrawService } from '../draw.service';
import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';
import { NuiObjectProvider } from '../nui/nui.object.provider';
import { NuiZoneProvider } from '../nui/nui.zone.provider';
import { HousingRepository } from '../resources/housing.repository';

type ZoneDrawn = {
    zone: BoxZone<string>;
    id: string;
    color: RGBAColor;
    type: string;
    name?: string;
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

    @Inject(NuiObjectProvider)
    private nuiObjectProvider: NuiObjectProvider;

    @Inject(DrawService)
    private drawService: DrawService;

    @Inject(Notifier)
    private notifier: Notifier;

    private zonesDrawn: ZoneDrawn[] = [];

    private showInteriorData = false;

    @Tick()
    public async showMenuMapperZones(): Promise<void> {
        for (const zoneDrawn of this.zonesDrawn) {
            zoneDrawn.zone.draw(zoneDrawn.color, 150, zoneDrawn.name);
        }

        if (this.showInteriorData) {
            const ped = PlayerPedId();
            const interiorId = GetInteriorFromEntity(ped);

            if (interiorId !== 0) {
                const roomHash = GetRoomKeyFromEntity(ped);
                const roomId = GetInteriorRoomIndexByHash(interiorId, roomHash);
                const roomTimecycle = GetInteriorRoomTimecycle(interiorId, roomId);
                const portalCount = GetInteriorPortalCount(interiorId);
                const roomCount = GetInteriorRoomCount(interiorId);
                const roomName = GetInteriorRoomName(interiorId, roomId);
                const roomFlag = GetInteriorRoomFlag(interiorId, roomId);
                const style = {
                    color: [66, 182, 245, 255] as RGBAColor,
                    size: 0.4,
                    font: Font.ChaletComprimeCologne,
                };

                this.drawService.drawText('~b~InteriorID: ~w~' + interiorId, [0.25, 0.01], style);
                this.drawService.drawText('~b~RoomID: ~w~' + roomId, [0.25, 0.03], style);
                this.drawService.drawText('~b~RoomCount: ~w~' + roomCount, [0.25, 0.05], style);
                this.drawService.drawText('~b~RoomTimecycle: ~w~' + roomTimecycle, [0.25, 0.07], style);
                this.drawService.drawText('~b~PortalCount: ~w~' + portalCount, [0.25, 0.09], style);
                this.drawService.drawText('~b~RoomFlag: ~w~' + roomFlag, [0.25, 0.11], style);
                this.drawService.drawText('~b~RoomName: ~w~' + roomName, [0.25, 0.13], style);
            }
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
        const [isAllowed] = await emitRpc<[boolean, string]>(RpcServerEvent.ADMIN_IS_ALLOWED);
        if (!isAllowed) {
            return;
        }

        if (this.nuiMenu.getOpened() === MenuType.AdminMapperMenu) {
            this.nuiMenu.closeMenu();

            return;
        }

        this.nuiMenu.openMenu(MenuType.AdminMapperMenu, {
            properties: this.housingRepository.get(),
            showInterior: this.showInteriorData,
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
                type,
                name: `${type} - ${property.identifier}`,
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
                type,
                name: `${type} - ${apartment.identifier}`,
            });
        }
    }

    @OnNuiEvent(NuiEvent.AdminMenuMapperTeleportToZone)
    public async teleport({ zone }: { zone: Zone }): Promise<void> {
        if (!zone) {
            this.notifier.error("La zone n'existe pas.");

            return;
        }

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
        const id = `apartment-${propertyId}-${type}`;

        if (this.zonesDrawn.some(zoneDrawn => zoneDrawn.id === id)) {
            this.zonesDrawn = this.zonesDrawn.filter(zoneDrawn => zoneDrawn.id !== id);

            this.zonesDrawn.push({
                zone: BoxZone.fromZone(newZone),
                id,
                color: COLOR_BY_TYPE[type],
                type,
                name: property.identifier,
            });
        }

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
        const id = `apartment-${propertyId}-${apartmentId}-${type}`;

        if (this.zonesDrawn.some(zoneDrawn => zoneDrawn.id === id)) {
            this.zonesDrawn = this.zonesDrawn.filter(zoneDrawn => zoneDrawn.id !== id);

            this.zonesDrawn.push({
                zone: BoxZone.fromZone(newZone),
                id,
                color: COLOR_BY_TYPE[type],
                type,
            });
        }

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

        await wait(50);

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
    public async showAllProperty({ show }: { show: boolean }): Promise<void> {
        this.zonesDrawn = this.zonesDrawn.filter(zoneDrawn => zoneDrawn.type !== 'entry');

        if (!show) {
            return;
        }

        const properties = this.housingRepository.get();

        for (const property of properties) {
            const zoneField = `entryZone`;
            const id = `apartment-${property.id}-entry`;

            this.zonesDrawn.push({
                zone: BoxZone.fromZone(property[zoneField]),
                id,
                color: COLOR_BY_TYPE.entry,
                type: 'entry',
                name: property.identifier,
            });
        }
    }

    @OnNuiEvent(NuiEvent.AdminMenuMapperTeleportToInsideCoords)
    public async teleportToInsideCoords({ coords }: { coords: Vector4 | null }): Promise<void> {
        if (null === coords) {
            this.notifier.error("La zone d'apparition n'est pas définie");

            return;
        }

        SetPedCoordsKeepVehicle(PlayerPedId(), coords[0], coords[1], coords[2]);
        SetEntityHeading(PlayerPedId(), coords[3]);
    }

    @OnNuiEvent(NuiEvent.AdminMenuMapperSetInsideCoords)
    public async setInsideCoords({ apartmentId }: { apartmentId: number }): Promise<void> {
        const coords = GetEntityCoords(PlayerPedId(), false) as Vector3;
        const heading = GetEntityHeading(PlayerPedId());
        const zone = new BoxZone([...coords, heading], 1, 1).toZone();

        return await emitRpc(RpcServerEvent.ADMIN_MAPPER_UPDATE_APARTMENT_ZONE, apartmentId, zone, 'inside');
    }

    @OnNuiEvent(NuiEvent.AdminMenuMapperSetShowInterior)
    public async setShowInterior({ value }: { value: boolean }): Promise<void> {
        this.showInteriorData = value;
    }

    @OnNuiEvent(NuiEvent.AdminMenuMapperAddObject)
    public async addObject({
        object,
        job,
        event,
    }: {
        object: string;
        job: JobType;
        event: string | null;
    }): Promise<void> {
        const model = GetHashKey(object);
        const createdObject = await this.nuiObjectProvider.askObject(model);

        if (null === createdObject) {
            return;
        }

        const vector4Position = toVector4Object(createdObject.position);

        if (object === 'soz_prop_elec01') {
            TriggerServerEvent('soz-upw:server:AddFacility', object, vector4Position, 'default', job);
        } else if (object === 'soz_prop_elec02') {
            TriggerServerEvent('soz-upw:server:AddFacility', object, vector4Position, 'entreprise', job);
        } else if (object === 'upwpile') {
            TriggerServerEvent('soz-upw:server:AddFacility', object, vector4Position, null, job);
        } else {
            TriggerServerEvent(ServerEvent.ADMIN_ADD_PERSISTENT_PROP, createdObject.model, event, vector4Position);
        }
    }
}
