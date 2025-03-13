import { Injectable } from '@core/decorators/injectable';
import { Gang } from '@private/shared/gang';
import { Repository } from '@public/server/repository/repository';
import { RepositoryType } from '@public/shared/repository';

@Injectable(GangRepository, Repository)
export class GangRepository extends Repository<RepositoryType.Gang> {
    public type = RepositoryType.Gang;

    protected async load(): Promise<Record<number, Gang>> {
        return {};
    }
}
