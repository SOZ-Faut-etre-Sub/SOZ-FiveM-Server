import { Injectable } from '@public/core/decorators/injectable';
import { BoxZone } from '@public/shared/polyzone/box.zone';

import { LocationZone } from './zones.interface';

@Injectable('LocationZone')
export class LsCustomZones implements LocationZone {
    get id(): string {
        return 'ls-custom';
    }

    get zones(): Record<string, BoxZone> {
        return {
            'ls-custom1': new BoxZone([-339.46, -136.73, 39.01], 18, 10, { heading: 70, minZ: 38.0, maxZ: 42.01 }),
            'ls-custom2': new BoxZone([-1154.88, -2005.4, 13.18], 10, 18, { heading: 45, minZ: 12.18, maxZ: 16.18 }),
            'ls-custom3': new BoxZone([731.87, -1087.88, 22.17], 10, 10, { heading: 0, minZ: 21.17, maxZ: 25.17 }),
            'ls-custom4': new BoxZone([103.78, 6628.37, 31.4], 22.6, 22.8, { heading: 45, minZ: 30.4, maxZ: 37.0 }),
            'ls-custom5': new BoxZone([1175.88, 2640.3, 37.79], 10, 10, { heading: 45, minZ: 36.79, maxZ: 40.79 }),
        };
    }
}
