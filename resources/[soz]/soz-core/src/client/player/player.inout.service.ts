import { Injectable } from '@core/decorators/injectable';

import { AbstractZone } from '../../shared/polyzone/abstract.zone';

type PlayerInOutServiceElement = {
    id: string;
    zone: AbstractZone;
    cb: (isInside: boolean) => void;
    isLastInside: boolean;
    init: boolean;
};

@Injectable()
export class PlayerInOutService {
    private elems: Record<string, PlayerInOutServiceElement> = {};

    public add(id: string, zone: AbstractZone, cb: (isInside: boolean) => void): void {
        this.elems[id] = { id: id, zone: zone, cb: cb, isLastInside: false, init: false };
    }

    public get(): Record<string, PlayerInOutServiceElement> {
        return this.elems;
    }

    public remove(id: string) {
        if (!this.elems[id]) {
            return;
        }

        delete this.elems[id];
    }
}
