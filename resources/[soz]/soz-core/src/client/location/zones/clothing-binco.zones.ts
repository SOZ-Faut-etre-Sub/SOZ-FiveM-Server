import { Injectable } from '@public/core/decorators/injectable';
import { BoxZone } from '@public/shared/polyzone/box.zone';

import { LocationZone } from './zones.interface';

@Injectable('LocationZone')
export class ClothingBincoZones implements LocationZone {
    get id(): string {
        return 'binco';
    }

    get zones(): Record<string, BoxZone> {
        return {
            binco1: new BoxZone([425.33, -805.25, 29.49], 14.6, 13.2, { heading: 180, minZ: 28.49, maxZ: 31.49 }),
            binco2: new BoxZone([-823.12, -1074.28, 11.33], 14.6, 13.2, { heading: 120, minZ: 10.33, maxZ: 13.33 }),
            binco3: new BoxZone([75.65, -1393.88, 29.38], 14.6, 13.2, { heading: 0, minZ: 28.38, maxZ: 31.38 }),
            binco4: new BoxZone([5.37, 6513.26, 31.88], 14.6, 13.2, { heading: 133, minZ: 30.88, maxZ: 33.88 }),
            binco5: new BoxZone([1693.6, 4823.71, 42.06], 14.6, 13.2, { heading: 188, minZ: 41.06, maxZ: 44.06 }),
            binco6: new BoxZone([1195.72, 2709.94, 38.22], 14.6, 13.2, { heading: 90, minZ: 37.22, maxZ: 40.22 }),
            binco7: new BoxZone([-1102.01, 2709.77, 19.11], 14.6, 13.2, { heading: 132, minZ: 18.11, maxZ: 21.11 }),
            binco8: new BoxZone([5001.54, -5120.84, 2.61], 15.0, 13.6, { heading: 340, minZ: 1.61, maxZ: 4.61 }),
        };
    }
}
