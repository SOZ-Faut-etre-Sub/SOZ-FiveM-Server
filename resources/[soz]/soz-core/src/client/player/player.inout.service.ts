import { Injectable } from '../../core/decorators/injectable';
import { AbstractZone } from '../../shared/polyzone/abstract.zone';

export type PlayerInOutServiceElement = {
    zone: AbstractZone;
    cb: (isInside: boolean) => void;
    isLastInside: boolean;
};

@Injectable()
export class PlayerInOutService {
    private elems: PlayerInOutServiceElement[] = [];

    public add(zone: AbstractZone, cb: (isInside: boolean) => void): void {
        const elem = { zone: zone, cb: cb } as PlayerInOutServiceElement;
        this.elems.push(elem);
    }

    public get(): PlayerInOutServiceElement[] {
        return this.elems;
    }
}
