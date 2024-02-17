import { Injectable } from '../../core/decorators/injectable';
import { RepositoryType } from '../../shared/repository';
import { Repository } from './repository';

@Injectable(DoorRepository, Repository)
export class DoorRepository extends Repository<RepositoryType.Door> {
    public type = RepositoryType.Door;
}
