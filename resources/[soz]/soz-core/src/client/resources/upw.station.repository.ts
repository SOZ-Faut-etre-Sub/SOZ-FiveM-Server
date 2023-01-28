import { Injectable } from '../../core/decorators/injectable';
import { emitRpc } from '../../core/rpc';
import { UpwCharger } from '../../shared/fuel';
import { RpcEvent } from '../../shared/rpc';

@Injectable()
export class UpwChargerRepository {
    private upwCharger: Record<number, UpwCharger> = {}; // name -> upwCharger

    public async load() {
        this.upwCharger = await emitRpc(RpcEvent.REPOSITORY_GET_DATA, 'upwCharger');
    }

    public update(charger: Record<number, UpwCharger>) {
        this.upwCharger = charger;
    }

    public get(): Record<number, UpwCharger> {
        return this.upwCharger;
    }

    public getModel(): number {
        return 2074167371;
    }

    public find(id: number): UpwCharger | undefined {
        return this.upwCharger[id];
    }
}
