import { Injectable } from '../../core/decorators/injectable';
import { RepositoryType } from '../../shared/repository';
import { Repository } from './repository';

@Injectable(ZoneRepository, Repository)
export class ZoneRepository extends Repository<RepositoryType.Zone> {
    public type = RepositoryType.Zone;
}
