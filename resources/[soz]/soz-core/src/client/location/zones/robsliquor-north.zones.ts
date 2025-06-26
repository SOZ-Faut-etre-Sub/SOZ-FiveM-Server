import { Injectable } from '@public/core/decorators/injectable';
import { BoxZone } from '@public/shared/polyzone/box.zone';

import { LocationZone } from './zones.interface';

@Injectable('LocationZone')
export class RobsliquorNorthZones implements LocationZone {
    get id(): string {
        return 'robsliquor-north';
    }

    get zones(): Record<string, BoxZone> {
        return {
            robsliquor4: new BoxZone([1166.47, 2708.26, 38.16], 8.4, 7.2, { heading: 0, minZ: 37.16, maxZ: 40.16 }),
            robsliquor6: new BoxZone([-161.23, 6325.47, 31.59], 8.4, 7.2, { heading: 135, minZ: 30.59, maxZ: 33.59 }),
        };
    }
}
