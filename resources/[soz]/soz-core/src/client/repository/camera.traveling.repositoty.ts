import { Injectable } from '../../core/decorators/injectable';
import { RepositoryType } from '../../shared/repository';
import { Repository } from './repository';

@Injectable(CameraTravelingRepository, Repository)
export class CameraTravelingRepository extends Repository<RepositoryType.Traveling> {
    public type = RepositoryType.Traveling;
}
