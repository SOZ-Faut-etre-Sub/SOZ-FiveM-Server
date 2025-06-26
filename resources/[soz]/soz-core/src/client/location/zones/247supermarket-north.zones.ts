import { Injectable } from '@public/core/decorators/injectable';
import { BoxZone } from '@public/shared/polyzone/box.zone';

import { LocationZone } from './zones.interface';

@Injectable('LocationZone')
export class SupermarketNorthZones implements LocationZone {
    get id(): string {
        return '247supermarket-north';
    }

    get zones(): Record<string, BoxZone> {
        return {
            '247supermarket4': new BoxZone([1732.86, 6414.78, 35.04], 7.2, 11.0, {
                heading: 334,
                minZ: 34.04,
                maxZ: 37.04,
            }),
            '247supermarket5': new BoxZone([1963.23, 3743.93, 32.34], 7.2, 11.0, {
                heading: 30,
                minZ: 31.34,
                maxZ: 34.34,
            }),
            '247supermarket6': new BoxZone([544.69, 2668.9, 42.16], 7.2, 11.0, {
                heading: 8,
                minZ: 41.16,
                maxZ: 44.16,
            }),
            '247supermarket7': new BoxZone([2678.7, 3284.4, 55.24], 7.2, 11.0, {
                heading: 241,
                minZ: 54.24,
                maxZ: 57.24,
            }),
            '247supermarket10': new BoxZone([-2543.93, 2311.76, 33.41], 7.2, 11.0, {
                heading: 4,
                minZ: 32.41,
                maxZ: 35.41,
            }),
            '247supermarket11': new BoxZone([165.17, 6639.56, 31.71], 7.2, 11.0, {
                heading: 135,
                minZ: 30.71,
                maxZ: 33.71,
            }),
        };
    }
}
