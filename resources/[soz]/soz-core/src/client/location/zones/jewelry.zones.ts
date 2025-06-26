import { Injectable } from '@public/core/decorators/injectable';
import { BoxZone } from '@public/shared/polyzone/box.zone';

import { LocationZone } from './zones.interface';

@Injectable('LocationZone')
export class JewelryZones implements LocationZone {
    get id(): string {
        return 'jewelry';
    }

    get zones(): Record<string, BoxZone> {
        return {
            jewelry: new BoxZone([-623.8, -232.01, 38.06], 16.8, 16.8, { heading: 306, minZ: 37.06, maxZ: 40.06 }),
        };
    }
}
