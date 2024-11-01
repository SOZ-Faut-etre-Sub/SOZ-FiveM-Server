import { Injectable } from '@core/decorators/injectable';
import { RepositoryType } from '@public/shared/repository';

import { Repository } from './repository';

@Injectable(RaceRepository, Repository)
export class RaceRepository extends Repository<RepositoryType.Race> {
    public type = RepositoryType.Race;
}
