import { Inject, Injectable } from '@core/decorators/injectable';
import { PrismaService } from '@public/server/database/prisma.service';
import { Repository } from '@public/server/repository/repository';

@Injectable()
export class DrugSeedlingRepository extends Repository<number> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    protected async load(): Promise<number> {
        return 0;
    }
}
