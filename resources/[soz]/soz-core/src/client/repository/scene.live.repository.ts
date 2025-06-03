import { Injectable } from '../../core/decorators/injectable';
import { RepositoryType } from '../../shared/repository';
import { Repository } from './repository';

@Injectable(SceneLiveRepository, Repository)
export class SceneLiveRepository extends Repository<RepositoryType.SceneLive> {
    public type = RepositoryType.SceneLive;
}
