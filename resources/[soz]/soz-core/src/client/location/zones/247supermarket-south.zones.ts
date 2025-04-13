import { Injectable } from '@public/core/decorators/injectable';
import { BoxZone } from '@public/shared/polyzone/box.zone';

import { LocationZone } from './zones.interface';

@Injectable('LocationZone')
export class SupermarketSouthZones implements LocationZone {
    get id(): string {
        return '247supermarket-south';
    }

    get zones(): Record<string, BoxZone> {
        return {
            '247supermarket': new BoxZone([29.16, -1345.45, 29.5], 7.2, 11.0, { heading: 0, minZ: 28.5, maxZ: 31.5 }),
            '247supermarket2': new BoxZone([-3042.15, 588.45, 7.91], 7.2, 11.0, {
                heading: 288,
                minZ: 6.91,
                maxZ: 9.91,
            }),
            '247supermarket3': new BoxZone([-3243.69, 1004.8, 12.83], 7.2, 11.0, {
                heading: 265,
                minZ: 11.83,
                maxZ: 14.83,
            }),
            '247supermarket8': new BoxZone([2555.6, 385.53, 108.62], 7.2, 11.0, {
                heading: 88,
                minZ: 107.62,
                maxZ: 110.62,
            }),
            '247supermarket9': new BoxZone([377.55, 327.08, 103.57], 7.2, 11.0, {
                heading: 166,
                minZ: 102.57,
                maxZ: 105.57,
            }),
        };
    }
}
