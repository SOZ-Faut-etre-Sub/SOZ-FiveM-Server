import { DynamicElevator, DynamicElevatorState } from '@public/shared/elevators';

import { Injectable } from '../../core/decorators/injectable';
import { RepositoryType } from '../../shared/repository';
import { Repository } from './repository';

@Injectable(ElevatorRepository, Repository)
export class ElevatorRepository extends Repository<RepositoryType.Elevator> {
    public type = RepositoryType.Elevator;

    protected async load(): Promise<Record<DynamicElevator, DynamicElevatorState>> {
        const ret: Record<DynamicElevator, DynamicElevatorState> = {
            MirrorParkLSPD1: {
                id: DynamicElevator.MirrorParkLSPD1,
                current: 1,
                doorState: false,
                next: [],
                timer: 0,
                inmotion: false,
                music: null,
            },
            MirrorParkLSPD2: {
                id: DynamicElevator.MirrorParkLSPD2,
                current: 1,
                doorState: false,
                next: [],
                timer: 0,
                inmotion: false,
                music: null,
            },
        };

        return ret;
    }
}
