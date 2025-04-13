import { Injectable } from '@public/core/decorators/injectable';
import { BoxZone } from '@public/shared/polyzone/box.zone';

import { LocationZone } from './zones.interface';

@Injectable('LocationZone')
export class ClothingSuburbanZones implements LocationZone {
    get id(): string {
        return 'suburban';
    }

    get zones(): Record<string, BoxZone> {
        return {
            suburban1: new BoxZone([123.08, -223.55, 54.56], 25.0, 10.8, { heading: 340, minZ: 53.56, maxZ: 56.56 }),
            // suburban2: new BoxZone([617.17, 2763.63, 42.09],  25.0, 10.8, { heading:5, minZ:41.09, maxZ:44.09, }),
            suburban3: new BoxZone([-1190.71, -770.15, 17.32], 25.0, 10.8, { heading: 306, minZ: 16.32, maxZ: 19.32 }),
            suburban4: new BoxZone([-3173.42, 1044.33, 20.86], 25.0, 10.8, { heading: 336, minZ: 19.86, maxZ: 22.86 }),
        };
    }
}
