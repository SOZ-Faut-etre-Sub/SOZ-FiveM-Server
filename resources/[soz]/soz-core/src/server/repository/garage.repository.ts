import { GarageList } from '../../config/garage';
import { Inject, Injectable } from '../../core/decorators/injectable';
import { BoxZone } from '../../shared/polyzone/box.zone';
import { Garage, GarageCategory, GarageType } from '../../shared/vehicle/garage';
import { PrismaService } from '../database/prisma.service';
import { Repository } from './repository';

type DatabaseZone = {
    x: number;
    y: number;
    z: number;
    heading: number;
    minZ: number;
    maxZ: number;
};

@Injectable()
export class GarageRepository extends Repository<Record<string, Garage>> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    protected async load(): Promise<Record<string, Garage>> {
        const garageList = { ...GarageList };

        const houseProperties = await this.prismaService.housing_property.findMany({
            where: {
                NOT: { garage_zone: null },
            },
        });

        for (const houseProperty of houseProperties) {
            const entryZone = JSON.parse(houseProperty.entry_zone) as DatabaseZone;
            const garageZone = JSON.parse(houseProperty.garage_zone) as DatabaseZone;

            const houseGarage = {
                name: 'Garage personnel',
                type: GarageType.House,
                category: GarageCategory.Car,
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
                    }),
                ],
            };

            garageList[houseProperty.identifier] = houseGarage;
        }

        return garageList;
    }
}
