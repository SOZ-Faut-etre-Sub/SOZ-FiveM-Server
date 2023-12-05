import { Inject, Injectable } from '../../core/decorators/injectable';
import { ZoneType, ZoneTyped } from '../../shared/polyzone/box.zone';
import { RepositoryType } from '../../shared/repository';
import { PrismaService } from '../database/prisma.service';
import { Repository } from './repository';

@Injectable(ZoneRepository, Repository)
export class ZoneRepository extends Repository<RepositoryType.Zone> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    public type = RepositoryType.Zone;

    protected async load(): Promise<Record<number, ZoneTyped>> {
        const zones = await this.prismaService.zone.findMany();
        const list = {};

        for (const zone of zones) {
            const zoneDecoded = JSON.parse(zone.zone) as ZoneTyped;

            zoneDecoded.data = {
                type: zone.type as ZoneType,
                name: zone.name,
                id: zone.id,
            };

            list[zone.id] = zoneDecoded;
        }

        return list;
    }

    public async addZone(zone: ZoneTyped): Promise<void> {
        const addedZone = await this.prismaService.zone.create({
            data: {
                zone: JSON.stringify(zone),
                type: zone.data.type,
                name: zone.data.name,
            },
        });

        zone.data.id = addedZone.id;

        await this.set(addedZone.id, zone);
    }

    public async updateZone(zone: ZoneTyped): Promise<void> {
        const addedZone = await this.prismaService.zone.update({
            data: {
                zone: JSON.stringify(zone),
                type: zone.data.type,
                name: zone.data.name,
            },
            where: {
                id: zone.data.id,
            },
        });

        await this.set(addedZone.id, zone);
    }

    public async removeZone(id: number): Promise<void> {
        await this.prismaService.zone.delete({
            where: {
                id,
            },
        });

        await this.delete(id);
    }
}
