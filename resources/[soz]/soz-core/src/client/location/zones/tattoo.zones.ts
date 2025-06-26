import { Injectable } from '@public/core/decorators/injectable';
import { BoxZone } from '@public/shared/polyzone/box.zone';

import { LocationZone } from './zones.interface';

@Injectable('LocationZone')
export class TattooZones implements LocationZone {
    get id(): string {
        return 'tattoo';
    }

    get zones(): Record<string, BoxZone> {
        return {
            tattooshop: new BoxZone([322.9, 180.81, 103.59], 8.2, 5.2, { heading: 70, minZ: 101.59, maxZ: 105.59 }),
            tattooshop2: new BoxZone([1863.71, 3748.13, 33.03], 4.8, 7.6, { heading: 300, minZ: 31.03, maxZ: 35.03 }),
            tattooshop3: new BoxZone([-293.32, 6199.73, 31.49], 4.8, 7.6, { heading: 315, minZ: 30.49, maxZ: 33.49 }),
            tattooshop4: new BoxZone([-1154.01, -1426.42, 4.95], 8.2, 5.2, { heading: 125, minZ: 3.95, maxZ: 6.95 }),
            tattooshop5: new BoxZone([1322.87, -1652.86, 52.28], 8.2, 5.2, { heading: 309, minZ: 51.28, maxZ: 54.28 }),
            tattooshop6: new BoxZone([-3170.22, 1076.11, 20.83], 8.2, 5.2, { heading: 335, minZ: 19.83, maxZ: 22.83 }),
        };
    }
}
