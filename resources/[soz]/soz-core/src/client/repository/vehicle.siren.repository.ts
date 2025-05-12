import { Injectable } from '../../core/decorators/injectable';
import { RepositoryType } from '../../shared/repository';
import { Repository } from './repository';

@Injectable(VehicleSirenRepository, Repository)
export class VehicleSirenRepository extends Repository<RepositoryType.VehicleSiren> {
    public type = RepositoryType.VehicleSiren;
}
