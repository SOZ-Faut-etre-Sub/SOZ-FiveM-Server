import { Injectable } from '../../core/decorators/injectable';
import { RepositoryType } from '../../shared/repository';
import { Repository } from './repository';

@Injectable(WorldEventRepository, Repository)
export class WorldEventRepository extends Repository<RepositoryType.WorldEvent> {
    public type = RepositoryType.WorldEvent;
}
