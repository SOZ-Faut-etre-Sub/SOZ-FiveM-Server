import { Injectable } from '../core/decorators/injectable';
import { Vector4 } from '../shared/polyzone/vector';

@Injectable()
export class PropsService {
    public createObject(modelHash: number, position: Vector4, culling: number, freeze: boolean): string {
        return exports['soz-utils'].CreateObject(
            modelHash,
            position[0],
            position[1],
            position[2],
            position[3],
            culling,
            freeze
        );
    }

    public deleteObject(ref: string): void {
        return exports['soz-utils'].DeleteObject(ref);
    }
}
