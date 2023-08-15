import { Injectable } from '@core/decorators/injectable';
import { emitRpc } from '@core/rpc';
import { Billboard } from '@public/shared/repository';

import { RpcServerEvent } from '../../shared/rpc';

@Injectable()
export class BillboardRepository {
    private objects: Record<number, Billboard> = {};

    public async load() {
        this.objects = await emitRpc<Record<number, Billboard>>(RpcServerEvent.REPOSITORY_GET_DATA, 'billboard');
    }

    public update(objects: Record<number, Billboard>) {
        this.objects = objects;
    }

    public get(): Record<number, Billboard> {
        return this.objects;
    }

    public find(id: number): Billboard | null {
        if (!this.objects) {
            return null;
        }
        return this.objects[id];
    }

    public updateBillboard(race: Billboard) {
        if (!this.objects) {
            return null;
        }

        return race;
    }

    public deleteBillboard(raceId: number) {
        if (!this.objects) {
            return;
        }

        delete this.objects[raceId];
    }
}
