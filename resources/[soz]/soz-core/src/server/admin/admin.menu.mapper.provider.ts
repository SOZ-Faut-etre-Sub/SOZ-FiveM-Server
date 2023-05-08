import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { Property } from '../../shared/housing/housing';
import { Zone, zoneToLegacyData } from '../../shared/polyzone/box.zone';
import { RpcServerEvent } from '../../shared/rpc';
import { PrismaService } from '../database/prisma.service';
import { RepositoryProvider } from '../repository/repository.provider';

@Provider()
export class AdminMenuMapperProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(RepositoryProvider)
    private repositoryProvider: RepositoryProvider;

    @Rpc(RpcServerEvent.ADMIN_MAPPER_SET_APARTMENT_PRICE)
    public async setApartmentPrice(apartmentId: number, price: number): Promise<Property[]> {
        await this.prismaService.housing_apartment.update({
            where: {
                id: apartmentId,
            },
            data: {
                price,
            },
        });

        return await this.repositoryProvider.refresh('housing');
    }

    @Rpc(RpcServerEvent.ADMIN_MAPPER_SET_APARTMENT_NAME)
    public async setApartmentName(apartmentId: number, name: string): Promise<Property[]> {
        await this.prismaService.housing_apartment.update({
            where: {
                id: apartmentId,
            },
            data: {
                label: name,
            },
        });

        return await this.repositoryProvider.refresh('housing');
    }

    @Rpc(RpcServerEvent.ADMIN_MAPPER_SET_APARTMENT_IDENTIFIER)
    public async setApartmentIdentifier(apartmentId: number, identifier: string): Promise<Property[]> {
        await this.prismaService.housing_apartment.update({
            where: {
                id: apartmentId,
            },
            data: {
                identifier,
            },
        });

        return await this.repositoryProvider.refresh('housing');
    }

    @Rpc(RpcServerEvent.ADMIN_MAPPER_UPDATE_APARTMENT_ZONE)
    public async updateApartmentZone(
        apartmentId: number,
        zone: Zone,
        type: 'inside' | 'exit' | 'fridge' | 'stash' | 'closet' | 'money'
    ): Promise<Property[]> {
        if (type === 'inside') {
            await this.prismaService.housing_apartment.update({
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
        } else {
            const zoneData = JSON.stringify(zoneToLegacyData(zone));

            await this.prismaService.housing_apartment.update({
                where: {
                    id: apartmentId,
                },
                data: {
                    [`${type}_zone`]: zoneData,
                },
            });
        }

        return await this.repositoryProvider.refresh('housing');
    }

    @Rpc(RpcServerEvent.ADMIN_MAPPER_UPDATE_PROPERTY_ZONE)
    public async updatePropertyZone(propertyId: number, zone: Zone, type: 'entry' | 'garage'): Promise<Property[]> {
        const zoneData = JSON.stringify(zoneToLegacyData(zone));

        await this.prismaService.housing_property.update({
            where: {
                id: propertyId,
            },
            data: {
                [`${type}_zone`]: zoneData,
            },
        });

        return await this.repositoryProvider.refresh('housing');
    }

    @Rpc(RpcServerEvent.ADMIN_MAPPER_ADD_APARTMENT)
    public async addApartment(): Promise<Property[]> {
        return await this.repositoryProvider.refresh('housing');
    }

    @Rpc(RpcServerEvent.ADMIN_MAPPER_ADD_PROPERTY)
    public async addProperty(): Promise<Property[]> {
        return await this.repositoryProvider.refresh('housing');
    }

    @Rpc(RpcServerEvent.ADMIN_MAPPER_REMOVE_PROPERTY)
    public async removeProperty(): Promise<Property[]> {
        return await this.repositoryProvider.refresh('housing');
    }

    @Rpc(RpcServerEvent.ADMIN_MAPPER_REMOVE_APARTMENT)
    public async removeApartment(): Promise<Property[]> {
        return await this.repositoryProvider.refresh('housing');
    }
}
