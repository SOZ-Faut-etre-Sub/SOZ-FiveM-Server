import { Injectable } from '../../core/decorators/injectable';
import { RepositoryType } from '../../shared/repository';
import { SceneLiveElement } from '../../shared/scene';
import { Repository } from './repository';

@Injectable(SceneLiveRepository, Repository)
export class SceneLiveRepository extends Repository<RepositoryType.SceneLive> {
    public type = RepositoryType.SceneLive;

    protected async load(): Promise<Record<string, SceneLiveElement>> {
        return {};
    }
}
