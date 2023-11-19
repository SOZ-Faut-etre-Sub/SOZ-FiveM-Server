import { Injectable } from '../../core/decorators/injectable';
import { RepositoryType } from '../../shared/repository';
import { Repository } from './repository';

@Injectable(SenateRepository, Repository)
export class SenateRepository extends Repository<RepositoryType.SenateParty> {
    public type = RepositoryType.SenateParty;
}
