import { GarageList } from '../../config/garage';
import { Inject, Injectable } from '../../core/decorators/injectable';
import { BoxZone } from '../../shared/polyzone/box.zone';
import { Garage, GarageCategory, GarageType, PlaceCapacity } from '../../shared/vehicle/garage';
import { PrismaService } from '../database/prisma.service';
import { RepositoryLegacy } from './repository';

type DatabaseZone = {
    x: number;
    y: number;
    z: number;
    heading: number;
    minZ: number;
    maxZ: number;
};

@Injectable()
export class GarageRepository extends RepositoryLegacy<Record<string, Garage>> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    protected async load(): Promise<Record<string, Garage>> {
        const garageList: Record<string, Garage> = {};

        for (const id of Object.keys(GarageList)) {
            garageList[id] = {
                id,
                ...GarageList[id],
            };
        }

        const houseProperties = await this.prismaService.housing_property.findMany({
            where: {
                NOT: { garage_zone: null },
            },
        });

        for (const houseProperty of houseProperties) {
            const entryZone = JSON.parse(houseProperty.entry_zone) as DatabaseZone;
            const garageZone = JSON.parse(houseProperty.garage_zone) as DatabaseZone;

            garageList[houseProperty.identifier] = {
                id: `property_${houseProperty.identifier}`,
                name: 'Garage personnel',
                type: GarageType.House,
                category: GarageCategory.All,
                zone: new BoxZone([entryZone.x, entryZone.y, entryZone.z], 8.0, 6.0, {
                    heading: entryZone.heading,
                    minZ: entryZone.minZ,
                    maxZ: entryZone.maxZ,
                }),
                parkingPlaces: [
                    new BoxZone([garageZone.x, garageZone.y, garageZone.z], 8.0, 6.0, {
                        heading: garageZone.heading,
                        minZ: garageZone.minZ,
                        maxZ: garageZone.maxZ,
                        data: {
                            capacity: [PlaceCapacity.Large, PlaceCapacity.Medium, PlaceCapacity.Small],
                        },
                    }),
                ],
                isTrailerGarage: houseProperty.identifier.includes('trailer'),
            };
        }

        return garageList;
    }
}
