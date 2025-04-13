import { Injectable } from '@public/core/decorators/injectable';
import { BoxZone } from '@public/shared/polyzone/box.zone';

import { LocationZone } from './zones.interface';

@Injectable('LocationZone')
export class LtdgasolineNorthZones implements LocationZone {
    get id(): string {
        return 'ltdgasoline-north';
    }

    get zones(): Record<string, BoxZone> {
        return {
            ltdgasoline5: new BoxZone([1702.08, 4926.8, 42.06], 7.6, 13.6, { heading: 55, minZ: 41.06, maxZ: 43.06 }),
        };
    }
}
