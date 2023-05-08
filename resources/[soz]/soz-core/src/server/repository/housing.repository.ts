import { Inject, Injectable } from '../../core/decorators/injectable';
import { Property } from '../../shared/housing/housing';
import { createZoneFromLegacyData } from '../../shared/polyzone/box.zone';
import { PrismaService } from '../database/prisma.service';
import { Repository } from './repository';

@Injectable()
export class HousingRepository extends Repository<Property[]> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    protected async load(): Promise<Property[]> {
        const properties = await this.prismaService.housing_property.findMany();
        const appartments = await this.prismaService.housing_apartment.findMany();

        const indexedProperties: Record<string, Property> = {};

        properties.forEach(property => {
            indexedProperties[property.id] = {
                id: property.id,
                identifier: property.identifier,
                entryZone: createZoneFromLegacyData(JSON.parse(property.entry_zone)),
                garageZone: createZoneFromLegacyData(JSON.parse(property.garage_zone)),
                exteriorCulling: JSON.parse(property.exterior_culling),
                apartments: [],
            };
        });

        appartments.forEach(apartment => {
            const insideCord = JSON.parse(apartment.inside_coord);

            indexedProperties[apartment.property_id].apartments.push({
                id: apartment.id,
                identifier: apartment.identifier,
                label: apartment.label,
                price: apartment.price,
                owner: apartment.owner,
                roommate: apartment.roommate,
                position: [insideCord.x, insideCord.y, insideCord.z, insideCord.w],
                exitZone: createZoneFromLegacyData(JSON.parse(apartment.exit_zone)),
                fridgeZone: createZoneFromLegacyData(JSON.parse(apartment.fridge_zone)),
                stashZone: createZoneFromLegacyData(JSON.parse(apartment.stash_zone)),
                closetZone: createZoneFromLegacyData(JSON.parse(apartment.closet_zone)),
                moneyZone: createZoneFromLegacyData(JSON.parse(apartment.money_zone)),
                tier: apartment.tier,
                hasParkingPlace: apartment.has_parking_place === 1,
            });
        });

        return Object.values(indexedProperties);
    }
}
