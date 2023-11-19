import { Inject, Injectable } from '../../core/decorators/injectable';
import { RepositoryType } from '../../shared/repository';
import { SenateParty } from '../../shared/senate';
import { PrismaService } from '../database/prisma.service';
import { Repository } from './repository';

@Injectable(SenateRepository, Repository)
export class SenateRepository extends Repository<RepositoryType.SenateParty> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    public type = RepositoryType.SenateParty;

    protected async load(): Promise<Record<string, SenateParty>> {
        const result = await this.prismaService.senateParty.findMany();
        const parties = {};

        result.forEach(party => {
            parties[party.id] = {
                id: party.id,
                name: party.name,
            };
        });

        return parties;
    }
}
