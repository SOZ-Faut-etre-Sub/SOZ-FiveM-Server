import { Injectable } from '@core/decorators/injectable';
import { RepositoryType } from '@public/shared/repository';

import { Repository } from './repository';

@Injectable(ElevatorRepository, Repository)
export class ElevatorRepository extends Repository<RepositoryType.Elevator> {
    public type = RepositoryType.Elevator;
}
