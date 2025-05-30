import { TravelingCamera } from '@public/shared/traveling';

import { Inject, Injectable } from '../../core/decorators/injectable';
import { RepositoryType } from '../../shared/repository';
import { PrismaService } from '../database/prisma.service';
import { Repository } from './repository';

@Injectable(CameraTravelingRepository, Repository)
export class CameraTravelingRepository extends Repository<RepositoryType.Traveling> {
    public type = RepositoryType.Traveling;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    protected async load(): Promise<Record<number, TravelingCamera>> {
        const data = await this.prismaService.traveling.findMany();
        const ret: Record<number, TravelingCamera> = {};

        for (const line of data) {
            ret[line.id] = {
                id: line.id,
                name: line.name,
                job: line.job,
                points: JSON.parse(line.points),
            };
        }

        return ret;
    }
}
