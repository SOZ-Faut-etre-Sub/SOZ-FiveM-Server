import { Injectable } from '../../../core/decorators/injectable';
import { BoxZone } from '../../../shared/polyzone/box.zone';
import { LocationZone } from './zones.interface';

@Injectable('LocationZone')
export class LtdgasolineSouthZones implements LocationZone {
    get id(): string {
        return 'ltdgasoline-south';
    }

    get zones(): Record<string, BoxZone> {
        return {
            ltdgasoline: new BoxZone([-50.3, -1753.56, 29.42], 7.6, 13.6, { heading: 320, minZ: 28.42, maxZ: 31.42 }),
            ltdgasoline2: new BoxZone([-711.71, -912.64, 19.22], 7.6, 13.6, { heading: 0, minZ: 18.22, maxZ: 21.22 }),
            ltdgasoline3: new BoxZone([-1824.96, 791.23, 138.2], 7.6, 13.6, { heading: 223, minZ: 137.2, maxZ: 140.2 }),
            ltdgasoline4: new BoxZone([1159.01, -322.61, 69.21], 7.6, 13.6, { heading: 10, minZ: 68.21, maxZ: 70.21 }),
            ltdgasoline6: new BoxZone([-1424.8, -265.62, 46.32], 7.6, 13.6, { heading: 131, minZ: 45.32, maxZ: 48.32 }),
            ltdgasoline7: new BoxZone([-2068.84, -327.96, 13.32], 7.6, 13.6, { heading: 84, minZ: 12.32, maxZ: 15.32 }),
        };
    }
}
