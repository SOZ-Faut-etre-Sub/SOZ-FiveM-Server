import { Inject, Injectable } from '@core/decorators/injectable';
import { PrismaService } from '@public/server/database/prisma.service';

import { RepositoryLegacy } from '../../../src/server/repository/repository';

@Injectable()
export class DrugSellLocationRepository extends RepositoryLegacy<number> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    protected async load(): Promise<number> {
        return 0;
    }
}
