import { Injectable } from '../../core/decorators/injectable';

@Injectable()
export class VehicleStateService {
    private spawned: Set<number> = new Set();

    public registerSpawned(netId: number): void {
        this.spawned.add(netId);
    }
}
