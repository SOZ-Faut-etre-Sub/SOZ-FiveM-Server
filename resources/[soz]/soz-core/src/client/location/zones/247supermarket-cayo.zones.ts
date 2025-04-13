import { Injectable } from '@public/core/decorators/injectable';
import { BoxZone } from '@public/shared/polyzone/box.zone';

import { LocationZone } from './zones.interface';

@Injectable('LocationZone')
export class SupermarketCayoZones implements LocationZone {
    get id(): string {
        return '247supermarket-cayo';
    }

    get zones(): Record<string, BoxZone> {
        return {
            '247supermarket12': new BoxZone([5146.02, -5083.16, 2.64], 12.0, 11.2, {
                heading: 7.0,
                minZ: 1.64,
                maxZ: 4.64,
            }),
        };
    }
}
