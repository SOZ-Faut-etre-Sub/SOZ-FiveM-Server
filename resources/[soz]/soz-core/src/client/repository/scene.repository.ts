import { Injectable } from '../../core/decorators/injectable';
import { RepositoryType } from '../../shared/repository';
import { Repository } from './repository';

@Injectable(SceneRepository, Repository)
export class SceneRepository extends Repository<RepositoryType.Scene> {
    public type = RepositoryType.Scene;
}
