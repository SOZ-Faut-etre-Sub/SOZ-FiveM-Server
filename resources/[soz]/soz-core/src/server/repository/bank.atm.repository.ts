import { AtmLocations } from '../../config/atm';
import { Injectable } from '../../core/decorators/injectable';
import { BankAtm } from '../../shared/bank';
import { Vector2 } from '../../shared/polyzone/vector';
import { RepositoryType } from '../../shared/repository';
import { Repository } from './repository';

@Injectable(BankAtmRepository, Repository)
export class BankAtmRepository extends Repository<RepositoryType.BankAtm> {
    public type = RepositoryType.BankAtm;

    protected async load(): Promise<Record<string, BankAtm>> {
        return AtmLocations;
    }

    public async addNewAtm(identifier: string, accountId: string, coords: Vector2): Promise<void> {
        this.data[identifier] = { accountId, coords };
        console.log('Added new ATM', this.data[identifier]);
    }
}
