import { Injectable } from '../../core/decorators/injectable';
import { RepositoryType } from '../../shared/repository';
import { Repository } from './repository';

@Injectable(TowRopeRepository, Repository)
export class TowRopeRepository extends Repository<RepositoryType.TowRope> {
    public type = RepositoryType.TowRope;
}
