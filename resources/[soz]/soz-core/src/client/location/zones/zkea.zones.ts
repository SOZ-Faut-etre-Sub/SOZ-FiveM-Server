import { Injectable } from '@public/core/decorators/injectable';
import { BoxZone } from '@public/shared/polyzone/box.zone';

import { LocationZone } from './zones.interface';

@Injectable('LocationZone')
export class ZKEAZones implements LocationZone {
    get id(): string {
        return 'zkea';
    }

    get zones(): Record<string, BoxZone> {
        return {
            zkea: new BoxZone([-57.81, 6523.1, 31.49], 4.0, 8.4, { heading: 247, minZ: 30.51, maxZ: 33.51 }),
        };
    }
}
