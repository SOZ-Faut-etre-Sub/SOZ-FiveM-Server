import { Inject, Injectable } from '@core/decorators/injectable';
import { PrismaService } from '@public/server/database/prisma.service';

import { RepositoryLegacy } from '../../../src/server/repository/repositoryLegacy';

@Injectable()
export class DrugSeedlingRepository extends RepositoryLegacy<number> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    protected async load(): Promise<number> {
        return 0;
    }
}
