import { RepositoryType } from '@public/shared/repository';

import { Injectable } from '../../core/decorators/injectable';
import { Vehicle } from '../../shared/vehicle/vehicle';
import { Repository } from './repository';

@Injectable(VehicleRepository, Repository)
export class VehicleRepository extends Repository<RepositoryType.Vehicle> {
    public type = RepositoryType.Vehicle;

    public getByModelHash(hash: number): Vehicle | null {
        return this.get().find(vehicle => vehicle.hash === hash) || null;
    }
}
