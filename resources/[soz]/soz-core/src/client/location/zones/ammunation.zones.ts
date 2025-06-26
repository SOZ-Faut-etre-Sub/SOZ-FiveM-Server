import { Injectable } from '@public/core/decorators/injectable';
import { BoxZone } from '@public/shared/polyzone/box.zone';

import { LocationZone } from './zones.interface';

@Injectable('LocationZone')
export class AmmunationZones implements LocationZone {
    get id(): string {
        return 'ammunation';
    }

    get zones(): Record<string, BoxZone> {
        return {
            ammunation: new BoxZone([-662.83, -938.21, 21.83], 11.8, 7.8, { heading: 0, minZ: 20.83, maxZ: 23.83 }),
            ammunation2: new BoxZone([810.91, -2154.39, 29.62], 11.8, 7.8, { heading: 0, minZ: 28.62, maxZ: 31.62 }),
            ammunation3: new BoxZone([1695.25, 3757.32, 34.71], 11.8, 7.8, { heading: 47, minZ: 33.71, maxZ: 36.71 }),
            ammunation4: new BoxZone([-328.73, 6081.27, 31.45], 11.8, 7.8, { heading: 45, minZ: 30.45, maxZ: 33.45 }),
            ammunation5: new BoxZone([249.64, -48.41, 69.94], 11.8, 7.8, { heading: 70, minZ: 68.94, maxZ: 71.94 }),
            ammunation6: new BoxZone([20.39, -1109.65, 29.8], 11.8, 7.8, { heading: 340, minZ: 28.8, maxZ: 31.8 }),
            ammunation7: new BoxZone([2568.59, 297.27, 108.73], 11.8, 7.8, { heading: 0, minZ: 107.73, maxZ: 110.73 }),
            ammunation8: new BoxZone([-1116.34, 2695.86, 18.55], 11.8, 7.8, { heading: 42, minZ: 17.55, maxZ: 20.55 }),
            ammunation9: new BoxZone([843.13, -1030.66, 28.19], 11.8, 7.8, { heading: 0, minZ: 27.19, maxZ: 30.19 }),
            ammunation10: new BoxZone([-3169.31, 1085.86, 20.84], 11.8, 7.8, { heading: 65, minZ: 19.84, maxZ: 21.84 }),
            ammunation11: new BoxZone([-1308.72, -392.85, 36.7], 11.8, 7.8, { heading: 75, minZ: 35.7, maxZ: 37.7 }),
        };
    }
}
