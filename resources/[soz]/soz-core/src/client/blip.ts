import { Inject, Injectable } from '../core/decorators/injectable';
import { Blip } from '../shared/blip';
import { Qbcore } from './qbcore';

@Injectable()
export class BlipFactory {
    @Inject(Qbcore)
    private QBCore: Qbcore;

    public create(id: string, blip: Blip): void {
        if (blip.position) {
            blip.coords = { x: blip.position[0], y: blip.position[1], z: blip.position[2] };
        }

        this.QBCore.createBlip(id, blip);
    }

    public hide(id: string, value: boolean): void {
        this.QBCore.hideBlip(id, value);
    }

    public remove(id: string): void {
        this.QBCore.removeBlip(id);
    }

    public exist(id: string): boolean {
        return this.QBCore.hasBlip(id);
    }
}
