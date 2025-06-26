import { Injectable } from '@public/core/decorators/injectable';
import { BoxZone } from '@public/shared/polyzone/box.zone';

import { LocationZone } from './zones.interface';

@Injectable('LocationZone')
export class FleecaZones implements LocationZone {
    get id(): string {
        return 'fleeca';
    }

    get zones(): Record<string, BoxZone> {
        return {
            fleeca1: new BoxZone([148.04, -1041.94, 29.37], 9.8, 10.6, { heading: 340, minZ: 28.37, maxZ: 31.37 }),
            fleeca2: new BoxZone([312.32, -280.41, 54.16], 9.8, 10.6, { heading: 340, minZ: 53.16, maxZ: 56.16 }),
            fleeca3: new BoxZone([-352.8, -51.18, 49.04], 9.8, 10.6, { heading: 340, minZ: 48.04, maxZ: 51.04 }),
            fleeca4: new BoxZone([-1213.04, -332.89, 37.78], 9.8, 10.6, { heading: 27, minZ: 36.78, maxZ: 39.78 }),
            fleeca5: new BoxZone([-2960.87, 481.54, 15.7], 9.8, 10.6, { heading: 88, minZ: 14.7, maxZ: 17.7 }),
            fleeca6: new BoxZone([1176.4, 2708.55, 38.09], 9.8, 10.6, { heading: 0, minZ: 37.09, maxZ: 40.09 }),
            fleeca7: new BoxZone([-107.39, 6470.23, 31.63], 19.85, 18.0, { heading: 45, minZ: 30.63, maxZ: 33.63 }),
            fleeca8: new BoxZone([5057.35, -5195.83, 2.6], 15.8, 11.0, { heading: 4.0, minZ: 1.6, maxZ: 4.6 }),
        };
    }
}
