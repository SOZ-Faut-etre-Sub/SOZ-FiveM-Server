import { Door } from '@public/shared/door';

import { Inject, Injectable } from '../../core/decorators/injectable';
import { RepositoryType } from '../../shared/repository';
import { PrismaService } from '../database/prisma.service';
import { Repository } from './repository';

@Injectable(DoorRepository, Repository)
export class DoorRepository extends Repository<RepositoryType.Door> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    public type = RepositoryType.Door;

    protected async load(): Promise<Record<string, Door>> {
        const rows = await this.prismaService.door.findMany();
        const ret: Record<string, Door> = {};

        for (const row of rows) {
            ret[row.id] = JSON.parse(row.data);
        }

        return ret;
    }
}
