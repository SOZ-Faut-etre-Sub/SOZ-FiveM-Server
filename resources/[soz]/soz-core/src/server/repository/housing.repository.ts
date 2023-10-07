import { housing_apartment, housing_property } from '@prisma/client';

import { Inject, Injectable } from '../../core/decorators/injectable';
import { Apartment, Property } from '../../shared/housing/housing';
import { createZoneFromLegacyData, Zone, zoneToLegacyData } from '../../shared/polyzone/box.zone';
import { RepositoryType } from '../../shared/repository';
import { PrismaService } from '../database/prisma.service';
import { Repository } from './repository';

@Injectable(HousingRepository, Repository)
export class HousingRepository extends Repository<RepositoryType.Housing> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    public type = RepositoryType.Housing;

    private serializeProperty(property: housing_property): Property {
        return {
            id: property.id,
            identifier: property.identifier,
            entryZone: createZoneFromLegacyData(JSON.parse(property.entry_zone)),
            garageZone: createZoneFromLegacyData(JSON.parse(property.garage_zone)),
            exteriorCulling: JSON.parse(property.exterior_culling),
            apartments: [],
        };
    }

    private serializeApartment(apartment: housing_apartment): Apartment {
        const insideCord = JSON.parse(apartment.inside_coord);

        return {
            id: apartment.id,
            identifier: apartment.identifier,
            label: apartment.label,
            price: apartment.price,
            owner: apartment.owner,
            roommate: apartment.roommate,
            position: insideCord ? [insideCord.x, insideCord.y, insideCord.z, insideCord.w] : null,
            exitZone: createZoneFromLegacyData(JSON.parse(apartment.exit_zone)),
            fridgeZone: createZoneFromLegacyData(JSON.parse(apartment.fridge_zone)),
            stashZone: createZoneFromLegacyData(JSON.parse(apartment.stash_zone)),
            closetZone: createZoneFromLegacyData(JSON.parse(apartment.closet_zone)),
            moneyZone: createZoneFromLegacyData(JSON.parse(apartment.money_zone)),
            tier: apartment.tier,
            hasParkingPlace: apartment.has_parking_place === 1,
        };
    }

    public async addPropertyExteriorCulling(propertyId: number, culling: number): Promise<void> {
        const property = await this.find(propertyId);

        if (!property) {
            return;
        }

        await this.prismaService.housing_property.update({
            where: {
                id: propertyId,
            },
            data: {
                exterior_culling: JSON.stringify([...property.exteriorCulling, culling]),
            },
        });

        this.data[propertyId].exteriorCulling.push(culling);
        this.sync(propertyId);
    }

    public async removePropertyExteriorCulling(propertyId: number, culling: number): Promise<void> {
        const property = await this.find(propertyId);

        if (!property) {
            return;
        }

        const exteriorCulling = property.exteriorCulling.filter(c => c !== culling);

        await this.prismaService.housing_property.update({
            where: {
                id: propertyId,
            },
            data: {
                exterior_culling: JSON.stringify(exteriorCulling),
            },
        });

        this.data[propertyId].exteriorCulling = exteriorCulling;
        this.sync(propertyId);
    }

    protected async load(): Promise<Record<string, Property>> {
        const properties = await this.prismaService.housing_property.findMany();
        const appartments = await this.prismaService.housing_apartment.findMany();

        const indexedProperties: Record<string, Property> = {};

        properties.forEach(property => {
            indexedProperties[property.id] = this.serializeProperty(property);
        });

        appartments.forEach(apartment => {
            indexedProperties[apartment.property_id].apartments.push(this.serializeApartment(apartment));
        });

        return indexedProperties;
    }

    public async addApartment(propertyId: number, identifier: string, label: string): Promise<void> {
        const apartment = await this.prismaService.housing_apartment.create({
            data: {
                property_id: propertyId,
                identifier,
                label,
            },
        });

        this.data[propertyId].apartments.push(this.serializeApartment(apartment));
        this.sync(propertyId);
    }

    public async setApartmentPrice(apartmentId: number, price: number): Promise<void> {
        const apartment = await this.prismaService.housing_apartment.update({
            where: {
                id: apartmentId,
            },
            data: {
                price,
            },
        });

        this.data[apartment.property_id].apartments.find(apartment => apartment.id === apartmentId).price =
            apartment.price;

        this.sync(apartment.property_id);
    }

    public async setApartmentName(apartmentId: number, name: string): Promise<void> {
        const apartment = await this.prismaService.housing_apartment.update({
            where: {
                id: apartmentId,
            },
            data: {
                label: name,
            },
        });

        this.data[apartment.property_id].apartments.find(apartment => apartment.id === apartmentId).label =
            apartment.label;

        this.sync(apartment.property_id);
    }

    public async setApartmentIdentifier(apartmentId: number, identifier: string): Promise<void> {
        const apartment = await this.prismaService.housing_apartment.update({
            where: {
                id: apartmentId,
            },
            data: {
                identifier,
            },
        });

        this.data[apartment.property_id].apartments.find(apartment => apartment.id === apartmentId).identifier =
            apartment.identifier;

        this.sync(apartment.property_id);
    }

    public async updateApartmentZone(
        apartmentId: number,
        zone: Zone,
        type: 'inside' | 'exit' | 'fridge' | 'stash' | 'closet' | 'money'
    ): Promise<void> {
        if (type === 'inside') {
            const apartment = await this.prismaService.housing_apartment.update({
                where: {
                    id: apartmentId,
                },
                data: {
                    inside_coord: JSON.stringify({
                        x: zone.center[0],
                        y: zone.center[1],
                        z: zone.center[2],
                        w: zone.heading,
                    }),
                },
            });

            this.data[apartment.property_id].apartments.find(apartment => apartment.id === apartmentId).position = [
                zone.center[0],
                zone.center[1],
                zone.center[2],
                zone.heading,
            ];
            this.sync(apartment.property_id);
        } else {
            const zoneData = JSON.stringify(zoneToLegacyData(zone));
            const apartment = await this.prismaService.housing_apartment.update({
                where: {
                    id: apartmentId,
                },
                data: {
                    [`${type}_zone`]: zoneData,
                },
            });

            this.data[apartment.property_id].apartments.find(apartment => apartment.id === apartmentId)[`${type}Zone`] =
                zone;
            this.sync(apartment.property_id);
        }
    }

    public async removeApartment(apartmentId: number): Promise<void> {
        const apartment = await this.prismaService.housing_apartment.delete({
            where: {
                id: apartmentId,
            },
        });

        this.data[apartment.property_id].apartments = this.data[apartment.property_id].apartments.filter(
            apartment => apartment.id !== apartmentId
        );
        this.sync(apartment.property_id);
    }

    public async addProperty(name: string): Promise<void> {
        const property = await this.prismaService.housing_property.create({
            data: {
                identifier: name,
            },
        });

        this.data[property.id] = this.serializeProperty(property);
        this.sync(property.id);
    }

    public async updatePropertyZone(propertyId: number, zone: Zone, type: 'entry' | 'garage') {
        const zoneData = JSON.stringify(zoneToLegacyData(zone));

        await this.prismaService.housing_property.update({
            where: {
                id: propertyId,
            },
            data: {
                [`${type}_zone`]: zoneData,
            },
        });

        this.data[propertyId][`${type}Zone`] = zone;
        this.sync(propertyId);
    }

    public async removeProperty(propertyId: number): Promise<void> {
        await this.prismaService.housing_property.delete({
            where: {
                id: propertyId,
            },
        });

        await this.delete(propertyId);
    }
}
