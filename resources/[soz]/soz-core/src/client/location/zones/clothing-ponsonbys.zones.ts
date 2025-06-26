import { Injectable } from '@public/core/decorators/injectable';
import { BoxZone } from '@public/shared/polyzone/box.zone';

import { LocationZone } from './zones.interface';

@Injectable('LocationZone')
export class ClothingPonsonbysZones implements LocationZone {
    get id(): string {
        return 'ponsonbys';
    }

    get zones(): Record<string, BoxZone> {
        return {
            ponsonbys1: new BoxZone([-708.9, -151.96, 37.42], 20.0, 16.8, { heading: 30, minZ: 36.42, maxZ: 39.42 }),
            ponsonbys2: new BoxZone([-164.72, -302.74, 39.73], 20.0, 16.8, { heading: 341, minZ: 38.73, maxZ: 41.73 }),
            ponsonbys3: new BoxZone([-1449.6, -238.75, 49.81], 20.0, 16.8, { heading: 137, minZ: 48.81, maxZ: 51.81 }),
        };
    }
}
