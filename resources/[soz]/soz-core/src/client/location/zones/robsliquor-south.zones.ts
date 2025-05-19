import { Injectable } from '../../../core/decorators/injectable';
import { BoxZone } from '../../../shared/polyzone/box.zone';
import { LocationZone } from './zones.interface';

@Injectable('LocationZone')
export class RobsliquorSouthZones implements LocationZone {
    get id(): string {
        return 'robsliquor-south';
    }

    get zones(): Record<string, BoxZone> {
        return {
            robsliquor: new BoxZone([-1223.87, -906.37, 12.33], 8.4, 7.2, { heading: 34, minZ: 11.33, maxZ: 14.33 }),
            robsliquor2: new BoxZone([-1487.55, -380.17, 40.16], 8.4, 7.2, { heading: 315, minZ: 39.16, maxZ: 42.16 }),
            robsliquor3: new BoxZone([-2968.92, 390.49, 15.04], 8.4, 7.2, { heading: 86, minZ: 14.04, maxZ: 17.04 }),
            robsliquor5: new BoxZone([1136.57, -981.54, 46.42], 8.4, 7.2, { heading: 98, minZ: 45.42, maxZ: 48.42 }),
        };
    }
}
