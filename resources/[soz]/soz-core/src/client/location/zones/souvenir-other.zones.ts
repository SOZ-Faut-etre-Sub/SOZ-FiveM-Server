import { Injectable } from '@public/core/decorators/injectable';
import { BoxZone } from '@public/shared/polyzone/box.zone';

import { LocationZone } from './zones.interface';

@Injectable('LocationZone')
export class SouvenirOtherZones implements LocationZone {
    get id(): string {
        return 'souvenir-other';
    }

    get zones(): Record<string, BoxZone> {
        return {
            'souvenir-other': new BoxZone([1695.58, 4785.2, 42.0], 10.0, 10.0, {
                heading: 90.45,
                minZ: 41.0,
                maxZ: 44.0,
            }),
        };
    }
}
