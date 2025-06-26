import { Injectable } from '@public/core/decorators/injectable';
import { BoxZone } from '@public/shared/polyzone/box.zone';

import { LocationZone } from './zones.interface';

@Injectable('LocationZone')
export class BarberZones implements LocationZone {
    get id(): string {
        return 'barber';
    }

    get zones(): Record<string, BoxZone> {
        return {
            barber: new BoxZone([-816.09, -182.76, 37.57], 12.4, 16.8, { heading: 29, minZ: 36.57, maxZ: 39.57 }),
            barber2: new BoxZone([137.18, -1708.32, 29.29], 12.0, 5.6, { heading: 320, minZ: 28.29, maxZ: 32.29 }),
            barber3: new BoxZone([1212.29, -473.1, 66.21], 12.0, 5.6, { heading: 75, minZ: 65.21, maxZ: 68.21 }),
            barber4: new BoxZone([-278.48, 6227.89, 31.7], 12.0, 5.6, { heading: 46, minZ: 30.7, maxZ: 33.7 }),
            barber5: new BoxZone([-1282.72, -1117.55, 6.99], 12.0, 5.6, { heading: 90, minZ: 5.99, maxZ: 8.99 }),
            barber6: new BoxZone([1932.01, 3730.55, 32.84], 12.0, 5.6, { heading: 30, minZ: 31.84, maxZ: 34.84 }),
            barber7: new BoxZone([-33.49, -152.25, 57.08], 12.0, 5.6, { heading: 341, minZ: 56.08, maxZ: 59.08 }),
        };
    }
}
