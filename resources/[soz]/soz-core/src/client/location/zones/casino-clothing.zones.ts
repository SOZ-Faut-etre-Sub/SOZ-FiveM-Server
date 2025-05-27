import { Injectable } from '@public/core/decorators/injectable';
import { BoxZone } from '@public/shared/polyzone/box.zone';

import { LocationZone } from './zones.interface';

@Injectable('LocationZone')
export class CasinoClothingZones implements LocationZone {
    get id(): string {
        return 'casino-clothing';
    }

    get zones(): Record<string, BoxZone> {
        return {
            'casino-clothing1': new BoxZone([924.89, 24.38, 71.83], 8.0, 12.4, {
                heading: 283.47,
                minZ: 70.83,
                maxZ: 74.83,
            }),
        };
    }
}
