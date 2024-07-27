import { Injectable } from '../../core/decorators/injectable';
import { RepositoryType } from '../../shared/repository';
import { Repository } from './repository';

@Injectable(BankAtmRepository, Repository)
export class BankAtmRepository extends Repository<RepositoryType.BankAtm> {
    public type = RepositoryType.BankAtm;
}
